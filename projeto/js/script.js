/* ============================================================
   Tech Commerce Solutions - script.js
   1) Dados e componentes reutilizáveis (cards)
   2) Menu mobile
   3) Dark mode
   4) Carrossel de produtos
   5) Aviso ao clicar em "Comprar"
   ============================================================ */

/* ---------- 1) DADOS ---------- */
const servicos = [
  { icone: '💻', titulo: 'Venda de computadores', texto: 'Desktops e notebooks para casa, escritório e estudo, com garantia.', grande: true,
    cls: 'md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-violet-700 text-white' },
  { icone: '🛠️', titulo: 'Assistência técnica', texto: 'Diagnóstico, limpeza, troca de peças e formatação.',
    cls: 'rounded-2xl border border-violet-200 bg-white text-violet-950 dark:border-white/15 dark:bg-white/5 dark:text-white' },
  { icone: '🎮', titulo: 'Equipamentos gamer', texto: 'PCs, periféricos e monitores para jogar com desempenho.',
    cls: 'rounded-[2rem] bg-cyan-400 text-violet-950' },
  { icone: '🖧', titulo: 'Infraestrutura de TI', texto: 'Redes, servidores e cabeamento para pequenas e médias empresas.',
    cls: 'md:col-span-2 rounded-3xl bg-violet-950 text-white dark:border dark:border-white/15' }
];

const produtos = [
  { nome: 'Notebook Pro 14"', desc: 'Intel Core i7, 16 GB de RAM, SSD de 512 GB', preco: 4599.00, img: 'notebook.svg' },
  { nome: 'PC Gamer Ryzen 5', desc: 'Placa de vídeo RTX 4060, 16 GB de RAM', preco: 5899.00, img: 'pc-gamer.svg' },
  { nome: 'Teclado Mecânico RGB', desc: 'Switch azul, iluminação RGB, ABNT2', preco: 349.90, img: 'teclado.svg' },
  { nome: 'Headset Gamer 7.1', desc: 'Som surround virtual e microfone removível', preco: 289.90, img: 'headset.svg' },
  { nome: 'Mouse Gamer 12.000 DPI', desc: '6 botões programáveis e sensor óptico', preco: 159.90, img: 'mouse.svg' },
  { nome: 'Monitor 27" 144 Hz', desc: 'Painel IPS Full HD, 1 ms, HDMI e DisplayPort', preco: 1299.00, img: 'monitor.svg' }
];

/* ---------- COMPONENTES: cada função devolve o HTML de um card ----------
   Escrevemos o card uma vez e reutilizamos para todos os itens da lista. */
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function cardServico(s) {
  return `
    <article class="flex min-h-[11rem] flex-col justify-between p-6 ${s.cls}">
      <span class="${s.grande ? 'text-7xl' : 'text-4xl'}" aria-hidden="true">${s.icone}</span>
      <div>
        <h3 class="font-display font-bold leading-tight ${s.grande ? 'text-4xl' : 'text-xl'}">${s.titulo}</h3>
        <p class="mt-2 opacity-80 ${s.grande ? 'max-w-xs text-base' : 'text-sm'}">${s.texto}</p>
      </div>
    </article>`;
}

function cardProduto(p) {
  return `
    <div class="slide p-2">
      <article class="tilt spot flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/5">
        <img src="img/${p.img}" alt="${p.nome}" loading="lazy" class="h-48 w-full bg-violet-100 object-contain p-5">
        <div class="flex flex-1 flex-col p-5">
          <h3 class="font-display text-xl font-bold text-white">${p.nome}</h3>
          <p class="mt-1 flex-1 text-sm text-violet-200">${p.desc}</p>
          <p class="mt-4 font-display text-3xl font-bold text-cyan-300">${formatarPreco(p.preco)}</p>
          <button type="button" class="btn btn-accent mt-4 w-full" data-nome="${p.nome}">Comprar</button>
        </div>
      </article>
    </div>`;
}

// Monta as listas na página
document.getElementById('lista-servicos').innerHTML = servicos.map(cardServico).join('');
const trilho = document.getElementById('trilho');
trilho.innerHTML = produtos.map(cardProduto).join('');

/* ---------- 2) MENU MOBILE ---------- */
const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');

