# Zenith Dias — sistema visual

**A fonte da verdade é o kit oficial**, em `ZENITH_DIAS_Kit_Final/`:
o mini brandbook (`04_Documentacao`), a paleta (`03_Paleta`), as fontes
(`02_Fontes`) e os logos (`01_Logos`). Aplicado ao site em 13/09/2026.

Onde este arquivo e o brandbook discordarem, **o brandbook vence** — e o que
estiver aqui é bug de documentação.

O briefing original (`Prompt completo — Site Zenith Dias.md`) continua valendo
para **narrativa, copy e conceito**. Para cor, tipografia, escala, logo e
espaçamento ele foi **substituído** pelo kit.

---

## A ideia que organiza tudo

Zenith é o ponto mais alto em relação ao observador. O brandbook resume a
direção em três palavras: **Editorial × Architectural × Digital**.

Três decisões estruturais do site vêm daí e seguem valendo:

**1. O contador do loading é o mesmo instrumento do scroll.**
O loader conta `00 → 25 → 50 → 75 → 100•`. O medidor fixo na direita é aquele
mesmo contador, agora medindo a página.

**2. O medidor sobe.** `00` embaixo, `100•` em cima, preenchendo de baixo para
cima enquanto você desce. Descer o site é subir ao zênite.

**3. A página inverte quando fala sobre o visitante.** Duas seções off-white
("SEU SITE FALA ANTES DE VOCÊ" e o pôster) — as duas afirmações dirigidas a
quem está lendo.

E a interação central: a **convergência** entre `REAL VALUE` e
`DIGITAL PERCEPTION`, que fecha no scroll até acender o Zenith Point.

---

## Cor

Paleta oficial, copiada de `03_Paleta/zenith-dias-cores.css`:

| Token | Hex | Uso no brandbook |
|---|---|---|
| `--zenith-black` | `#090A0C` | fundo principal e texto sobre claro |
| `--lunar-white` | `#F1F0EB` | leitura, superfícies claras e respiro |
| `--graphite` | `#565960` | textos de apoio e divisórias |
| `--zenith-blue` | `#5862E8` | Point, marcadores e destaques |

Composição de referência do brandbook: **80-90% de neutros, 10-20% de azul**.

### As duas exceções de acessibilidade — leia antes de mexer em cor

**1. O azul oficial não passa como texto pequeno.** Medido:

| | sobre Zenith Black | sobre Lunar White |
|---|---|---|
| `#5862E8` oficial | **4,08:1** | **4,25:1** |

Passa folgado como **marcador e elemento de interface** (mínimo 3:1), mas
reprova como **texto** (mínimo 4,5:1). Por isso existem duas variantes usadas
**exclusivamente onde o azul vira texto miúdo**:

- `--blue-txt-dark` `#6A74EE` → **5,04:1** sobre Zenith Black
- `--blue-txt-light` `#4E57D2` → **5,09:1** sobre Lunar White

O azul **oficial continua sendo o de todo Zenith Point, preenchimento, anel de
foco, borda e texto grande**. As variantes aparecem em seis lugares só: número
de etapa, número do serviço aberto, mensagem de erro do formulário, status de
erro, link de portfólio em hover e a seta dos canais. O token é `--accent-txt`;
`--accent` segue sendo a cor oficial.

Isso **não é "inventar cores"** no sentido do brandbook (pág. 14) — a marca
nunca é desenhada com elas. É um ajuste de legibilidade de texto corrido, e
vale levar ao autor do kit.

**2. Graphite não pode ser texto sobre preto.** `#565960` sobre `#090A0C` dá
**2,87:1**. O brandbook o descreve como "textos de apoio e divisórias", o que
funciona sobre claro, não sobre o fundo escuro do site. Aqui ele é cor de
divisória; texto de apoio no escuro usa off-white com alfa:

- `--fg-dim` `rgba(241,240,235,.62)` → 6,9:1
- `--fg-faint` `rgba(241,240,235,.55)` → 5,6:1

Contraste sempre medido compondo o alfa sobre o fundo real. Atenção:
`color-mix()` volta de `getComputedStyle` como `color(srgb 0.94 … / 0.55)`,
com canais de 0 a 1 — um medidor que assuma `rgb()` 0-255 lê isso como quase
preto e reprova tudo.

### Superfícies

Dois blocos de tokens, `.s-dark` e `.s-light`, com **os mesmos nomes**
(`--bg --fg --fg-dim --fg-faint --rule --accent --accent-txt`). Nenhum
componente sabe em que superfície está; inverter é trocar uma classe.

---

## Tipografia

