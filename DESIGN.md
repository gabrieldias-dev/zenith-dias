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

## O H1 é uma frase só, e já foi quatro

```
SUA EMPRESA EVOLUIU.
SEU DIGITAL TAMBÉM DEVERIA.
```

Uma linha por FRASE, como o exemplo do brandbook (pág. 11). Com H1 em 64px,
quatro linhas curtas viravam uma coluna estreita e fraca; quebrar por linha
visual não sobrevive ao mobile, onde a escala oficial é 40px. Quebrar por
frase sobrevive aos dois.

**Em 14/09/2026 isto girou entre quatro frases e voltou atrás.** O girador
chegou a ficar pronto: quatro frases empilhadas na mesma célula de grid,
troca a cada 3,4s, um fio de Zenith Blue com rastro atravessando o título a
cada troca, pausa por foco e por ponteiro, texto acessível fixo para leitor
de tela. O Gabriel olhou rodando e decidiu que não queria — a headline voltou
a ser uma frase parada.

Fica registrado para ninguém reconstruir achando que é novidade. O que
sobreviveu daquela rodada são as duas coisas abaixo, que valem
independentemente do girador.

### O acento não pode ser cortado pela máscara

A caixa de uma linha de texto é mais apertada do que a tinta que ela desenha:
o Ç desce abaixo dela, o Ã, É e À sobem acima. Medido antes do conserto:

| Linha | Faltava no topo |
|---|---|
| À ALTURA (63px) | **−7,84px** |
| SEU DIGITAL TAMBÉM DEVERIA. (63px) | −1,77px |
| ANTES DE VOCÊ. (40px) | negativo |

Era a página inteira, não só o hero — 34 linhas mascaradas.

O conserto é `clip-path: inset(-.2em 0 0 0)` na `.linha`, dentro de um
`@supports`, com `overflow: hidden` de reserva. **Duas outras tentativas
foram testadas no navegador e descartadas** — vale saber por quê, porque as
duas parecem certas no papel:

**Margem de recorte afastada** (`overflow-clip-margin`) abre os QUATRO
lados. O lado de baixo é exatamente o que a máscara do reveal precisa
fechado: a linha não revelada passou a vazar 8,95px e aparecia atrás do
próprio esconderijo.

**Padding no topo com margem negativa no span** não muda nada. `overflow`
corta na PADDING BOX, e padding empurra o conteúdo para dentro sem mover a
borda do corte. É um no-op caro de descobrir.

Só o inset negativo abre um lado só. Depois do conserto, a pior folga da
página é +4,69px no topo e +2,53px embaixo, e a altura do H1 não mudou
(142px no desktop, 222px em 375px).

### A rede de segurança do `<head>`

Todo conteúdo com reveal nasce escondido e só aparece quando o `main.js`
assume. Se ele não carregar, a página fica em branco. O script inline do
`<head>` — que não depende de rede — tira `.has-js` depois de 4s se o
`main.js` nunca tiver marcado `.zd-ok`, e isso desliga toda a regra de
esconder.

É a quarta camada, junto com o `try/catch` por módulo, a espera limitada do
loader e a rede de 6s do observador.

---

## A estrela do hero

Um ponto — o Zenith Point — e uma onda que atravessa a tela inteira, para, e
volta depois de um silêncio. É o fundo do hero desde 14/09/2026.

### O que ela quer dizer

Esta seção existe porque o Gabriel fez a pergunta certa: *"se alguém me
perguntar o porquê disso, o que eu respondo?"*

> **O ponto é a marca. A onda é o alcance.**
> Presença não é existir. É chegar.

O slogan oficial é **"Presence, elevated."** Presença não é ocupar espaço — é
ser registrado por quem está longe. Repare no que a animação **não** faz: o
ponto não anda, não muda de lugar, não fica maior. O que muda é até onde ele
chega. É o que o estúdio vende: não se muda a empresa do cliente, muda-se o
raio em que ela é percebida.

Três decisões que existem por causa disso, e que não devem ser "melhoradas"
sem entender o custo:

**O ponto acende mas NÃO incha.** O raio é sempre 5px. A primeira versão
crescia de 5 para 18 — o gesto genérico de pulsar. Se o ponto cresce, a
leitura vira "a marca aumenta", que é o contrário do que se quer dizer.

**Ela pulsa e para.** Silêncio de 1 a 2,3s entre as ondas. Não é um
carregamento girando: presença é periódica e intencional, não ruído contínuo.

**O intervalo é irregular** — 3,0 · 3,6 · 3,7 · 4,3 · 3,6 · 3,1s, sorteados
com semente fixa. Metrônomo lê como máquina; coração não marca tempo
perfeito.

E uma quarta, que veio do contraste mas diz a mesma coisa: **a onda passa por
trás da mensagem, nunca por cima.** O texto é literalmente reservado do
desenho.

### Como é feita

Canvas, **+3KB no site inteiro**, zero imagens (229KB → 232KB). Escolhida
entre cinco fundos construídos e medidos; os descartados vivem em
`estudos/fundo-vivo.html`.

| Peça | Por quê |
|---|---|
| A onda é uma **banda** de gradiente, não um fio | Um fio de 1px não aguenta ser a única coisa na tela |
| Raio por `pow(pp, .72)`, não ease-out | Com ease-out ela cruzava a área visível em 650ms — rápido demais para ler como onda. Assim fica ~1,7s em cena |
| Três ondas defasadas | Uma crista só lê como anel; as ondulações atrás fazem virar onda |
| Eco de 210ms a 42% | Coração faz "tum-tá". Sem ele o efeito lê como ping de sonar |

