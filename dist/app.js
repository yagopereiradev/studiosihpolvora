'use strict';
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = 'https://wa.me/5511940566532';

  /* ---------- Preloader / cortina de abertura ---------- */
  const preloader = $('#preloader');
  function finishLoading() {
    if (!document.body.classList.contains('is-loading')) return;
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    if (preloader) {
      preloader.classList.add('is-done');
      setTimeout(() => preloader.remove(), 1200);
    }
  }
  if (reducedMotion) {
    finishLoading();
  } else {
    const minShow = new Promise(r => setTimeout(r, 1500));
    const loaded = new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
    Promise.all([minShow, loaded]).then(finishLoading);
    setTimeout(finishLoading, 3500);
  }

  /* ---------- Títulos palavra por palavra ---------- */
  $$('h2').forEach(h2 => {
    let index = 0;
    const wrapWords = node => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.style.setProperty('--w', index++);
            span.textContent = part;
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapWords(child);
        }
      });
    };
    wrapWords(h2);
    h2.classList.add('split');
  });

  /* ---------- Luz que segue o mouse no hero ---------- */
  const heroEl = $('.hero');
  if (heroEl && matchMedia('(hover: hover)').matches && !reducedMotion) {
    heroEl.addEventListener('pointermove', e => {
      const r = heroEl.getBoundingClientRect();
      heroEl.style.setProperty('--mx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
      heroEl.style.setProperty('--my', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    });
  }

  /* ---------- Inclinação 3D nos passos ---------- */
  if (matchMedia('(hover: hover)').matches && !reducedMotion) {
    $$('.step-list li').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Header, progresso e botão flutuante ---------- */
  const header = $('.header');
  const progress = $('.progress span');
  const floatBtn = $('.float-whatsapp');
  const hero = $('.hero');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
      floatBtn.classList.toggle('is-visible', y > (hero ? hero.offsetHeight * 0.6 : 400));
      parallax(y);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Parallax (desativado com prefers-reduced-motion) ---------- */
  const heroMedia = $('[data-parallax]');
  const parallaxItems = $$('[data-parallax-y]');
  function parallax(y) {
    if (reducedMotion) return;
    if (heroMedia && y < innerHeight * 1.2) {
      heroMedia.style.transform = `translate3d(0,${y * 0.28}px,0)`;
    }
    parallaxItems.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - innerHeight / 2;
      const factor = parseFloat(el.dataset.parallaxY) || 0;
      el.style.transform = `translate3d(0,${center * factor}px,0)`;
    });
  }

  /* ---------- Menu mobile ---------- */
  const toggle = $('.menu-toggle');
  const menu = $('#menu-mobile');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      $('a', menu).focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 420);
    }
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  matchMedia('(min-width: 921px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Reveal ao rolar ---------- */
  const revealItems = $$('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach(el => io.observe(el));
  }

  /* ---------- Spotlight nos protocolos ---------- */
  if (matchMedia('(hover: hover)').matches) {
    $$('.service').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Lightbox da galeria ---------- */
  const lightbox = $('#lightbox');
  const lightboxImg = $('img', lightbox);
  let lastFocus = null;
  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    $('.lightbox-close', lightbox).focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    setTimeout(() => { lightbox.hidden = true; lightboxImg.src = ''; }, 360);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $$('.tile').forEach(tile => tile.addEventListener('click', () => {
    openLightbox(tile.dataset.full, $('img', tile).alt);
  }));
  lightbox.addEventListener('click', e => { if (e.target !== lightboxImg) closeLightbox(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  /* ---------- Formulário de solicitação ---------- */
  const form = $('#booking-form');
  const nameInput = form.elements.name;
  const serviceInput = form.elements.service;
  const dateInput = form.elements.date;
  const periodInput = form.elements.period;
  const errorBox = $('#form-error');
  const result = $('#request-result');
  const preview = $('#message-preview');
  const sendLink = $('#send-request');
  const copyBtn = $('#copy-request');

  const todayInSaoPaulo = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  dateInput.min = todayInSaoPaulo();

  $$('[data-service]').forEach(button => button.addEventListener('click', () => {
    serviceInput.value = button.dataset.service;
    result.hidden = true;
    $('#agendamento').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    setTimeout(() => nameInput.focus({ preventScroll: true }), reducedMotion ? 0 : 600);
  }));

  function showError(msg, field) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (field) { field.classList.add('is-invalid'); field.focus({ preventScroll: true }); }
  }
  function clearErrors() {
    errorBox.hidden = true;
    errorBox.textContent = '';
    $$('.is-invalid', form).forEach(el => el.classList.remove('is-invalid'));
  }
  function validatePreference() {
    if (!dateInput.value) return null;
    const day = new Date(dateInput.value + 'T12:00:00').getDay();
    if (dateInput.value < todayInSaoPaulo()) return { msg: 'Escolha uma data a partir de hoje.', field: dateInput };
    if (day === 0 || day === 1) return { msg: 'Não atendemos domingo e segunda. Escolha uma data de terça a sábado.', field: dateInput };
    if (day === 6 && periodInput.value === 'Tarde') return { msg: 'Aos sábados atendemos das 9h às 12h. Selecione manhã ou sem preferência.', field: periodInput };
    return null;
  }

  form.addEventListener('input', () => { result.hidden = true; clearErrors(); });

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    dateInput.min = todayInSaoPaulo();
    const name = nameInput.value.trim();
    if (!name) return showError('Informe seu primeiro nome.', nameInput);
    if (!serviceInput.value) return showError('Selecione o serviço que você procura.', serviceInput);
    const pref = validatePreference();
    if (pref) return showError(pref.msg, pref.field);

    const date = dateInput.value;
    const dateText = date ? date.split('-').reverse().join('/') : '';
    const period = periodInput.value;
    const isQuestion = serviceInput.value === 'Quero tirar uma dúvida';
    const lines = [
      `Oi, Studio Sih Pólvora! Tudo bem?`,
      ``,
      isQuestion
        ? `Meu nome é ${name} e quero tirar uma dúvida sobre os atendimentos.`
        : `Meu nome é ${name} e quero agendar: ${serviceInput.value}.`
    ];
    if (!isQuestion) {
      lines.push(date ? `Tenho preferência para o dia ${dateText}.` : `Ainda não tenho uma data fechada.`);
      lines.push(period === 'Sem preferência' ? `Não tenho preferência de período.` : `Prefiro o período da ${period.toLowerCase()}.`);
      lines.push(``, `Vocês conseguem me passar os horários disponíveis e valores?`);
      lines.push(`Sei que o horário só fica reservado depois da confirmação de vocês.`);
    } else {
      lines.push(``, `Podem me ajudar?`);
    }
    const message = lines.join('\n');
    preview.textContent = message;
    sendLink.href = `${WHATSAPP}?text=${encodeURIComponent(message)}`;
    result.hidden = false;
    copyBtn.textContent = 'Copiar mensagem';
    result.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest' });
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.textContent);
      copyBtn.textContent = 'Copiado!';
    } catch {
      copyBtn.textContent = 'Selecione e copie o texto acima';
    }
    setTimeout(() => { copyBtn.textContent = 'Copiar mensagem'; }, 2500);
  });

  /* ---------- Ferramenta para agentes (WebMCP), sem reservar nem enviar ---------- */
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    const allowed = () => Array.from(serviceInput.options).map(o => o.value).filter(Boolean);
    try {
      Promise.resolve(document.modelContext.registerTool({
        name: 'select_studio_service',
        title: 'Selecionar serviço do studio',
        description: 'Seleciona um serviço no formulário visível. Não reserva horários e não envia mensagens.',
        inputSchema: { type: 'object', properties: { service: { type: 'string', enum: allowed() } }, required: ['service'], additionalProperties: false },
        annotations: { readOnlyHint: false },
        execute(input) {
          if (!input || typeof input.service !== 'string' || !allowed().includes(input.service)) throw new Error('Serviço inválido.');
          serviceInput.value = input.service;
          result.hidden = true;
          $('#agendamento').scrollIntoView();
          return { selectedService: serviceInput.value, status: 'preference_selected', bookingConfirmed: false };
        }
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch {}
    addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }

  /* ---------- Marquee: fallback em JS se a animação CSS não rodar ---------- */
  $$('[data-marquee]').forEach(track => {
    const initial = getComputedStyle(track).transform;
    setTimeout(() => {
      if (getComputedStyle(track).transform !== initial) return; // CSS está animando
      track.style.animation = 'none';
      const reverse = track.classList.contains('reverse');
      const speed = parseFloat(track.dataset.speed) || 60; // px por segundo
      let x = reverse ? -track.scrollWidth / 2 : 0;
      let last = performance.now();
      const step = now => {
        const half = track.scrollWidth / 2;
        const dt = Math.min(48, now - last) / 1000; last = now;
        x += (reverse ? speed : -speed) * dt;
        if (x <= -half) x += half;
        if (x >= 0) x -= half;
        track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 1200);
  });

  /* ---------- Rodapé ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