**Inter Display** nos títulos, **Inter** no texto e nos rótulos — as fontes do
kit, **auto-hospedadas**. Os TTF de `02_Fontes` foram convertidos para WOFF2
(65 KB → ~24 KB cada, **95 KB no total** para os quatro pesos). Sem CDN de
terceiro: uma dependência externa a menos para a marca aparecer certa.
Licença em `assets/fonts/LICENSE-Inter.txt`.

### Escala digital (brandbook, pág. 11)

| Nível | Desktop | Mobile | Token |
|---|---|---|---|
| H1 · Display 500 | 64 / 70 | 40 / 44 | `--t-h1` |
| H2 · Display 500 | 40 / 46 | 32 / 38 | `--t-h2` |
| H3 · Display 500 | 28 / 34 | 24 / 30 | `--t-h3` |
| Corpo · Inter 400 | 18 / 28 | 16 / 25 | `--t-corpo` |
| Apoio · Inter 400 | 14 / 21 | 14 / 21 | `--t-apoio` |
| Rótulo · Inter 500 | 12 / 18 | 12 / 18 | `--t-rotulo` |

Títulos com tracking **−0,02em**; rótulos em **caixa alta com +0,08em**.
Ambos são tokens (`--track-titulo`, `--track-rotulo`) — não repetir o valor.

Os clamps interpolam entre a âncora mobile (375px) e a desktop (1280px), com
teto no valor desktop. Verificado no navegador: em 1440px o H1 sai
**64px / 69,76px / −1,28px**, exatamente a especificação.

**Nenhum tamanho de fonte fora desses seis níveis.** A classe de rótulo se
chama `.rotulo` (era `.mono`, de quando a família técnica era monoespaçada —
o kit define rótulo em Inter Medium, então o nome mudou junto).

### Quebra de linha: por FRASE, não por linha visual

Esta regra **mudou** com o kit, e é a pegadinha do arquivo.

Antes, com display de 125px, as headlines eram quebradas à mão linha a linha e
a regra era "nada pode re-quebrar dentro da máscara". Com a escala oficial
(H1 de 64px no desktop e **40px no mobile**), essa regra virou impossível: a
mesma frase que cabe em uma linha no desktop não cabe em 375px, e forçar não
quebrar significaria desobedecer a escala do brandbook.

A regra nova:

- **Quebra-se por frase.** Cada `<span class="linha">` carrega uma frase
  inteira. O hero é `SUA EMPRESA EVOLUIU.` / `SEU DIGITAL TAMBÉM DEVERIA.` —
  o mesmo padrão do exemplo do brandbook (`PRESENÇA DIGITAL.` /
  `PADRÃO ELEVADO.`).
- **No mobile a frase embrulha naturalmente, e isso está certo.** A máscara
  de overflow anima o bloco inteiro; não há corte nem vazamento. O único
  efeito é a cascata ficar menos escalonada em tela pequena.
- **No desktop nada pode embrulhar.** Aí sim vale medir. Script no README.

Verificado sem quebra indesejada em 1024 · 1280 · 1440 · 1680.

---

## THE ZENITH POINT

O brandbook dá **diâmetros**, não tamanhos de fonte:

- **8px** como marcador em rótulo
- **12-16px** como marcador de seção
- linhas de 1px

Por isso o ponto **deixou de ser o glifo `•`** e passou a ser forma de verdade:
a classe `.pt` zera o `font-size` (some o caractere que continua no HTML) e
desenha um círculo no diâmetro exato, independente do contexto tipográfico.

Onde ele aparece, medido: rótulos 8px · marcador de seção 14px · marcador de
serviço 8px · marcador de etapa 8px · pôster 16px.

---

## Logos

Nenhum wordmark montado à mão sobrou no site — **todos os três usos são o SVG
oficial**, sem alteração de proporção, cor ou espaçamento.

| Onde | Assinatura | Largura aplicada | Mínimo do kit |
|---|---|---|---|
| Header (≥960px) | Horizontal negativa | **132px** ⚠️ | 180px |
| Header (<960px) | Reduzida ZD negativa | 54px | 32px |
| Loader | Principal negativa | 176-272px | 120px |
| Rodapé | Institucional negativa | 240-416px | 220px |
| Favicon | Reduzida ZD | quadrado | 32px |

A institucional **já traz o slogan na composição aprovada**, então não existe
slogan solto ao lado dela no rodapé.

O favicon (`assets/favicon.svg`) reusa os paths da marca reduzida sem editar
a geometria: o quadrado só centra a marca com a área de proteção em volta.

A versão **negativa é a preferencial** (brandbook, pág. 10) — e o site é
predominantemente escuro, então é ela em toda parte.

### ⚠️ A horizontal do header está 27% abaixo do mínimo do kit

