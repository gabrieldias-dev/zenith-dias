/* ══════════════════════════════════════════════════════════════════════════
   ZENITH DIAS — comportamento
   Sem dependências. Um único laço de scroll em requestAnimationFrame.
   Tudo que anima é opacity ou transform.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══ CONFIGURAÇÃO DE CONTATO ══════════════════════════════════════════════
     ÚNICO lugar do site com dados de contato. Enquanto um valor estiver
     entre colchetes, ele aparece na página marcado como pendência — nada é
     inventado. Ver PENDENCIAS.md, itens 01 e 02.                            */
  var CONTATO = {
    email:     '[E-MAIL DO ESTÚDIO]',
    whatsapp:  '[WHATSAPP]',          // só dígitos, ex.: 5511999999999
    instagram: '[INSTAGRAM]',         // sem @, ex.: zenithdias
    linkedin:  '[LINKEDIN]'           // trecho final da URL, ex.: company/zenithdias
  };

  /* ══ BASE ═══════════════════════════════════════════════════════════════ */
  var html = document.documentElement;
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fino = window.matchMedia('(pointer: fine) and (min-width: 64rem)');

  function q(s, ctx) { return (ctx || document).querySelector(s); }
  function qa(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }
  function limita(v, a, b) { return v < a ? a : v > b ? b : v; }
  function pendente(v) { return typeof v !== 'string' || v.indexOf('[') === 0; }
  function doisDig(n) { return (n < 10 ? '0' : '') + n; }

  /* ══ 01 LOADER ══════════════════════════════════════════════════════════ */
  function loader() {
    var el = q('#loader');
    if (!el) { html.classList.add('is-ready'); return; }

    if (html.classList.contains('sem-loader')) {
      el.parentNode.removeChild(el);
      return;
    }

    var num = q('#loader-num');
    var fio = q('#loader-fio');
    var passos = [0, 25, 50, 75, 100];
    var i = 0;

    html.classList.add('is-travado');

    function passo() {
      var v = passos[i];
      num.textContent = v === 100 ? '100' : doisDig(v);
      fio.style.width = v + '%';
      if (v === 100) {
        // 100• — o contador termina no Zenith Point.
        var pt = document.createElement('span');
        pt.className = 'loader__pt';
        pt.textContent = '•';
        num.appendChild(pt);
      }
      i++;
      if (i < passos.length) {
        setTimeout(passo, i === 1 ? 130 : 170);
      } else {
        setTimeout(fim, 340);
      }
    }

    function fim() {
      el.classList.add('is-fora');
      html.classList.remove('is-travado');
      html.classList.add('is-ready');
      try { sessionStorage.setItem('zd:entrada', '1'); } catch (e) {}
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
    }

    // Trava de segurança: se algo travar, o loader sai de qualquer jeito.
    setTimeout(function () {
      if (!html.classList.contains('is-ready')) fim();
    }, 3500);

    setTimeout(passo, 120);
  }

  /* ══ 02 PALAVRA POR PALAVRA ═════════════════════════════════════════════ */
  function fatiaPalavras() {
    qa('[data-palavras]').forEach(function (el) {
      var palavras = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      palavras.forEach(function (p, i) {
        var fora = document.createElement('span');
        fora.className = 'pv';
        var dentro = document.createElement('span');
        dentro.textContent = p;
        dentro.style.setProperty('--d', (i * 0.055).toFixed(3) + 's');
        fora.appendChild(dentro);
        el.appendChild(fora);
        if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* ══ 03 REVEAL ══════════════════════════════════════════════════════════ */
  function reveals() {
    var alvos = qa('[data-reveal], [data-linhas], [data-palavras]');

    if (!('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ══ 04 SCROLL — um laço só ═════════════════════════════════════════════ */
  function scroll() {
    var cabeca = q('#cabeca');
    var medidor = q('#medidor');
    var medidorNum = q('#medidor-num');
    var hero = q('#hero');
    var conv = q('#convergencia');
    var pista = conv ? q('.convergencia__pista', conv) : null;
    var delta = q('#conv-delta');

    var agendado = false;
    var ultimoSp = -1;
    var ultimoDelta = -1;

    function desenha() {
      agendado = false;
      var y = window.pageYOffset || html.scrollTop;
      var vh = window.innerHeight;

      /* header */
      if (cabeca) cabeca.classList.toggle('is-fixo', y > 24);

      /* medidor: 00 embaixo, 100• em cima */
      var alcance = (html.scrollHeight - vh) || 1;
      var sp = limita(y / alcance, 0, 1);
      if (medidor && Math.abs(sp - ultimoSp) > 0.001) {
        medidor.style.setProperty('--sp', sp.toFixed(4));
        var pct = Math.round(sp * 100);
        medidorNum.textContent = pct === 100 ? '100' : doisDig(pct);
        ultimoSp = sp;
      }

      /* parallax leve do hero */
      if (hero) {
        var hs = limita(y / (hero.offsetHeight || vh), 0, 1);
        hero.style.setProperty('--hs', hs.toFixed(4));
      }

      /* convergência */
      if (pista) {
        var r = pista.getBoundingClientRect();
        var total = (r.height - vh) || 1;
        var bruto = limita(-r.top / total, 0, 1);
        var p = limita(bruto / 0.8, 0, 1);     // converge em 80% e segura
        conv.style.setProperty('--p', p.toFixed(4));
        var d = Math.round(42 * (1 - p));
        if (d !== ultimoDelta) { delta.textContent = doisDig(d); ultimoDelta = d; }
      }
    }

    function pede() {
      if (!agendado) { agendado = true; requestAnimationFrame(desenha); }
    }

    window.addEventListener('scroll', pede, { passive: true });
    window.addEventListener('resize', pede);
    desenha();
  }

  /* ══ 05 SEÇÃO ATUAL NA NAVEGAÇÃO ════════════════════════════════════════ */
  function navAtual() {
    if (!('IntersectionObserver' in window)) return;
    var links = qa('.nav a');
    var mapa = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) mapa[id] = { link: a, sec: sec };
    });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var id = e.target.id;
        if (!mapa[id]) return;
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-atual'); });
          mapa[id].link.classList.add('is-atual');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(mapa).forEach(function (id) { obs.observe(mapa[id].sec); });
  }

  /* ══ 06 CURSOR ══════════════════════════════════════════════════════════ */
  function cursor() {
    if (calmo.matches || !fino.matches) return;
    var el = q('#cursor');
    var rot = q('#cursor-rotulo');
    if (!el) return;

    html.classList.add('cursor-on');

    var ax = window.innerWidth / 2, ay = window.innerHeight / 2;
    var x = ax, y = ay;
    var vivo = false;

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      ax = e.clientX; ay = e.clientY;
      if (!vivo) { vivo = true; x = ax; y = ay; laco(); }
    }, { passive: true });

    function laco() {
      x += (ax - x) * 0.22;
      y += (ay - y) * 0.22;
      el.style.setProperty('--cx', x.toFixed(2) + 'px');
      el.style.setProperty('--cy', y.toFixed(2) + 'px');
      requestAnimationFrame(laco);
    }

    document.addEventListener('pointerover', function (e) {
      var alvo = e.target;
      if (!alvo || alvo.nodeType !== 1) return;

      var chapa = alvo.closest('[data-cursor]');
      var texto = alvo.closest('input, textarea');
      var link = alvo.closest('a, button, label.ficha');

      el.classList.remove('em-chapa', 'em-link', 'em-texto');

      if (chapa) {
        el.classList.add('em-chapa');
        rot.textContent = chapa.getAttribute('data-cursor') || 'VIEW';
      } else if (texto) {
        el.classList.add('em-texto');
        rot.textContent = '';
      } else if (link) {
        el.classList.add('em-link');
        rot.textContent = '↗';
      } else {
        rot.textContent = '';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () { el.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { el.style.opacity = '1'; });
  }

  /* ══ 07 MAGNETISMO LEVE ═════════════════════════════════════════════════ */
  function magnetismo() {
    if (calmo.matches || !fino.matches) return;

    qa('[data-magnetico]').forEach(function (el) {
      function move(e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.14;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
        el.style.transform = 'translate(' + limita(dx, -7, 7).toFixed(2) + 'px,' +
                                            limita(dy, -5, 5).toFixed(2) + 'px)';
      }
      function sai() { el.style.transform = ''; }

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', sai);
      el.addEventListener('blur', sai);
    });
  }

  /* ══ 08 PLANTAS DOS PROJETOS ════════════════════════════════════════════ */
  function plantas() {
    if (calmo.matches || !fino.matches) return;

    qa('[data-projeto]').forEach(function (item) {
      var quadro = q('.chapa__quadro', item);
      var planta = q('.planta', item);
      if (!quadro || !planta) return;

      quadro.addEventListener('pointermove', function (e) {
        var r = quadro.getBoundingClientRect();
        planta.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        planta.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });

      quadro.addEventListener('pointerleave', function () {
        planta.style.setProperty('--mx', '0');
        planta.style.setProperty('--my', '0');
      });
    });
  }

  /* ══ 09 CAPABILITIES — accordion ════════════════════════════════════════ */
  function servicos() {
    var itens = qa('[data-servico]');
    var fixado = null;

    function abre(item, on) {
      item.classList.toggle('is-aberto', on);
      q('.servico__cab', item).setAttribute('aria-expanded', on ? 'true' : 'false');
    }

    itens.forEach(function (item) {
      var btn = q('.servico__cab', item);

      btn.addEventListener('click', function () {
        var jaAberto = item.classList.contains('is-aberto') && fixado === item;
        itens.forEach(function (o) { abre(o, false); });
        if (jaAberto) { fixado = null; }
        else { abre(item, true); fixado = item; }
      });

      // No desktop, passar o mouse já revela — sem alterar o que está fixado.
      if (fino.matches && !calmo.matches) {
        item.addEventListener('pointerenter', function () {
          if (fixado) return;
          itens.forEach(function (o) { abre(o, o === item); });
        });
        item.addEventListener('pointerleave', function () {
          if (fixado) return;
          abre(item, false);
        });
      }
    });

    // Primeiro item aberto por padrão: a seção nunca aparece vazia.
    if (itens.length) abre(itens[0], true);
  }

  /* ══ 10 MENU MOBILE ═════════════════════════════════════════════════════ */
  function menu() {
    var btn = q('#menu-btn');
    var painel = q('#menu');
    if (!btn || !painel) return;

    qa('a', painel).forEach(function (a, i) { a.style.setProperty('--i', i); });

    function estado(on) {
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      painel.hidden = !on;
      html.classList.toggle('menu-aberto', on);
      html.classList.toggle('is-travado', on);
      if (on) { var p = q('a', painel); if (p) p.focus(); } else { btn.focus(); }
    }

    btn.addEventListener('click', function () {
      estado(btn.getAttribute('aria-expanded') !== 'true');
    });

    qa('a', painel).forEach(function (a) {
      a.addEventListener('click', function () { estado(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') estado(false);
    });

    // Ao passar para o desktop, o menu não pode ficar preso aberto.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960 && btn.getAttribute('aria-expanded') === 'true') estado(false);
    });
  }

  /* ══ 11 CANAIS DE CONTATO ═══════════════════════════════════════════════ */
  function canais() {
    var lista = q('#canais-lista');
    var social = q('#pe-social');

    function linha(rotulo, valor, href) {
      var li = document.createElement('li');

      if (pendente(valor)) {
        var caixa = document.createElement('span');
        caixa.appendChild(document.createTextNode(rotulo));
        var marca = document.createElement('span');
        marca.className = 'pendente';
        marca.textContent = 'PENDENTE';
        caixa.appendChild(marca);
        li.appendChild(caixa);
        return li;
      }

      var a = document.createElement('a');
      a.href = href;
      if (href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      var txt = document.createElement('span');
      txt.textContent = valor;
      var seta = document.createElement('i');
      seta.setAttribute('aria-hidden', 'true');
      seta.textContent = '↗';
      a.appendChild(txt);
      a.appendChild(seta);
      li.appendChild(a);
      return li;
    }

    if (lista) {
      lista.appendChild(linha('E-mail', CONTATO.email, 'mailto:' + CONTATO.email));
      lista.appendChild(linha('WhatsApp',
        pendente(CONTATO.whatsapp) ? CONTATO.whatsapp : 'WhatsApp',
        'https://wa.me/' + CONTATO.whatsapp));
    }

    if (social) {
      var redes = [
        ['Instagram', CONTATO.instagram, 'https://instagram.com/' + CONTATO.instagram],
        ['LinkedIn', CONTATO.linkedin, 'https://linkedin.com/' + CONTATO.linkedin]
      ];
      redes.forEach(function (r) {
        var li = document.createElement('li');
        if (pendente(r[1])) {
          li.appendChild(document.createTextNode(r[0] + ' '));
          var marca = document.createElement('span');
          marca.className = 'pendente';
          marca.textContent = 'PENDENTE';
          li.appendChild(marca);
        } else {
          var a = document.createElement('a');
          a.href = r[2];
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = r[0];
          li.appendChild(a);
        }
        social.appendChild(li);
      });
    }
  }

  /* ══ 12 FORMULÁRIO ══════════════════════════════════════════════════════ */
  function form() {
    var f = q('#form');
    if (!f) return;
    var status = q('#form-status');

    var obrigatorios = [
      ['f-nome', 'Informe seu nome'],
      ['f-email', 'Informe um e-mail válido'],
      ['f-objetivo', 'Descreva o objetivo do projeto']
    ];

    function erro(id, msg) {
      var campo = document.getElementById(id).closest('.campo');
      campo.classList.toggle('tem-erro', !!msg);
      var alvo = q('[data-erro-de="' + id + '"]', campo);
      if (alvo) alvo.textContent = msg || '';
    }

    function valida() {
      var ok = true, primeiro = null;
      obrigatorios.forEach(function (par) {
        var el = document.getElementById(par[0]);
        var v = el.value.trim();
        var bom = par[0] === 'f-email'
          ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
          : v.length > 1;
        erro(par[0], bom ? '' : par[1]);
        if (!bom) { ok = false; if (!primeiro) primeiro = el; }
      });
      if (primeiro) primeiro.focus();
      return ok;
    }

    qa('input, textarea', f).forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.closest('.campo').classList.contains('tem-erro')) erro(el.id, '');
      });
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      status.classList.remove('is-erro');

      if (!valida()) {
        status.textContent = 'Revise os campos destacados.';
        status.classList.add('is-erro');
        return;
      }

      var d = new FormData(f);
      function v(k) { return (d.get(k) || '').toString().trim() || '—'; }

      var corpo = [
        'BRIEFING INICIAL — ZENITH DIAS',
        '',
        'Nome: ' + v('nome'),
        'Empresa: ' + v('empresa'),
        'E-mail: ' + v('email'),
        'Site atual: ' + v('site'),
        '',
        'Objetivo principal:',
        v('objetivo'),
        '',
        'Faixa de investimento: ' + v('investimento'),
        'Início pretendido: ' + v('prazo'),
        '',
        'Mensagem adicional:',
        v('mensagem')
      ].join('\n');

      if (pendente(CONTATO.email)) {
        status.textContent = 'Canal de envio ainda não configurado — use os canais diretos ao lado.';
        status.classList.add('is-erro');
        return;
      }

      var url = 'mailto:' + CONTATO.email +
                '?subject=' + encodeURIComponent('Project request — ' + v('empresa')) +
                '&body=' + encodeURIComponent(corpo);

      window.location.href = url;
      status.textContent = 'Abrindo seu aplicativo de e-mail com o briefing preenchido.';
    });
  }

  /* ══ PARTIDA ════════════════════════════════════════════════════════════ */
  function inicia() {
    fatiaPalavras();
    canais();
    servicos();
    menu();
    form();
    scroll();
    navAtual();
    cursor();
    magnetismo();
    plantas();

    // Os reveals esperam o loader, para o hero entrar depois da transição.
    if (html.classList.contains('is-ready')) reveals();
    else {
      var esperando = setInterval(function () {
        if (html.classList.contains('is-ready')) { clearInterval(esperando); reveals(); }
      }, 60);
    }
  }

  loader();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicia);
  } else {
    inicia();
  }
})();
