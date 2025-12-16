import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting - store IP submissions (in-memory, resets on function restart)
const rateLimitMap = new Map<string, { count: number; lastSubmit: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

// Spam detection patterns
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|prize|claim|bitcoin|crypto)\b/i,
  /https?:\/\/[^\s]+\.(ru|cn|tk|ml|ga|cf)\b/i,
  /<[^>]*script[^>]*>/i,
  /\[url=/i,
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    
    // Rate limiting check
    const now = Date.now();
    const rateData = rateLimitMap.get(clientIP);
    
    if (rateData) {
      if (now - rateData.lastSubmit < RATE_LIMIT_WINDOW) {
        if (rateData.count >= MAX_REQUESTS_PER_WINDOW) {
          console.log(`Rate limit exceeded for IP: ${clientIP}`);
          return new Response(JSON.stringify({ 
            error: 'Muitas tentativas. Aguarde um minuto antes de tentar novamente.' 
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        rateData.count++;
      } else {
        rateData.count = 1;
        rateData.lastSubmit = now;
      }
    } else {
      rateLimitMap.set(clientIP, { count: 1, lastSubmit: now });
    }

    const body = await req.json();
    const { nome, email, telefone, assunto, mensagem, website, timestamp } = body;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.trim() !== '') {
      console.log(`Honeypot triggered for IP: ${clientIP}`);
      // Return success to bot to not reveal detection
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Time-based check - form filled too quickly (less than 3 seconds)
    if (timestamp) {
      const submitTime = Date.now() - timestamp;
      if (submitTime < 3000) {
        console.log(`Form submitted too quickly (${submitTime}ms) for IP: ${clientIP}`);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Basic field validation
    if (!nome || !email || !telefone || !assunto || !mensagem) {
      return new Response(JSON.stringify({ error: 'Todos os campos são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'E-mail inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Field length validation
    if (nome.length > 100 || email.length > 255 || telefone.length > 20 || mensagem.length > 5000) {
      return new Response(JSON.stringify({ error: 'Campos excedem o tamanho permitido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Spam content detection
    const fullContent = `${nome} ${email} ${mensagem}`;
    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(fullContent)) {
        console.log(`Spam pattern detected for IP: ${clientIP}`);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Sanitize inputs
    const sanitize = (str: string) => str.replace(/[<>]/g, '').trim();
    const safeName = sanitize(nome);
    const safeEmail = sanitize(email);
    const safePhone = sanitize(telefone);
    const safeSubject = sanitize(assunto);
    const safeMessage = sanitize(mensagem);

    // Save lead to database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { error: dbError } = await supabase
      .from('leads')
      .insert({
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        subject: safeSubject,
        message: safeMessage,
        source_page: 'contato',
        status: 'new',
      });

    if (dbError) {
      console.error('Error saving lead:', dbError);
    }

    // Send email via Resend
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Serviço de email não configurado' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Contato Site <contato@savioadv.com.br>',
        to: ['juridico@savioadv.com.br'],
        reply_to: safeEmail,
        subject: `Novo contato do site - ${safeSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px;">
              Nova mensagem do site
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Nome:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>E-mail:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <a href="mailto:${safeEmail}">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Telefone:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <a href="tel:${safePhone}">${safePhone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Assunto:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${safeSubject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <strong>Mensagem:</strong>
              <div style="background: #f7fafc; padding: 15px; border-radius: 5px; margin-top: 10px;">
                ${safeMessage.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #718096; font-size: 12px; margin-top: 20px;">
              Mensagem enviada através do formulário de contato do site.
            </p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`Email sent successfully to juridico@savioadv.com.br from ${safeEmail}`);
      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      const error = await res.text();
      console.error('Resend API error:', error);
      return new Response(JSON.stringify({ error: 'Erro ao enviar email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
