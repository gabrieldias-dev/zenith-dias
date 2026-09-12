# Zenith Dias — sistema visual

O briefing vinculante é `Prompt completo — Site Zenith Dias.md`. Este arquivo
registra as **decisões** tomadas em cima dele, com os números medidos.

---

## A ideia que organiza tudo

Zenith é o ponto mais alto em relação ao observador. O briefing pede que isso
apareça de forma abstrata — eixos, cotas, níveis, progressão — e **nunca**
como planeta, foguete ou galáxia. Nada disso existe no site.

Três decisões vieram dessa ideia e amarram a experiência inteira:

**1. O contador do loading é o mesmo instrumento do scroll.**
O loader conta `00 → 25 → 50 → 75 → 100•`. O medidor fixo na direita da tela
é aquele mesmo contador, agora medindo a página. A marca visual da abertura
volta como instrumento de navegação.

**2. O medidor sobe.**
`00` fica embaixo, `100•` em cima, e o fio preenche de baixo para cima
enquanto você desce a página. Descer o site é subir ao zênite. Inversão
deliberada, rotulada nas duas pontas para ninguém ler como defeito.

**3. A página inverte quando fala sobre o visitante.**
Duas seções são off-white sobre fundo escuro: "SEU SITE FALA ANTES DE VOCÊ"
e o pôster "SEU DIGITAL À ALTURA DA SUA MARCA". As duas são afirmações
dirigidas a quem está lendo. A inversão de superfície é a pontuação dessas
afirmações, não decoração.

---

## Cor

| Token | Hex | Uso |
|---|---|---|
| `--zenith-black` | `#090A0C` | fundo dominante |
| `--lunar-white` | `#F1F0EB` | texto e superfície clara |
| `--graphite` | `#565960` | **só estrutura**, nunca texto (ver abaixo) |
| `--zenith-blue` | `#636DFF` | acento, ~6% da interface |
| `--zenith-blue-ink` | `#4B52CC` | o mesmo acento, sobre superfície clara |

### Duas correções de contraste que valem registrar

**Graphite não pode ser texto.** `#565960` sobre `#090A0C` dá **2,87:1** —
reprova. O briefing o lista na paleta, e a leitura errada seria usá-lo como
cor de corpo de texto. Aqui ele é cor de linha e de estrutura; texto
secundário usa off-white com alfa:

- `--fg-dim` = `rgba(241,240,235,.62)` → **6,9:1**
- `--fg-faint` = `rgba(241,240,235,.55)` → **5,6:1**

**O azul precisa de duas versões.** `#636DFF` dá 4,87:1 no escuro (passa),
mas só **3,57:1** sobre off-white (reprova). Por isso `--zenith-blue-ink`
`#4B52CC` → **5,45:1**, aplicado automaticamente pelo token `--accent` dentro
de `.s-light`.

Medição de contraste feita compondo o alfa sobre o fundo real. Medir a
`color` crua dá número errado. Atenção: `color-mix()` volta de
`getComputedStyle` como `color(srgb 0.94 0.93 0.91 / 0.55)`, com canais de 0 a
1 — um medidor que assuma `rgb()` de 0 a 255 lê isso como quase preto e
reprova tudo. As anotações das chapas usam `color-mix`, então o medidor
precisa entender os dois formatos.

### Piso de 10px para texto

Nenhum texto visível fica abaixo de 10px. As anotações das chapas
(`LAYOUT / 001`, os hexadecimais da paleta) começaram em 8–9px e subiram para
11px/10px, e a tag de status (`NO AR`, `EM PRODUÇÃO`) subiu de 9px para 11px
por ser **conteúdo**, não textura. Vale remedir ao criar qualquer etiqueta
mono nova.

### Superfícies

Dois blocos de tokens, `.s-dark` e `.s-light`, com **os mesmos nomes**
(`--bg --fg --fg-dim --fg-faint --rule --accent`). Toda seção consome os
nomes; a inversão é trocar uma classe. Nenhum componente sabe em que
superfície está.

### Disciplina do azul

Só em: ponto Zenith, hover, foco, número de etapa, `&` do Pernil&Co.,
indicador de scroll, sinal do accordion aberto, tag `NO AR`, favicon.
**Nenhuma seção azul, nenhum degradê azul/roxo.** O único brilho do site é o
halo radial do Zenith Point no momento em que os dois níveis se encontram.

---

## Tipografia

**Geist** (display e corpo) + **Geist Mono** (etiquetas técnicas), via Google
Fonts, variáveis. O briefing pede Neue Montreal / Satoshi / Suisse — nenhuma
está no Google Fonts. Geist é a grotesca mais próxima desse território e vem
com mono irmã de verdade, o que resolve `PROJECT / 001` e `EST. / 2026` sem
misturar famílias sem parentesco.

### A escala do display responde a largura **e** altura

```css
--t-display: clamp(2.3rem, min(10.4vw, 15.5vh), 9.85rem);
```

O `min()` não é enfeite. Com só `vw`, uma viewport estreita e alta deixa a
headline pequena demais dentro do hero; uma larga e baixa faz o hero estourar
100svh. Medido, depois de calibrar:

| Viewport | Display | Hero cabe em 100svh | H1 ocupa |
|---|---|---|---|
| 1680×950 | 147px | sim | 59% |
| 1280×800 | 124px | sim | 59% |
| 1024×768 | 106px | sim | 53% |

O briefing pede ~60–75%. 53% em 1024×768 é o teto geométrico: ali a linha
mais longa (`TAMBÉM DEVERIA.`) é que limita, não a altura.

