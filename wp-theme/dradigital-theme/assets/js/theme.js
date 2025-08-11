// Minimal theme interactions
(function(){
  const links = document.querySelectorAll('a[href^="#"]');
  for (const a of links) {
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }
})();
