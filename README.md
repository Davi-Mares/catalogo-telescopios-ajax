# Observatório Web — Catálogo de Telescópios

**Nome completo:** Davi Alves Mares
**Disciplina:** Desenvolvimento Web — UNEMAT
**Professor:** Ivan Luiz Pedroso Pires
**Tema:** Catálogo interativo de telescópios e observatórios astronômicos (espaciais e terrestres)

## Descrição

Catálogo interativo construído com HTML5, CSS3, Bootstrap 5 e JavaScript, que lista
telescópios e observatórios astronômicos carregados por requisições AJAX (Fetch API),
com busca por texto, filtro por categoria e detalhes de cada item exibidos em um modal,
sem recarregar a página.

## Funcionalidades

- **Listagem dinâmica:** 10 itens carregados via AJAX a partir de `data/catalogo.json`
  (identificador, título, categoria e resumo).
- **Consulta de detalhes:** ao clicar em "Ver detalhes", uma nova requisição AJAX busca
  `data/detalhes.json` e exibe, em um modal do Bootstrap, informações que **não** estão
  na listagem inicial (localização, início de operação, operador, tipo de observação,
  status e uma curiosidade).
- **Busca e filtro:** campo de busca por texto (nome ou palavras do resumo) e botões de
  filtro por categoria (Espacial / Terrestre), aplicados sobre os dados já carregados,
  sem nova requisição.
- **Estados da interface:** indicador de carregamento (spinner), mensagem de "nenhum
  resultado encontrado" e aviso de erro com botão "Tentar novamente" (tanto na listagem
  quanto na busca de detalhes).
- **Layout responsivo:** grid do Bootstrap adaptando de 1 a 4 colunas, do celular ao
  desktop.
- **Componentes Bootstrap:** navbar responsiva, cards, botões, formulário de busca/filtro
  e modal (componente interativo).

## Fonte dos dados

Os dados são arquivos JSON locais, escritos para fins didáticos com base em informações
públicas e amplamente conhecidas sobre telescópios e observatórios reais:

- `data/catalogo.json` — fonte usada na listagem.
- `data/detalhes.json` — fonte separada, usada apenas na consulta de detalhes.

## Tecnologias e bibliotecas

- HTML5 semântico
- CSS3 (variáveis customizadas, sem framework de CSS além do Bootstrap)
- [Bootstrap 5.3.3](https://getbootstrap.com/) (via CDN)
- [Bootstrap Icons 1.11.3](https://icons.getbootstrap.com/) (via CDN)
- Fontes [Fraunces](https://fonts.google.com/specimen/Fraunces) e
  [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- JavaScript puro (Fetch API), sem frameworks como React, Vue ou Angular

## Estrutura de arquivos

```
catalogo-telescopios/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── data/
│   ├── catalogo.json
│   └── detalhes.json
├── assets/
│   └── telescopio.svg
└── README.md
```

## Como executar

O projeto usa `fetch()` para carregar arquivos JSON, por isso **não funciona** abrindo o
`index.html` diretamente pelo navegador (`file://`). É necessário servir os arquivos por
HTTP. Qualquer uma das opções abaixo funciona:

**Opção 1 — Python (já vem instalado na maioria dos sistemas):**
```bash
cd catalogo-telescopios
python3 -m http.server 8000
```
Depois acesse: http://localhost:8000

**Opção 2 — Node.js:**
```bash
cd catalogo-telescopios
npx serve
```

**Opção 3 — VS Code:**
Instale a extensão "Live Server" e clique em "Go Live" com o `index.html` aberto.

## Roteiro de testes

1. **Listagem:** ao abrir a página, o spinner aparece brevemente e os 10 telescópios
   são exibidos em cards.
2. **Detalhes:** clique em "Ver detalhes" em qualquer card — um modal abre com um novo
   carregamento e exibe informações adicionais (ex.: localização, operador, curiosidade).
3. **Busca:** digite, por exemplo, `infravermelho` no campo de busca e observe a lista
   ser filtrada instantaneamente.
4. **Filtro por categoria:** clique em "Espacial" ou "Terrestre" e observe que apenas os
   itens da categoria escolhida permanecem visíveis; combine com o campo de busca.
5. **Estado vazio:** busque por um termo inexistente (ex.: `xyz123`) e veja a mensagem
   de "nenhum item encontrado".
6. **Estado de erro:** renomeie temporariamente `data/catalogo.json` (ou pare o servidor
   local) e recarregue a página — o aviso de erro deve aparecer com o botão
   "Tentar novamente"; restaure o arquivo e clique no botão para confirmar que a
   listagem volta a carregar.
7. **Responsividade:** redimensione a janela (ou use o modo de inspeção mobile do
   navegador) para conferir a adaptação do menu, do grid de cards e do formulário de
   busca/filtro.
