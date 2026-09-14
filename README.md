# Zenith Dias

Site institucional do estúdio. HTML, CSS e JavaScript puros — sem build, sem
dependência de pacote. Abrir `index.html` já funciona.

```
index.html               página única
assets/css/styles.css    sistema visual (tokens no bloco 01)
assets/js/main.js        comportamento (12 módulos; CONTATO no topo)
assets/fonts/            Inter Display e Inter (WOFF2, do kit)
assets/img/logo/         assinaturas oficiais em SVG
assets/favicon.svg       marca reduzida ZD
robots.txt  404.html     arquivos de publicação
ZENITH_DIAS_Kit_Final/   identidade oficial — NÃO editar
PRODUCT.md               o que o site é e as regras do projeto
DESIGN.md                decisões visuais, com os números medidos
PENDENCIAS.md            o que falta você me mandar
```

## Ver no navegador

```bash
npx http-server "C:/Users/gabri/AppData/Local/Temp/claude/zenith-preview" -p 8796 -c-1
```

Depois abrir <http://localhost:8796>.

O caminho é uma **junção** para esta pasta. Ela existe porque `npx` quebra com
espaço e acento no caminho (`Área de Trabalho`, `Zenith Dias`), e nenhuma
citação resolve. Se a junção desaparecer:

```powershell
New-Item -ItemType Junction -Path "C:\Users\gabri\AppData\Local\Temp\claude\zenith-preview" -Target "C:\Users\gabri\OneDrive\Área de Trabalho\Zenith Dias"
```

Também existe a entrada `zenith` no `launch.json` do hub (`Claude IA/.claude`),
porta 8796.

## Antes de publicar

Ler `PENDENCIAS.md`. Os itens **01** (contatos), **02** (faixas de
investimento) e **03** (domínio) bloqueiam a publicação: sem eles o
formulário não envia e o preview de link aponta para um domínio que não é
seu.

## Ao mexer em qualquer headline

As quebras são escritas à mão no HTML, uma **frase por linha**, porque a
máscara anima por bloco.

Duas regras diferentes, e confundir as duas é o erro fácil:

- **No desktop nada pode embrulhar.** Se uma frase deixar de caber, ela
  re-quebra dentro da máscara — e isso **não** aparece em teste de estouro,
  porque o texto embrulha em vez de vazar.
- **No mobile embrulhar é o comportamento certo.** A escala do brandbook fixa
  o H1 em 40px no celular; frase nenhuma cabe em uma linha a esse tamanho.
  A máscara anima o bloco inteiro, sem corte. Não tente consertar reduzindo a
  tipografia: isso desobedeceria o kit.

Para checar o desktop, rodar no console em 1024, 1280, 1440 e 1680:

```js
[...document.querySelectorAll('[data-linhas] .linha > span')]
  .filter(s => {
    const st = getComputedStyle(s);
    const lh = parseFloat(st.lineHeight) || parseFloat(st.fontSize) * 1.2;
    return Math.round(s.getBoundingClientRect().height / lh) > 1;
  })
  .map(s => s.textContent.trim());
```

Array vazio = tudo certo **no desktop**. Item na lista pede reescrita da
frase, não tipografia menor. Verificado limpo em 1024 · 1280 · 1440 · 1680.

## Trocar as plantas por capturas reais

Cada projeto tem uma planta em CSS no lugar da foto. Para trocar, um `<img>`
dentro de `.chapa__quadro` — a planta desaparece sozinha:

```html
<div class="chapa__quadro">
  <img src="assets/img/work/pernil.webp" alt="Site da Pernil&amp;Co." loading="lazy" decoding="async">
  <div class="planta" aria-hidden="true"> ... </div>
```

## Acessibilidade — o que não pode regredir

Todo texto ≥ 4,5:1 de contraste. `h1` único, hierarquia sem salto. Navegação
por teclado com foco visível em azul. Todo campo com `<label>`. Menu mobile
fecha com `Esc` e devolve o foco ao botão. `prefers-reduced-motion` entrega o
site em estado final, incluindo a convergência já convergida — não em estado
vazio. Sem JavaScript, o site continua legível e navegável.