O teto de `9.85rem` foi medido contra essa linha: acima disso ela estoura a
caixa em telas largas, onde o container para de crescer em `--max: 94rem`.

### Linhas quebradas à mão

Toda headline tem as quebras escritas no HTML (`<span class="linha">`), porque
a máscara de overflow anima linha por linha. Isso cria um risco que teste de
overflow **não** pega: a linha **re-quebrar** dentro da máscara, porque `span`
é bloco e texto que não cabe embrulha em vez de vazar.

Duas re-quebras foram encontradas medindo `altura / line-height` em cada
linha, e corrigidas reescrevendo as quebras (não encolhendo a tipografia):

- `FOR BUSINESSES / THAT HAVE / OUTGROWN THEIR / WEBSITE.` (era 3 linhas)
- `Não começamos pelo layout. / Começamos pelo que / seu site precisa fazer /
  as pessoas perceberem•` (era 3 linhas)

Abaixo de 360px são os **pisos** da escala que estouram, não os termos
fluidos — por isso o único bloco `@media (max-width: 22.5rem)` do arquivo
baixa três pisos. Verificado limpo em 320 · 360 · 375 · 414 · 768 · 1024 ·
1280 · 1440 · 1680.

**Ao mexer em qualquer headline, remedir.** O script está no README.

---

## Movimento

Curvas: `--e-out: cubic-bezier(.16,1,.3,1)` para entradas, `--e-io:
cubic-bezier(.65,0,.35,1)` para transformações contínuas. Sem bounce, sem
elastic. Só `opacity`, `transform`, `translate` e `grid-template-rows`.

- **Reveal**: JS só adiciona `.is-in`; toda animação é CSS. Atraso por
  `--d` inline, cascata de linhas por `:nth-child`.
- **Máscara de linha**: `.linha { overflow: hidden }` + filho em
  `translateY(108%)`. O par `padding-bottom/margin-bottom: .09em` abre espaço
  para descendentes sem deslocar o baseline.
- **Parallax do hero**: usa a propriedade `translate`, **não** `transform`.
  Isso é proposital: `transform` já pertence ao reveal, e as duas regras
  disputariam especificidade. Propriedades separadas compõem.
- **Um laço de scroll só**, em `requestAnimationFrame`, escrevendo variáveis
  CSS (`--sp`, `--hs`, `--p`). Nenhum listener escreve layout direto.

### A convergência (`THE ZENITH POINT`)

A interação conceitual central. `REAL VALUE` em cima, `DIGITAL PERCEPTION`
embaixo, uma cota de dimensão anotando o vão (`Δ 42%`). No scroll os dois se
aproximam; ao encontrarem, o Zenith Point acende.

Os dois níveis têm **altura zero** e o fio ancorado na própria origem — um em
`top: 0`, o outro em `top: 100%`. Assim cada um viaja exatamente `--h/2` e
eles se encontram no pixel. Medido: vão de **277,75px → −0,01px**.

Os rótulos ficam **fora** do vão. Dentro, colidiriam no instante em que o vão
fecha.

Palco em `position: sticky` dentro de uma pista de `280vh`. O progresso
termina em 80% do percurso e segura convergido no resto, para o encontro não
acontecer no exato momento em que a seção sai da tela.

### Movimento reduzido

`prefers-reduced-motion: reduce` entrega o site em **estado final**, não sem
conteúdo: loader e cursor removidos, reveals visíveis, e a convergência
renderizada já convergida (`--p: 1 !important` — precisa do `!important`
porque o JS escreve `--p` em estilo inline). A pista perde a altura de 280vh
e o palco deixa de ser sticky, então não há 3 telas de scroll vazio.

---

## Chapas de projeto

Sem fotografia (ver PENDENCIAS 05), cada projeto é uma **planta**: abstração
em hairline do layout entregue, sobre a **paleta real** daquele projeto,
declarada no HTML como dado:

| Projeto | Fundo | Tinta | Acento |
|---|---|---|---|
| Pernil&Co. | `#0a0908` | `#f2efe9` | `#fea224` |
| Setti Confeitaria | `#0d103f` | `#f7f2e9` | `#c9a55d` |
| Advocacia | `#0F1417` | `#E9EDEC` | `#256F73` |

Esses hexadecimais foram lidos dos `:root` dos sites de verdade — não são
aproximação. Os três círculos no canto da chapa mostram a paleta entregue.

Quatro variantes (`.planta`, `--editorial`, `--institucional`, `--sistema`)
com posições diferentes, para as quatro chapas não parecerem o mesmo
template. Cada variante varia por ~6 regras; o resto é compartilhado e
dirigido por `--p-bg / --p-ink / --p-accent`.

---

## Cursor e medidor: `mix-blend-mode: difference`

Os dois são `position: fixed` e atravessam superfícies claras e escuras. Em
branco puro com `difference`, invertem sozinhos: sobre `#090A0C` viram quase
branco, sobre `#F1F0EB` viram quase preto. É a única razão pela qual existe
`#fff` cru no CSS — `difference` precisa de branco puro, não de token.

O cursor só existe em `(pointer: fine) and (min-width: 64rem)`, e `cursor:
none` é aplicado por uma classe que o **JS** adiciona (`html.cursor-on`).
Se o JS falhar, o cursor do sistema continua lá.

---

## Onde as coisas estão

```
index.html              seções na ordem narrativa, comentadas por bloco
assets/css/styles.css   27 blocos numerados; tokens no 01, superfícies no 02
assets/js/main.js       12 módulos; CONTATO no topo
assets/favicon.svg      eixo + Zenith Point
```