**Decisão do Gabriel em 14/09/2026.** Ele achou a assinatura grande demais na
tela inicial. Como ela já estava **exatamente no piso de 180px**, "diminuir"
só era possível de duas formas: trocar de assinatura (ofereci Principal 128px
e Reduzida ZD 52/38px num estudo — ele recusou as três) ou furar o mínimo.
Ele escolheu manter a horizontal e reduzir. Comparou as larguras no estudo e
fechou em **132px** (19px de altura).

É decisão consciente do dono da marca, não descuido — **não "corrigir" de
volta para 180px**. Se um dia for revisto com quem montou o kit, as saídas
limpas são baixar o mínimo declarado da horizontal ou desenhar uma variante
compacta com o "DIAS" proporcionalmente maior.

O estudo que gerou a decisão está em `estudos/logo-hero.html` (fora do
repositório, pelo .gitignore), com as larguras de 180 a 116px e a marcação
de quanto cada uma fica abaixo do piso.

---

## Grade, espaço e forma

Base de **8px** (brandbook, pág. 12): tokens `--e1` a `--e12`
(8, 16, 24, 32, 48, 64, 96). Formas retangulares com **raio discreto de
4-8px**: `--raio` 4px em botões, tags e fichas; `--raio-lg` 8px nas chapas de
projeto.

---

## Movimento

Curvas: `--e-out: cubic-bezier(.16,1,.3,1)` para entradas, `--e-io:
cubic-bezier(.65,0,.35,1)` para transformações contínuas. Sem bounce.
Só `opacity`, `transform`, `translate` e `grid-template-rows`.

- **Reveal**: o JS só adiciona `.is-in`; toda a animação é CSS.
- **Parallax do hero**: usa a propriedade `translate`, **não** `transform` —
  `transform` já pertence ao reveal e as duas regras disputariam
  especificidade. Propriedades separadas compõem.
- **Um laço de scroll só**, em `requestAnimationFrame`, escrevendo variáveis
  CSS (`--sp`, `--hs`, `--p`).
- **Nada anima propriedade de layout.** O fio do loading preenche por
  `scaleX`; o anel do cursor muda de estado por `scale`.

### A convergência

Os dois níveis têm **altura zero** e o fio ancorado na própria origem — um em
`top: 0`, o outro em `top: 100%`. Cada um viaja exatamente `--h/2` e eles se
encontram no pixel (medido: vão de 277,75px → −0,01px). Os rótulos ficam
**fora** do vão; dentro, colidiriam no instante em que ele fecha.

Palco `sticky` numa pista de `280vh`; o progresso termina em 80% e segura
convergido no resto.

### Movimento reduzido

`prefers-reduced-motion: reduce` entrega o site em **estado final**, não sem
conteúdo: loader e cursor removidos, reveals visíveis, convergência já
convergida (`--p: 1 !important` — precisa do `!important` porque o JS escreve
`--p` em estilo inline). A pista perde os 280vh e o palco deixa de ser sticky.

---

## Chapas de projeto

Sem fotografia ainda (ver PENDENCIAS 05), cada projeto é uma **planta**:
abstração em hairline do layout entregue, sobre a **paleta real** daquele
projeto, lida dos `:root` dos sites de verdade:

| Projeto | Fundo | Tinta | Acento |
|---|---|---|---|
| Pernil&Co. | `#0a0908` | `#f2efe9` | `#fea224` |
| Setti Confeitaria | `#0d103f` | `#f7f2e9` | `#c9a55d` |
| Advocacia | `#0F1417` | `#E9EDEC` | `#256F73` |

Quatro variantes (`.planta`, `--editorial`, `--institucional`, `--sistema`)
para as chapas não parecerem o mesmo template.

Nenhum texto visível abaixo de **10px** — as anotações das chapas e a tag de
status são conteúdo, não textura.

---

## Cursor e medidor: `mix-blend-mode: difference`

Os dois são `position: fixed` e atravessam superfícies claras e escuras. Em
branco puro com `difference`, invertem sozinhos. É a única razão pela qual
existe `#fff` cru no CSS.

O cursor só existe em `(pointer: fine) and (min-width: 64rem)`, e `cursor:
none` vem de uma classe que o **JS** adiciona — se o JS falhar, o cursor do
sistema continua lá.

---

## Onde as coisas estão

```
index.html                    seções na ordem narrativa
assets/css/styles.css         tokens no bloco 01, superfícies no 02
assets/js/main.js             12 módulos; CONTATO no topo
assets/fonts/*.woff2          Inter Display e Inter, do kit
assets/img/logo/*.svg         assinaturas oficiais
assets/favicon.svg            marca reduzida ZD
ZENITH_DIAS_Kit_Final/        o kit original, intocado
```
