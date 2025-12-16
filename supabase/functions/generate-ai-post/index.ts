import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  topic: string;
  targetAudience?: string;
  region?: string;
  keywords?: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  cta?: string;
  generationId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar usuário
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Usuário não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificar assinatura ativa
    const { data: subscription } = await supabase
      .from('ai_subscriptions')
      .select('*, ai_plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .single();

    if (!subscription) {
      return new Response(JSON.stringify({ error: 'Assinatura ativa necessária', code: 'NO_SUBSCRIPTION' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: GenerateRequest = await req.json();
    const { topic, targetAudience, region, keywords, tone, length, cta, generationId } = body;

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Tema é obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Se é regeneração, verificar limite
    if (generationId) {
      const { data: existingGen } = await supabase
        .from('ai_generations')
        .select('regeneration_count')
        .eq('id', generationId)
        .eq('user_id', user.id)
        .single();

      if (existingGen && existingGen.regeneration_count >= 5) {
        return new Response(JSON.stringify({ error: 'Limite de regenerações atingido (máx. 5)', code: 'REGEN_LIMIT' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Rate limiting: máx 10 gerações por dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count } = await supabase
      .from('ai_generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString());

    if ((count || 0) >= 10) {
      return new Response(JSON.stringify({ error: 'Limite diário de gerações atingido (máx. 10)', code: 'DAILY_LIMIT' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lengthMap = {
      short: '800-1000 palavras',
      medium: '1200-1500 palavras',
      long: '1800-2200 palavras'
    };

    const wordCount = lengthMap[length || 'medium'];
    const toneDesc = tone || 'profissional, claro, acessível, sem juridiquês';

    const systemPrompt = `Você é um redator jurídico especializado em criar conteúdo informativo para escritórios de advocacia. 
Seu objetivo é criar posts de blog que sejam:
- Informativos e educacionais (NUNCA parecer consultoria individual)
- Otimizados para SEO
- Fáceis de ler (parágrafos curtos, listas, subtítulos)
- Tom: ${toneDesc}

REGRAS IMPORTANTES:
- NUNCA prometer resultados ou garantias
- NUNCA dar conselho jurídico específico
- Sempre manter tom geral e informativo
- Incluir disclaimer ao final

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`json).`;

    const userPrompt = `Crie um post completo sobre: "${topic}"

${targetAudience ? `Público-alvo: ${targetAudience}` : ''}
${region ? `Região/Cidade para SEO local: ${region}` : ''}
${keywords ? `Palavras-chave principais: ${keywords}` : ''}
${cta ? `CTA final desejado: ${cta}` : 'CTA: "Entre em contato para saber mais"'}

Tamanho: ${wordCount}

Retorne um JSON com esta estrutura exata:
{
  "title": "Título H1 otimizado para SEO",
  "metaTitle": "Meta title até 60 caracteres",
  "metaDescription": "Meta description até 155 caracteres",
  "slug": "slug-em-kebab-case",
  "content": "<p>Conteúdo HTML completo com:</p><h2>Subtítulos H2/H3</h2><p>Parágrafos curtos</p><ul><li>Listas quando apropriado</li></ul><h2>Perguntas Frequentes</h2><h3>Pergunta 1?</h3><p>Resposta objetiva</p>... (3-6 FAQs) ... <h2>Conclusão</h2><p>Texto de conclusão + CTA</p><p><em>Este conteúdo é meramente informativo e não constitui aconselhamento jurídico. Para análise do seu caso específico, consulte um advogado.</em></p>",
  "faqs": [
    {"question": "Pergunta 1?", "answer": "Resposta 1"},
    {"question": "Pergunta 2?", "answer": "Resposta 2"}
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requisições da IA atingido. Tente novamente em alguns minutos.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('Erro ao gerar conteúdo com IA');
    }

    const aiResponse = await response.json();
    const generatedText = aiResponse.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse JSON da resposta
    let parsedContent;
    try {
      // Remove possíveis blocos de código markdown
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      parsedContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Raw:', generatedText);
      throw new Error('Erro ao processar resposta da IA');
    }

    const inputsJson = { topic, targetAudience, region, keywords, tone, length, cta };

    // Salvar ou atualizar geração
    if (generationId) {
      // Atualizar regeneração
      await supabase
        .from('ai_generations')
        .update({
          output_json: parsedContent,
          regeneration_count: supabase.rpc('increment', { row_id: generationId })
        })
        .eq('id', generationId);

      // Incrementar manualmente
      const { data: currentGen } = await supabase
        .from('ai_generations')
        .select('regeneration_count')
        .eq('id', generationId)
        .single();

      await supabase
        .from('ai_generations')
        .update({ 
          output_json: parsedContent,
          regeneration_count: (currentGen?.regeneration_count || 0) + 1 
        })
        .eq('id', generationId);

      return new Response(JSON.stringify({ 
        success: true, 
        generationId,
        data: parsedContent 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Nova geração
      const { data: newGen, error: insertError } = await supabase
        .from('ai_generations')
        .insert({
          user_id: user.id,
          topic,
          inputs_json: inputsJson,
          output_json: parsedContent,
          regeneration_count: 0,
          published: false
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Erro ao salvar geração');
      }

      return new Response(JSON.stringify({ 
        success: true, 
        generationId: newGen.id,
        data: parsedContent 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-ai-post:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro interno' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
