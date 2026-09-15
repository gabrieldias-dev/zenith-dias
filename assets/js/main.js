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
  html.classList.add('zd-ok');   // avisa a rede de seguranca do <head> que o JS chegou
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
      fio.style.setProperty('--v', v / 100);   // scaleX, não width
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

  /* Estado final de tudo, sem animação. É a rede de segurança: conteúdo
     escondido em opacity 0 esperando um observador que nunca veio é a pior
     falha possível deste site — a página fica em branco. */
  var observadorAtivo = false;

  function mostraTudo() {
    qa('[data-reveal], [data-linhas], [data-palavras]').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  function reveals() {
    var alvos = qa('[data-reveal], [data-linhas], [data-palavras]');

    if (!('IntersectionObserver' in window)) {
      mostraTudo();
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
    observadorAtivo = true;
  }

  /* ══ 03c A ESTRELA DO HERO ══════════════════════════════════════════════
     Um ponto — o Zenith Point — e uma onda que atravessa a tela inteira,
     para, e volta depois de um silencio.

     O que ela quer dizer, para quem perguntar: o ponto e a marca, a onda e o
     alcance. O ponto nao anda, nao cresce e nao fica mais importante; o que
     muda e ate onde ele chega. E a leitura literal de "Presence, elevated" —
     presenca nao e existir, e alcancar quem esta longe.

     Escolhida pelo Gabriel em 14/09/2026 entre cinco fundos construidos e
     testados; os descartados ficaram em estudos/fundo-vivo.html.           */
  var ESTRELA = {
    base: 4100,      // intervalo medio entre batidas
    variacao: 800,   // ... com folga: metronomo le como maquina
    /* Quanto a onda leva para atravessar e apagar. Subiu de 2000 para 2600
       em 15/09/2026: a pedido do Gabriel, a frente cruza a area visivel em
       1,35s em vez de 1,04s.

       ESTE NUMERO TEM TETO, e o teto e o silencio. A onda sai da tela em
       pp=0,52, mas a imagem revelada fica ate pp=0,94 — a coroa da revelacao
       tem 640px de cauda ATRAS da frente. Entao o que ocupa a tela nao e
       dur*0,52, e dur*0,94. Com intervalo minimo de 3300ms (base 4100 menos
       a variacao de 800):

         dur 2600  ->  856ms de silencio no intervalo mais curto
         dur 2800  ->  668ms
         dur 3200  ->  292ms
         dur 3600  ->  nenhum: as ondas encavalam

       E o silencio e metade do efeito. Para ir alem de 2800 sem perde-lo, o
       que tem de subir junto e base. */
    dur: 2600,
    eco: 210,        // a segunda batida, o "ta" do "tum-ta"
    ecoForca: 0.42,
    primeira: 1400,  // deixa a entrada do hero terminar antes da 1a batida
    ondas: 2,        // DUAS, nao tres: a frente modulada ja tem informacao
                     // propria, e tres ondulacoes onduladas viram renda
    atraso: 280      // defasagem entre a crista e a ondulacao de tras
  };

  /* Os instantes das batidas sao sorteados UMA vez, com semente fixa: o
     ritmo e sempre o mesmo em qualquer carga, e e irregular de proposito. */
  var BATIDAS = (function () {
    var lista = [], t = ESTRELA.primeira, s = 20260914;
    function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
    for (var i = 0; i < 400; i++) {
      lista.push(t);
      t += ESTRELA.base + (rnd() - 0.5) * 2 * ESTRELA.variacao;
    }
    return lista;
  })();

  function estrela() {
    var cv = q('#estrela');
    var hero = q('#hero');
    if (!cv || !hero || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;

    var AZUL = [88, 98, 232];
    var larg = 0, alt = 0, esc = 1;
    var t0 = 0, laco = null, visivel = true, oculto = false;

    /* Mede o PROPRIO canvas, e em clientWidth: getBoundingClientRect do hero
       podia estar defasado do que o canvas ja ocupa, e a conta saia com um
       tamanho para o bitmap e outro para o elemento. */
    function dimensiona() {
      var w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      esc = Math.min(window.devicePixelRatio || 1, 2);
      larg = w; alt = h;
      cv.width = Math.round(w * esc);
      cv.height = Math.round(h * esc);
      ctx.setTransform(esc, 0, 0, esc, 0, 0);
    }

    /* Rede de seguranca por quadro. ResizeObserver cobre quase tudo, mas
       basta um caso escapar para o bitmap e o elemento sairem de sincronia:
       ai o canvas ESTICA e toda coordenada passa a mentir — inclusive a da
       reserva do texto, que deixa de cair sobre a manchete. A comparacao e
       de dois inteiros e so escreve quando mudou. */
    function confereTamanho() {
      if (cv.clientWidth !== larg || cv.clientHeight !== alt) dimensiona();
    }

    function cor(a) { return 'rgba(88,98,232,' + (a < 0 ? 0 : a) + ')'; }

    /* ── quais batidas estao vivas agora ──
       So uma cabe por vez (dura 2s, intervalo minimo 2,8s), entao nao vale
       varrer a lista: estima o indice e olha uma janela curta. */
    function vivas(tp) {
      var out = [];
      if (tp < 0) return out;
      var i0 = Math.max(0, Math.floor(tp / ESTRELA.base) - 3);
      for (var i = i0; i < BATIDAS.length && i < i0 + 8; i++) {
        var d = tp - BATIDAS[i];
        if (d < 0) break;
        /* n e o numero da batida no calendario. O rodizio escolhe a foto
           por ele, e o eco leva o mesmo n: os dois tempos do "tum-ta" sao
           a MESMA batida e tem de mostrar a mesma imagem. */
        if (d < ESTRELA.dur) out.push({ idade: d, forca: 1, n: i });
        var de = d - ESTRELA.eco;
        if (de >= 0 && de < ESTRELA.dur) out.push({ idade: de, forca: ESTRELA.ecoForca, n: i });
      }
      return out;
    }

    /* ── uma onda ──
       Nao e um fio: e uma banda de luz, gradiente radial com nucleo aceso e
       queda para os dois lados. Um fio de 1px nao aguenta ser a unica coisa
       na tela. O preenchimento e recortado na coroa, nao na tela toda. */
    /* A FRENTE NAO E UM CIRCULO.
       Escolhida pelo Gabriel em 15/09/2026 entre seis formas construidas
       (as outras vivem em estudos/onda.html): circulo perfeito le como
       compasso, e o raio modulado le como agua. O sentido da peca nao muda —
       sai do ponto, cresce, perde forca, atravessa e some — muda o que a
       forma DIZ sobre quem manda a onda.

       Dois harmonicos lentos e de amplitude pequena, 5,5% e 3,5%. Nao e
       ruido: e proposital que sejam so dois e de periodo longo, senao a
       frente vira serra em vez de respirar. E a amplitude e pequena de
       proposito tambem — a coroa que recorta a imagem revelada continua
       RADIAL, e com mais que isso as duas se descolariam. */
    function caminhoOnda(cx, cy, r, fase, amp) {
      var N = 56;
      var a1 = 0.055 * amp, a2 = 0.035 * amp;
      for (var g = 0; g <= N; g++) {
        var th = g / N * Math.PI * 2;
        var rr = r * (1 + a1 * Math.sin(3 * th + fase) + a2 * Math.sin(5 * th - fase * 0.7));
        var x = cx + Math.cos(th) * rr, y = cy + Math.sin(th) * rr;
        if (g === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    /* A ondulacao CRESCE com a viagem, nao nasce pronta.
       Com amplitude fixa o harmonico de 3 lobos, que em raio grande le como
       agua, em raio pequeno le como TRIANGULO arredondado: perto do ponto a
       frente virava geometria, exatamente o oposto do que a forma existe
       para dizer. Ate 35% do caminho ela abre de circulo ate a amplitude
       cheia — e isso tambem e o que uma onda faz de verdade, acumular
       irregularidade ao propagar. */
    function amplitude(pp) { return Math.min(1, pp / 0.35); }

    /* Canvas nao da gradiente ao longo de um caminho arbitrario, entao a
       banda e feita de SETE tracos concentricos com alfa em triangulo. E o
       mesmo recurso da penumbra da reserva: varias passadas simples no lugar
       de um desfoque que o canvas nao tem de forma confiavel.

       So a CRISTA e azul. A ondulacao de tras e branca — com as duas azuis
       elas se somam e a onda vira um anel grosso e saturado. */
    function banda(cx, cy, raio, esp, alfa, branco, fase, amp) {
      if (alfa <= 0.004 || raio <= 0) return;
      var P = 7;
      for (var i = 0; i < P; i++) {
        var d = (i / (P - 1) - 0.5) * 2;
        /* O PAR 0.69 / 0.70 anda junto: nao mexa em um sem o outro.

           No estudo era 1.15 com traco de 0.42*esp, e naquela largura os
           tracos se ENCOSTAM em vez de se fundir: lendo os pixels do
           renderizador ao longo de um raio, o perfil afundava 49% entre um
           traco e o vizinho. Em banda estreita ninguem ve; quando a onda
           engrossa ao viajar, a crista vira um anel listrado.

           Traco de 0.70*esp derruba o afundamento para 29% — o platо, ir
           para 1.35 nao melhora mais, so achata o pico. E 0.69 no alfa
           devolve a luz: integrada, a banda entrega 0,96x a do estudo, que
           e o que o Gabriel aprovou. Mesmo custo, sete tracos ainda.

           Referencia: esta banda entrega ~1,3x a luz da versao circular
           antiga. Parte do motivo de ela ler como mais viva e isso, nao so a
           forma. Se um dia parecer forte demais, o lugar de baixar e aqui —
           nao em alfa, que tambem alimenta a revelacao e o clarao do ponto. */
        var a = alfa * (1 - Math.abs(d)) * 0.69;
        if (a <= 0.004) continue;
        ctx.strokeStyle = branco
          ? 'rgba(241,240,235,' + a + ')'
          : cor(a);
        ctx.lineWidth = esp * 0.70;
        ctx.beginPath();
        caminhoOnda(cx, cy, raio + d * esp, fase, amp);
        ctx.stroke();
      }
    }

    /* ── o que a onda revela ──
       A onda nao so atravessa: ela MOSTRA. Vistas noturnas de cima — linhas
       de luz — que acendem atras da frente e somem junto com ela.

       Fecha a leitura da peca: o ponto e a marca, a onda e o alcance, e o
       alcance revela o que esta la.

       UMA IMAGEM SO, e cada batida mostra um PEDACO diferente dela.

       Houve um rodizio de quatro fotos aereas, e ele foi desfeito em
       15/09/2026 por um motivo concreto: quatro aereas noturnas quase
       iguais nao sao percebidas como troca. Um rodizio que ninguem nota nao
       e um rodizio — e uma imagem so custando quatro vezes mais. Eram 305KB
       por um efeito invisivel por construcao.

       Deslocar o enquadramento da a mesma sensacao de "nunca e igual" com um
       arquivo so. E o que se ve a cada batida e um pedaco de cidade que nao
       apareceu na anterior, que era a ideia original: cada varredura do
       sonar encontra um lugar diferente.

       A fonte e visaoaerea3.png, escolhida pelo Gabriel entre as quatro. As
       descartadas vivem em estudos/capturas/ e nos estudos.

       O BRILHO (0.60 assado no arquivo) veio da calibragem contra a aerea
       antiga, que foi a aprovada e medida. Mantido para nao mudar a luz que
       ja passou pelo teste de contraste.

       O tratamento (dessaturar e escurecer) esta ASSADO em cada .webp.
       Filtrar a imagem inteira 60 vezes por segundo para um efeito que nunca
       muda seria o caminho mais caro possivel. */
    var CAUDA = 640;
    var mascara = null;

    var FOTO = 'assets/img/fundo/aerea.webp';
    var img = null;

    /* ZOOM e o preco do enquadramento, e ele e literal: desenhar a imagem
       1,15x maior que o necessario cria 15% de folga para deslocar dentro
       dela — e custa 15% de nitidez, porque a fonte tem 1536px e nao cresce.

       1.15 e o teto que eu aceitaria. Em 1,3 a folga seria melhor e a imagem
       comecaria a amolecer em tela grande. Se um dia a fonte for ampliada
       para ~3000px, este numero pode subir junto e so entao.

       As posicoes vao de 0 a 1 dentro da folga. Nao sao aleatorias: estao
       ordenadas para que duas batidas seguidas caiam longe uma da outra —
       com 4,1s de silencio no meio, o olho compara a de agora com a
       anterior, e so isso. Seis, entao a volta leva ~25s. */
    var ZOOM = 1.15;
    var QUADROS = [
      [0.10, 0.20], [0.86, 0.60], [0.34, 0.92],
      [0.94, 0.14], [0.20, 0.66], [0.62, 0.34]
    ];

    /* Sem preload: a imagem so e necessaria 1,4s depois do hero entrar, e
       pre-carrega-la a faria disputar banda com as fontes no caminho
       critico. Com um arquivo so, a fila que existia aqui deixou de ter
       proposito — e 171KB a menos para baixar. */
    function carregaImagem() {
      var im = new Image();
      im.onload = function () { im.pronta = true; };
      im.onerror = function () { im.pronta = false; };   // sem imagem, so a onda
      im.src = FOTO;
      img = im;
    }

    /* Onde, atras da frente, o revelado brilha mais.
       NAO e sobre a frente: ali a onda e uma banda acesa e engoliria a
       imagem. E tambem nao e logo atras — a onda sao TRES bandas, a crista
       e duas ondulacoes, e o campo so esvazia depois das tres. */
    function picoAtras(esp) { return esp * 2 + 250; }

    function revela(w, h, cx, cy, frente, amp, esp, n) {
      if (!img || !img.pronta) return;
      if (!mascara) mascara = document.createElement('canvas');
      var lw = Math.round(w * esc), lh = Math.round(h * esc);
      if (mascara.width !== lw || mascara.height !== lh) { mascara.width = lw; mascara.height = lh; }
      var m = mascara.getContext('2d');
      m.setTransform(1, 0, 0, 1, 0, 0);
      m.clearRect(0, 0, lw, lh);
      m.setTransform(esc, 0, 0, esc, 0, 0);

      /* Cobre sem distorcer, como background-size:cover — mas COM FOLGA, e
         o enquadramento desta batida decide onde dentro dela. A folga
         vertical ja existia de graca (a fonte e 3:2 e o hero e 16:9, entao
         sobra altura); a horizontal vem do ZOOM. */
      var ri = img.naturalWidth / img.naturalHeight, rc = w / h, dw, dh;
      if (ri > rc) { dh = h * ZOOM; dw = dh * ri; } else { dw = w * ZOOM; dh = dw / ri; }
      var q = QUADROS[n % QUADROS.length];
      m.drawImage(img, -(dw - w) * q[0], -(dh - h) * q[1], dw, dh);

      /* A coroa. A ULTIMA parada TEM de ser 0: destination-in com gradiente
         radial estende a cor final para todo o lado de fora do raio maior —
         terminar em .18 deixava 18% da imagem na tela inteira, o tempo todo. */
      m.globalCompositeOperation = 'destination-in';
      var g = m.createRadialGradient(cx, cy, Math.max(0.01, frente - CAUDA),
                                     cx, cy, Math.max(0.02, frente));
      var pos = limita(1 - picoAtras(esp) / CAUDA, 0.05, 0.95);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(pos, 'rgba(0,0,0,1)');
      g.addColorStop(0.985, 'rgba(0,0,0,.18)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      m.fillStyle = g;
      m.fillRect(0, 0, w, h);
      m.globalCompositeOperation = 'source-over';

      ctx.save();
      ctx.globalAlpha = Math.min(1, amp * 1.25);
      ctx.drawImage(mascara, 0, 0, w, h);
      ctx.restore();
    }

    /* ── a reserva do texto ──
       A onda atravessa a manchete de proposito, mas nao pode apaga-la. Isto
       cava um retangulo arredondado com penumbra por cima do bloco do
       titulo, proporcional ao que esta aceso. Sem ele, medido, o contraste
       da linha esmaecida cai de 5,9:1 para 3,1:1 no instante em que a frente
       cruza o texto. */
    function reserva(grau) {
      var h1 = q('.hero__h1');
      if (!h1) return;
      var rc = cv.getBoundingClientRect(), r = h1.getBoundingClientRect();
      var topo = r.top;
      var olho = q('.hero__eyebrow');
      if (olho) { var ro = olho.getBoundingClientRect(); if (ro.top < topo) topo = ro.top; }
      var bx = r.left - rc.left, by = topo - rc.top;
      var bw = r.width, bh = r.bottom - topo;
      if (bw <= 0 || bh <= 0) return;

      /* Penumbra por retangulos concentricos: cada passada remove uma fracao
         do que sobrou, entao N passadas de alfa s chegam a 1-(1-s)^N no
         nucleo. Canvas nao tem desfoque confiavel em toda parte; isto tem. */
      var N = 18, pena = 52, sp = 1 - Math.pow(1 - grau, 1 / N);
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,' + sp + ')';
      for (var i = N; i >= 1; i--) {
        var e = pena * (i / N);
        var x = bx - 18 - e, y = by - 14 - e;
        var w = bw + 36 + e * 2, hh = bh + 28 + e * 2;
        var raio = Math.min(46 + e, w / 2, hh / 2);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, hh, raio);
        else ctx.rect(x, y, w, hh);
        ctx.fill();
      }
      ctx.restore();
    }

    function quadro(t) {
      if (!larg || !alt) return;
      ctx.clearRect(0, 0, larg, alt);

      var cx = larg * 0.70, cy = alt * 0.30;
      var diag = Math.sqrt(larg * larg + alt * alt);

      /* Repouso: o ponto sozinho no preto e um pixel perdido. O halo da a
         ele corpo de estrela sem desenhar linha nenhuma. */
      var resp = 1 + 0.07 * Math.sin(t / 2800);
      var rh = 46 * resp;
      var halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rh);
      halo.addColorStop(0, cor(0.30));
      halo.addColorStop(0.35, cor(0.09));
      halo.addColorStop(1, cor(0));
      ctx.fillStyle = halo;
      ctx.fillRect(cx - rh * 1.2, cy - rh * 1.2, rh * 2.4, rh * 2.4);

      var lista = calmo.matches ? [] : vivas(t);
      var aceso = 0, pico = 0;

      for (var b = 0; b < lista.length; b++) {
        var fb = lista[b].forca;

        for (var k = 0; k < ESTRELA.ondas; k++) {
          var idade = lista[b].idade - k * ESTRELA.atraso;
          if (idade <= 0) continue;
          var pp = idade / ESTRELA.dur;
          if (pp >= 1) continue;

          /* A curva do raio nao e ease-out: com ela a onda cobria quase toda
             a distancia no primeiro terco e cruzava a area visivel em 650ms,
             rapido demais para ler como onda. Assim fica ~1,7s em cena. */
          var raio = Math.pow(pp, 0.72) * diag * 1.12;
          var esp = 20 + 78 * pp;          // se espalha ao viajar
          var queda = 1 - pp;              // e perde energia, mas devagar
          var peso = fb * queda * (k === 0 ? 1 : 0.38);
          /* A fase anda com o tempo: sem isso a ondulacao fica congelada e a
             frente parece uma estrela de pontas, nao agua. */
          banda(cx, cy, raio, esp, 0.68 * peso, k !== 0, t / 900, amplitude(pp));

          /* So a crista revela: as ondulacoes de tras sao eco, nao sonar. */
          /* larg/alt, nao w/h: quadro() usa esses nomes. Copiei a chamada do
             estudo, onde w e h existiam, e o ReferenceError so estourava
             DURANTE a batida — a onda seguia animando porque o rAF e
             agendado antes do desenho, e tudo depois desta linha (imagem,
             fio da crista, clarao do ponto E a reserva do texto) nunca
             desenhava. */
          if (k === 0 && peso > 0.015) revela(larg, alt, cx, cy, raio, peso, esp, lista[b].n);

          /* um fio nitido na crista da onda principal: sem ele a banda vira
             nevoa e a onda perde a frente */
          /* um fio nitido na crista: sem ele a banda vira nevoa e a onda
             perde a frente. Ele segue o MESMO caminho modulado — um arco
             perfeito por cima de uma banda ondulada entrega o truque. */
          if (k === 0 && peso > 0.02) {
            ctx.strokeStyle = cor(0.72 * peso);
            ctx.lineWidth = 1 + 1.5 * queda;
            ctx.beginPath(); caminhoOnda(cx, cy, raio, t / 900, amplitude(pp)); ctx.stroke();
          }
        }

        var pa = lista[b].idade / 420;
        if (pa < 1) { var br = (1 - pa) * (1 - pa) * fb; if (br > aceso) aceso = br; }
        var ap = fb * Math.pow(1 - lista[b].idade / ESTRELA.dur, 1.6);
        if (ap > pico) pico = ap;
      }

      /* O clarao da batida. O ponto ACENDE mas nao incha: o raio e sempre 5.
         Isso nao e detalhe de gosto — e o que sustenta a explicacao. Se o
         ponto crescesse, a leitura viraria "a marca aumenta", e o que se quer
         dizer e o contrario: a marca nao muda, o alcance dela muda. */
      if (aceso > 0.01) {
        var rr = 120 * aceso + 20;
        var flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
        flash.addColorStop(0, cor(0.55 * aceso));
        flash.addColorStop(1, cor(0));
        ctx.fillStyle = flash;
        ctx.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
      }
      ctx.fillStyle = cor(0.92);
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

      /* Quanto a reserva apaga sobre o titulo. Nao e "escurecer": e um
         destination-out — ela REMOVE a onda e a imagem naquela area.

         Esteve em .985 (sobrava 1,5% da imagem) e o Gabriel via a forma do
         retangulo em 15/09/2026. Esse e o defeito de uma reserva forte
         demais: ela deixa de proteger e passa a desenhar. Teto em .78 — passa
         15x mais imagem sobre o titulo e a caixa se dissolve no fundo.

         Medido no quadro composto, com os glifos escondidos para que toda a
         faixa do H1 seja fundo puro (e o unico jeito honesto: a 2a linha e
         branco a 62%, e qualquer limiar que separe os glifos do fundo corta
         justamente o fundo claro que se quer medir):

           fundo tipico     6,90:1  em .985 e em .78 — o nucleo nao mudou
           pior pixel       5,8:1 em .985  ->  4,7:1 em .78
           batida mais dura a da aerea: e malha fina, tem pixels isolados
                            claros que o delta e o no nao tem

         O H1 tem 40-64px, entao o minimo da WCAG AA aqui e 3:1, nao 4,5:1.
         Se um dia alguem baixar mais este teto, MEÇA de novo: o limite real
         nao e o valor, e o pior pixel na batida da aerea. */
      reserva(limita(0.28 + pico * 0.50, 0.10, 0.78));
    }

    function anda() {
      if (laco) return;
      (function passo() {
        laco = requestAnimationFrame(passo);
        confereTamanho();
        quadro(performance.now() - t0);
      })();
    }
    function parar() { if (laco) { cancelAnimationFrame(laco); laco = null; } }
    function confere() {
      if (visivel && !oculto) anda();
      else { parar(); }
    }

    dimensiona();
    carregaImagem();
    t0 = performance.now();

    /* Movimento reduzido: um quadro so, com o ponto parado. Nada bate. */
    if (calmo.matches) { quadro(0); return; }

    /* Fora da tela o laco para: e um hero, o visitante desce e nunca mais
       volta — nao ha por que gastar bateria desenhando o que ninguem ve. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visivel = es[0].isIntersecting;
        confere();
      }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      oculto = document.visibilityState === 'hidden';
      confere();
    });

    /* O hero muda de largura sem a janela mudar (zoom, barra de rolagem
       aparecendo). Sem isto o bitmap fica de um tamanho e o elemento de
       outro, o canvas estica, e TODA coordenada passa a mentir — inclusive
       a da reserva do texto. */
    if (window.ResizeObserver) {
      new ResizeObserver(function () { dimensiona(); }).observe(hero);
    } else {
      window.addEventListener('resize', dimensiona);
    }

    confere();
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
    /* Cada módulo é isolado: um erro em qualquer um deles não pode impedir os
       reveals de rodar, senão a página inteira fica invisível. */
    [fatiaPalavras, canais, servicos, menu, form, scroll, navAtual,
     cursor, magnetismo, plantas].forEach(function (modulo) {
      try { modulo(); } catch (e) {
        if (window.console) console.error('[zenith] módulo falhou:', e);
      }
    });

    // Os reveals esperam o loader, para o hero entrar depois da transição.
    var iniciado = false;
    function revelaUmaVez() {
      if (iniciado) return true;
      if (!html.classList.contains('is-ready')) return false;
      iniciado = true;
      try { reveals(); } catch (e) { mostraTudo(); }
      // Isolada: se a estrela falhar, o hero nao pode cair junto.
      try { estrela(); } catch (e) {}
      return true;
    }

    if (!revelaUmaVez()) {
      var voltas = 0;
      var esperando = setInterval(function () {
        // 80 voltas ≈ 4,8s: nunca esperar o loader para sempre.
        if (revelaUmaVez() || ++voltas > 80) {
          clearInterval(esperando);
          if (!iniciado) { iniciado = true; mostraTudo(); }
        }
      }, 60);
    }

    // Rede final: se o observador nunca chegou a existir, entrega o conteúdo.
    setTimeout(function () { if (!observadorAtivo) mostraTudo(); }, 6000);
  }

  try { loader(); } catch (e) {
    // Sem loader o site é apenas menos cerimonioso; travado ele é inutilizável.
    html.classList.add('is-ready');
    html.classList.remove('is-travado');
    var restos = document.getElementById('loader');
    if (restos && restos.parentNode) restos.parentNode.removeChild(restos);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicia);
  } else {
    inicia();
  }
})();
