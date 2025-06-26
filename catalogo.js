// 1. Configurar Firebase (adicione suas chaves abaixo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Categorias e ícones
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

// 3. Renderizar categorias
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

// 4. Busca produtos
const buscaInput = document.getElementById('busca');
buscaInput.oninput = renderProdutos;

// 5. Variável global para armazenar os produtos vindos do Firestore
let produtos = [];

// 6. Buscar produtos no Firestore
async function buscarProdutosFirestore() {
  produtos = [];
  const snap = await getDocs(collection(db, "produtos"));
  snap.forEach(docu => {
    produtos.push(docu.data());
  });
  renderProdutos();
}

// 7. Renderizar produtos
const listaDiv = document.getElementById('produtos-lista');
function renderProdutos() {
  const busca = buscaInput.value.toLowerCase();
  let filtrados = produtos.filter(prod =>
    (categoriaAtual === "Todos" || prod.categoria === categoriaAtual) &&
    (
      prod.nome?.toLowerCase().includes(busca) ||
      prod.descricao?.toLowerCase().includes(busca) ||
      prod.categoria?.toLowerCase().includes(busca)
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
        <div class="produto-preco">R$ ${Number(prod.preco).toFixed(2).replace('.', ',')}</div>
        <div class="produto-desc">${prod.descricao || ''}</div>
        ${prod.destaque ? `<span class="produto-destaque">★ Destaque</span>` : ""}
        ${prod.promocao ? `<span class="produto-promocao">Promoção</span>` : ""}
      </div>
    </div>
  `).join('');
}

// 8. Inicialização
renderCategorias();
buscarProdutosFirestore();


