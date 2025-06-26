// ----------- Configurações iniciais --------------

// Categorias e ícones (pode editar/adicionar)
const categorias = [
  { nome: "Todos", icon: "🗒️" },
  { nome: "Óculos", icon: "👓" },
  { nome: "Relógio", icon: "⌚" },
  { nome: "Fone", icon: "🎧" },
  { nome: "Carteira", icon: "💼" },
  { nome: "Bolsas", icon: "👜" },
  { nome: "Calçados", icon: "👟" },
  { nome: "Roupas", icon: "👕" },
  { nome: "Lanternas", icon: "🔦" },
  { nome: "Informática", icon: "💻" },
  { nome: "Outros", icon: "🎁" }
];

// Exemplo de produtos (depois pode trazer do Firebase)
const produtos = [
  {
    nome: "Oculos",
    categoria: "Óculos",
    preco: 99.90,
    descricao: "black",
    imagem: "https://placehold.co/120x120?text=Oculos",
    destaque: false,
    promocao: false
  }
  // Adicione outros produtos do Firebase
];

// ----------- Renderizar categorias --------------
const categoriasDiv = document.getElementById('categorias');
let categoriaAtual = "Todos";

function renderCategorias() {
  categoriasDiv.innerHTML = '';
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = "categoria-btn" + (cat.nome === categoriaAtual ? " ativa" : "");
    btn.innerHTML = `${cat.icon} ${cat.nome}`;
    btn.onclick = () => {
      categoriaAtual = cat.nome;
      renderCategorias();
      renderProdutos();
    };
    categoriasDiv.appendChild(btn);
  });
}

// ----------- Busca produtos --------------
const buscaInput = document.getElementById('busca');
buscaInput.oninput = renderProdutos;

// ----------- Renderizar produtos --------------
const listaDiv = document.getElementById('produtos-lista');

function renderProdutos() {
  const busca = buscaInput.value.toLowerCase();
  let filtrados = produtos.filter(prod =>
    (categoriaAtual === "Todos" || prod.categoria === categoriaAtual) &&
    (
      prod.nome.toLowerCase().includes(busca) ||
      prod.descricao?.toLowerCase().includes(busca) ||
      prod.categoria.toLowerCase().includes(busca)
    )
  );
  if (filtrados.length === 0) {
    listaDiv.innerHTML = "<p style='text-align:center;color:#888'>Nenhum produto encontrado.</p>";
    return;
  }
  listaDiv.innerHTML = filtrados.map(prod => `
    <div class="produto-card">
      <img src="${prod.imagem}" alt="${prod.nome}">
      <div class="produto-info">
        <div class="produto-nome">${prod.nome}</div>
        <div class="produto-categoria">${prod.categoria}</div>
        <div class="produto-preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</div>
        <div class="produto-desc">${prod.descricao || ''}</div>
        ${prod.destaque ? `<span class="produto-destaque">★ Destaque</span>` : ""}
        ${prod.promocao ? `<span class="produto-promocao">Promoção</span>` : ""}
      </div>
    </div>
  `).join('');
}

// ----------- Inicialização --------------
renderCategorias();
renderProdutos();

