// --- Firebase Configuração ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Config do seu Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyCKWVJAOveA4N-Y5CbbJKUVJMPRRHS5vaE",
  authDomain: "catalogo-rolli-acbb1.firebaseapp.com",
  projectId: "catalogo-rolli-acbb1",
  storageBucket: "catalogo-rolli-acbb1.appspot.com",
  messagingSenderId: "986465468536",
  appId: "1:986465468536:web:50ce79f10385317b032d8d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Carregar Banner, Logo, Nome da Loja, Categorias ---
async function carregarConfigLoja() {
  // Pega a collection "config"
  const snap = await getDocs(collection(db, "config"));
  let config = {};
  snap.forEach(doc => config = doc.data());

  // Banner (imagem e texto)
  if(config.bannerUrl) {
    document.getElementById('banner-img').src = config.bannerUrl;
    document.getElementById('banner-img').style.display = "block";
  }
  if(config.bannerText) {
    document.getElementById('banner-text').textContent = config.bannerText;
  } else {
    document.getElementById('banner-text').textContent = "Promoção de Lançamento! Aproveite ofertas especiais na Rolli!";
  }
  if(config.bannerColor) {
    document.getElementById('banner-area').style.background = config.bannerColor;
  }

  // Logo
  if(config.logoUrl) {
    document.getElementById('logo-img').src = config.logoUrl;
    document.getElementById('logo-img').style.display = "inline-block";
  }

  // Nome da loja
  if(config.nomeLoja) {
    document.getElementById('nome-loja').textContent = config.nomeLoja;
  }

  // Categorias
  const categorias = config.categorias || [
    "Óculos", "Relógio", "Fone", "Carteira", "Bolsas", "Calçados", "Roupas", "Lanternas", "Informática", "Outros"
  ];
  montarCategorias(categorias);
}

function montarCategorias(lista) {
  const area = document.getElementById('categorias-area');
  area.innerHTML = '';
  area.innerHTML += `<button class="cat-btn active" data-cat="Todos">📋 Todos</button>`;
  lista.forEach(cat => {
    let emoji = "📦";
    switch(cat.toLowerCase()) {
      case "óculos": emoji = "👓"; break;
      case "relógio": emoji = "⌚"; break;
      case "fone": emoji = "🎧"; break;
      case "carteira": emoji = "💼"; break;
      case "bolsas": emoji = "👜"; break;
      case "calçados": emoji = "👟"; break;
      case "roupas": emoji = "👕"; break;
      case "lanternas": emoji = "🔦"; break;
      case "informática": emoji = "💻"; break;
      case "outros": emoji = "🎁"; break;
    }
    area.innerHTML += `<button class="cat-btn" data-cat="${cat}">${emoji} ${cat}</button>`;
  });
  // Evento click
  Array.from(document.querySelectorAll('.cat-btn')).forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      carregarProdutos(btn.dataset.cat);
    };
  });
}

// --- Carregar Produtos ---
async function carregarProdutos(categoriaFiltro = "Todos") {
  const lista = document.getElementById('produtos-lista');
  lista.innerHTML = "Carregando...";
  const snap = await getDocs(collection(db, "produtos"));
  let html = "";
  snap.forEach(doc => {
    const p = doc.data();
    if(categoriaFiltro === "Todos" || p.categoria === categoriaFiltro) {
      html += `
      <div class="produto-catalogo">
        <img src="${p.imagem}" alt="${p.nome}" class="produto-img">
        <div class="produto-info">
          <h2>${p.nome}</h2>
          <div class="prod-cat">${p.categoria || ""}</div>
          <div class="prod-preco">R$ ${Number(p.preco).toFixed(2).replace('.',',')}</div>
          <div class="prod-desc">${p.descricao || ""}</div>
        </div>
      </div>
      `;
    }
  });
  lista.innerHTML = html || "<p style='text-align:center'>Nenhum produto cadastrado.</p>";
}

// --- Busca ---
document.getElementById('busca-produto').addEventListener('input', async function() {
  const termo = this.value.trim().toLowerCase();
  const lista = document.getElementById('produtos-lista');
  lista.innerHTML = "Buscando...";
  const snap = await getDocs(collection(db, "produtos"));
  let html = "";
  snap.forEach(doc => {
    const p = doc.data();
    const busca = (p.nome + " " + (p.categoria || "") + " " + (p.descricao || "")).toLowerCase();
    if(busca.includes(termo)) {
      html += `
      <div class="produto-catalogo">
        <img src="${p.imagem}" alt="${p.nome}" class="produto-img">
        <div class="produto-info">
          <h2>${p.nome}</h2>
          <div class="prod-cat">${p.categoria || ""}</div>
          <div class="prod-preco">R$ ${Number(p.preco).toFixed(2).replace('.',',')}</div>
          <div class="prod-desc">${p.descricao || ""}</div>
        </div>
      </div>
      `;
    }
  });
  lista.innerHTML = html || "<p style='text-align:center'>Nenhum produto encontrado.</p>";
});

// --- Inicializar tudo ---
carregarConfigLoja();
carregarProdutos("Todos");