function alternarMenu(abrir) {
  menu.classList.toggle('hidden', !abrir);
  btnMenu.setAttribute('aria-expanded', abrir);
  btnMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  btnMenu.textContent = abrir ? '✕' : '☰';
}

btnMenu.addEventListener('click', () => alternarMenu(menu.classList.contains('hidden')));
// Fecha o menu depois de escolher uma opção
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => alternarMenu(false)));

/* ---------- 3) DARK MODE ---------- */
const btnTema = document.getElementById('btn-tema');
const raiz = document.documentElement;

function atualizarBotaoTema() {
  const escuro = raiz.classList.contains('dark');
  btnTema.textContent = escuro ? '☀️' : '🌙';
  btnTema.setAttribute('aria-pressed', escuro);
  btnTema.setAttribute('aria-label', escuro ? 'Ativar modo claro' : 'Ativar modo escuro');
}

btnTema.addEventListener('click', () => {
  const escuro = raiz.classList.toggle('dark');        // liga/desliga a classe "dark"
  try { localStorage.setItem('tema', escuro ? 'escuro' : 'claro'); } catch (e) {}
  atualizarBotaoTema();
});
atualizarBotaoTema();

/* ---------- 4) CARROSSEL DE PRODUTOS ---------- */
const btnAnterior = document.getElementById('anterior');
const btnProximo = document.getElementById('proximo');
let indice = 0; // posição do primeiro card visível

// Quantos cards cabem na tela (igual às regras do CSS: 1, 2 ou 3)
function cardsPorTela() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function atualizarCarrossel() {
  const ultimo = produtos.length - cardsPorTela();
  indice = Math.min(Math.max(indice, 0), ultimo);        // mantém o índice dentro do limite
  const larguraCard = trilho.children[0].offsetWidth;
  trilho.style.transform = `translateX(-${indice * larguraCard}px)`;
  btnAnterior.disabled = indice === 0;
  btnProximo.disabled = indice === ultimo;
}

btnAnterior.addEventListener('click', () => { indice--; atualizarCarrossel(); });
btnProximo.addEventListener('click', () => { indice++; atualizarCarrossel(); });
window.addEventListener('resize', atualizarCarrossel);
atualizarCarrossel();

/* ---------- 5) AVISO AO COMPRAR ---------- */
const aviso = document.getElementById('aviso');
let temporizador;

trilho.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-nome]');
  if (!botao) return;
  aviso.textContent = `${botao.dataset.nome} adicionado ao carrinho`;
  aviso.classList.add('visivel');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => aviso.classList.remove('visivel'), 2500);
});

/* ---------- 6) EFEITOS VISUAIS ---------- */
// 6.1 Faixa inclinada: o texto é repetido e rola sem emenda (veja @keyframes rolar no CSS)
const itensFaixa = ['Computadores', 'Notebooks', 'Periféricos', 'Equipamentos gamer', 'Suporte técnico'];
const blocoFaixa = itensFaixa.map(t => `${t}<i></i>`).join('').repeat(3);
document.getElementById('faixa').innerHTML = `<span>${blocoFaixa}</span><span>${blocoFaixa}</span>`;

// 6.2 Brilho que segue o mouse: guarda a posição do mouse em variáveis CSS (--x e --y)
document.addEventListener('pointermove', (e) => {
  const alvo = e.target.closest('.spot');
  if (!alvo) return;
  const caixa = alvo.getBoundingClientRect();
  alvo.style.setProperty('--x', `${e.clientX - caixa.left}px`);
  alvo.style.setProperty('--y', `${e.clientY - caixa.top}px`);
});

// 6.3 Inclinação 3D dos cards de produto, de acordo com a posição do mouse
trilho.addEventListener('pointermove', (e) => {
  const card = e.target.closest('.tilt');
  if (!card) return;
  const caixa = card.getBoundingClientRect();
  const x = (e.clientX - caixa.left) / caixa.width - 0.5;   // de -0,5 a 0,5
  const y = (e.clientY - caixa.top) / caixa.height - 0.5;
  card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
});
trilho.addEventListener('pointerout', (e) => {
  const card = e.target.closest('.tilt');
  if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
});