Medido em produção, com relógio controlado: repouso 0,13 de energia, pico
11,35, volta a 0,14. **87× o repouso**, e o pior contraste da linha esmaecida
durante a batida é 5,98:1.

### A onda revela

Ideia do Gabriel em 15/09/2026: a onda não só atravessa, ela **mostra** — e o
que aparece some junto com ela. É sonar. Fecha a leitura da peça:

> O ponto é a marca. A onda é o alcance. **E o alcance revela o que está lá.**

O que aparece é uma **vista aérea noturna** — malha urbana em linhas finas de
luz, vista de muito alto. Escolhida entre quatro construídas: as outras três
(o próprio trabalho dele alternando por batida, arquitetura vista de baixo, e
céu de longa exposição) ficaram em `estudos/fundo-vivo.html`.

| | |
|---|---|
| Arquivo | `assets/img/fundo/aerea.webp`, 85KB |
| Origem | 1,8MB de PNG gerado |
| Peso do site | 232KB → 321KB |

**O tratamento está assado no arquivo**, não em `ctx.filter`. Filtrar uma
imagem inteira 60 vezes por segundo para um efeito que nunca muda é o caminho
mais caro possível — e dessaturar e escurecer ainda encolheu o arquivo.

**Não há preload.** A imagem só é necessária 1,4s depois do hero entrar;
prearregá-la a faria disputar banda com as fontes no caminho crítico. Medido:
baixa em 539ms sozinha.

**A luz acende ATRÁS da frente, não sobre ela.** A primeira versão punha o
brilho máximo na crista — e a crista é uma banda acesa, que engolia a imagem.
E não basta ir um pouco para trás: a onda são TRÊS bandas (crista e duas
ondulações defasadas em 250ms), então o campo só esvazia depois das três. Daí
`picoAtras = esp * 2 + 250` e uma cauda de 640px.

### O bug que escondeu tudo, e a lição

Por um tempo a imagem simplesmente não aparecia — nem no navegador do Gabriel.
A causa: a chamada foi copiada do estudo como `revela(w, h, ...)`, mas o
`quadro()` da produção usa `larg` e `alt`. **`ReferenceError: w is not
defined`, 499 vezes.**

Três coisas tornaram isso difícil de ver, e todas valem lembrar:

**O laço sobreviveu ao erro.** `requestAnimationFrame` é agendado ANTES do
desenho, então a onda continuava animando normalmente enquanto tudo depois da
linha quebrada nunca desenhava — a imagem, o fio da crista, o clarão do ponto
**e a reserva do texto**.

**Por isso o contraste dava 3,91:1** e eu não entendia: a reserva nunca rodava
durante a batida. O sintoma visível (imagem sumida) e o sintoma medido
(contraste ruim) tinham a mesma causa.

**E eu checava o console cedo demais** — nos primeiros 3 segundos, antes da
primeira batida em ~2,5s. Em animação com período longo, "console limpo" só
vale se a janela de observação cobrir pelo menos um ciclo.

### Como verificar isto de novo

O painel de preview do Claude mantém `requestAnimationFrame` congelado, então
nada disso é observável por lá. O que funciona é **Chrome headless com tempo
virtual**, que roda rAF de verdade e de forma determinística:

```
chrome --headless=new --virtual-time-budget=11000 --screenshot=f.png
       --window-size=1440,900 http://localhost:8796
```

Variar o orçamento de tempo amostra momentos diferentes da batida. Medir cor
no resultado composto separa o que é onda (azul: `b - r > 18`) do que é
imagem (cinza neutro).

---

### Três coisas que não podem ser removidas

**A reserva do texto.** Sem ela o contraste cai de 5,98:1 para 3,1:1 no
instante em que a frente cruza a manchete. É um retângulo arredondado cavado
com `destination-out`, com penumbra feita por 18 retângulos concêntricos —
canvas não tem desfoque confiável em toda parte, isto tem.

**A conferência de tamanho por quadro.** `ResizeObserver` cobre quase tudo,
mas basta um caso escapar para bitmap e elemento saírem de sincronia: aí o
canvas **estica** e toda coordenada passa a mentir, inclusive a da reserva,
que deixa de cair sobre o texto. Isso aconteceu de verdade durante a
construção e custou caro para diagnosticar, porque nada quebra — só fica
sutilmente errado. A comparação por quadro é de dois inteiros.

**A parada fora da tela.** `IntersectionObserver` corta o laço quando o hero
sai de vista. É um hero: o visitante desce e nunca mais volta.

Com `prefers-reduced-motion` ela desenha **um quadro** e nunca mais — zero
`requestAnimationFrame` pedidos, verificado.

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
| Header | Horizontal negativa | **104-132px** ⚠️ | 180px |
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

Em 14/09/2026 ele pediu a horizontal **também no celular**, no lugar da
marca reduzida ZD que estava lá: quis o nome por extenso em tela pequena.
A assinatura passou a ser a mesma em toda largura, encolhendo por `clamp`
de 132px até 104px abaixo de ~440px de viewport — senão ela dividiria a
barra com o botão MENU. Medido no pior caso (320px): 104px de logo, 67px de
botão e 101px de folga entre os dois. A marca reduzida ZD segue no favicon,
que é o outro uso previsto para ela.

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
