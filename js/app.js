// ---------------------------------------------------------------------------
// Observatório Web — catálogo de telescópios
// Toda a listagem, busca/filtro e detalhes usam a Fetch API (AJAX), sem
// recarregar a página, conforme exigido pela avaliação.
// ---------------------------------------------------------------------------

const URL_CATALOGO = "data/catalogo.json";
const URL_DETALHES = "data/detalhes.json";

// Referências dos elementos da página
const listaEl = document.getElementById("lista-catalogo");
const estadoCarregando = document.getElementById("estado-carregando");
const estadoErro = document.getElementById("estado-erro");
const estadoVazio = document.getElementById("estado-vazio");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");
const campoBusca = document.getElementById("campo-busca");
const grupoCategorias = document.getElementById("grupo-categorias");

const modalEl = document.getElementById("modalDetalhes");
const modalTitulo = document.getElementById("modalDetalhesTitulo");
const modalCorpo = document.getElementById("modalDetalhesCorpo");
const modalDetalhes = new bootstrap.Modal(modalEl);

// Estado em memória: guarda o catálogo já carregado para permitir busca e
// filtro instantâneos, sem repetir a requisição de listagem.
let catalogoCompleto = [];
let categoriaAtual = "todos";

function mostrarCarregando(mostrar) {
  estadoCarregando.classList.toggle("d-none", !mostrar);
}

function mostrarErro(mostrar) {
  estadoErro.classList.toggle("d-none", !mostrar);
}

// 1) Listagem dinâmica: carrega o catálogo via AJAX (Fetch API)
async function carregarCatalogo() {
  mostrarErro(false);
  mostrarCarregando(true);
  estadoVazio.classList.add("d-none");
  listaEl.innerHTML = "";

  try {
    const resposta = await fetch(URL_CATALOGO);
    if (!resposta.ok) {
      throw new Error("Falha na requisição: " + resposta.status);
    }
    const dados = await resposta.json();
    catalogoCompleto = dados;
    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao carregar catálogo:", erro);
    mostrarErro(true);
  } finally {
    mostrarCarregando(false);
  }
}

// 3) Busca ou filtro: aplicado sobre os dados já carregados em memória
function aplicarFiltros() {
  const termo = campoBusca.value.trim().toLowerCase();

  const filtrados = catalogoCompleto.filter((item) => {
    const combinaCategoria = categoriaAtual === "todos" || item.categoria === categoriaAtual;
    const combinaTexto =
      !termo ||
      item.titulo.toLowerCase().includes(termo) ||
      item.resumo.toLowerCase().includes(termo);
    return combinaCategoria && combinaTexto;
  });

  renderizarLista(filtrados);
}

function renderizarLista(itens) {
  listaEl.innerHTML = "";

  if (itens.length === 0) {
    estadoVazio.classList.remove("d-none");
    return;
  }
  estadoVazio.classList.add("d-none");

  itens.forEach((item) => {
    const coluna = document.createElement("div");
    coluna.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    coluna.innerHTML = `
      <article class="card-item">
        <span class="badge-categoria" data-cat="${item.categoria}">${item.categoria}</span>
        <h3>${item.titulo}</h3>
        <p>${item.resumo}</p>
        <button type="button" class="btn btn-sm btn-ver-detalhes" data-id="${item.id}">
          Ver detalhes
        </button>
      </article>
    `;
    listaEl.appendChild(coluna);
  });
}

// 2) Consulta de detalhes: nova requisição AJAX ao clicar em um item.
// As informações exibidas aqui (localização, operador, status, curiosidade)
// não estão presentes na listagem inicial — só chegam com esta requisição.
async function abrirDetalhes(id) {
  const itemBase = catalogoCompleto.find((item) => item.id === id);
  modalTitulo.textContent = itemBase ? itemBase.titulo : "Detalhes";

  modalCorpo.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border" role="status" aria-hidden="true"></div>
      <p class="mt-3 text-muted mb-0">Carregando detalhes...</p>
    </div>
  `;
  modalDetalhes.show();

  try {
    const resposta = await fetch(URL_DETALHES);
    if (!resposta.ok) {
      throw new Error("Falha na requisição: " + resposta.status);
    }
    const todosDetalhes = await resposta.json();
    const detalhe = todosDetalhes[id];

    if (!detalhe) {
      modalCorpo.innerHTML = '<p class="text-muted mb-0">Não há informações adicionais para este item.</p>';
      return;
    }

    modalCorpo.innerHTML = `
      <dl class="detalhes-lista">
        <dt>Localização</dt><dd>${detalhe.localizacao}</dd>
        <dt>Início de operação</dt><dd>${detalhe.inauguracao}</dd>
        <dt>Operado por</dt><dd>${detalhe.operador}</dd>
        <dt>Tipo de observação</dt><dd>${detalhe.tipoObservacao}</dd>
        <dt>Status</dt><dd>${detalhe.status}</dd>
      </dl>
      <p class="mt-3 mb-0">${detalhe.curiosidade}</p>
    `;
  } catch (erro) {
    console.error("Erro ao carregar detalhes:", erro);
    modalCorpo.innerHTML = `
      <p class="mb-3">Não foi possível carregar os detalhes deste item.</p>
      <button type="button" class="btn btn-outline-light btn-sm" id="btn-tentar-detalhes">
        Tentar novamente
      </button>
    `;
    document.getElementById("btn-tentar-detalhes").addEventListener("click", () => abrirDetalhes(id));
  }
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

listaEl.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".btn-ver-detalhes");
  if (!botao) return;
  abrirDetalhes(Number(botao.dataset.id));
});

campoBusca.addEventListener("input", aplicarFiltros);

grupoCategorias.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".btn-filtro");
  if (!botao) return;

  categoriaAtual = botao.dataset.categoria;
  document.querySelectorAll(".btn-filtro").forEach((b) => b.classList.remove("active"));
  botao.classList.add("active");
  aplicarFiltros();
});

btnTentarNovamente.addEventListener("click", carregarCatalogo);

document.addEventListener("DOMContentLoaded", carregarCatalogo);
