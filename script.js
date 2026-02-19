const DEFAULT_PIX_KEY = '06750938302';
const DEFAULT_WHATSAPP_NUMBER = '5511999999999';
const STORAGE_KEY = 'prata-express-config';

const products = [
  { id: 1, name: 'Corrente Grumet 925', description: 'Corrente masculina clássica 60cm.', price: 169.9 },
  { id: 2, name: 'Pulseira Italiana 925', description: 'Pulseira com fecho reforçado.', price: 119.9 },
  { id: 3, name: 'Pingente Cruz Prata', description: 'Pingente em prata de alto brilho.', price: 79.9 },
  { id: 4, name: 'Kit Corrente + Pingente', description: 'Combo para aumentar ticket médio.', price: 229.9 },
];

const cart = new Map();

const productGrid = document.getElementById('productGrid');
const orderSummary = document.getElementById('orderSummary');
const totalValue = document.getElementById('totalValue');
const copyPixBtn = document.getElementById('copyPixBtn');
const copyPixInlineBtn = document.getElementById('copyPixInlineBtn');
const generateOrderBtn = document.getElementById('generateOrderBtn');
const pixInput = document.getElementById('pixInput');
const whatsappInput = document.getElementById('whatsappInput');
const setupForm = document.getElementById('setupForm');
const setupMessage = document.getElementById('setupMessage');
const pixKeyDisplay = document.getElementById('pix-key');
const footerPixDisplay = document.getElementById('footerPix');

document.getElementById('year').textContent = new Date().getFullYear();

function getConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { pixKey: DEFAULT_PIX_KEY, whatsappNumber: DEFAULT_WHATSAPP_NUMBER };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      pixKey: parsed.pixKey || DEFAULT_PIX_KEY,
      whatsappNumber: parsed.whatsappNumber || DEFAULT_WHATSAPP_NUMBER,
    };
  } catch {
    return { pixKey: DEFAULT_PIX_KEY, whatsappNumber: DEFAULT_WHATSAPP_NUMBER };
  }
}

function setConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function applyConfigToScreen(config) {
  pixInput.value = config.pixKey;
  whatsappInput.value = config.whatsappNumber;
  pixKeyDisplay.textContent = config.pixKey;
  footerPixDisplay.textContent = config.pixKey;
}

function currency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${currency(product.price)}</p>
        <button class="btn" data-id="${product.id}">Adicionar ao pedido</button>
      </article>
    `,
    )
    .join('');
}

function updateSummary() {
  const items = [...cart.values()];
  if (items.length === 0) {
    orderSummary.textContent = 'Nenhum item selecionado.';
    totalValue.textContent = currency(0);
    return;
  }

  const text = items.map((item) => `${item.qty}x ${item.name}`).join(', ');
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  orderSummary.textContent = text;
  totalValue.textContent = currency(total);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const current = cart.get(productId) || { ...product, qty: 0 };
  current.qty += 1;
  cart.set(productId, current);
  updateSummary();
}

async function copyPix() {
  const { pixKey } = getConfig();
  try {
    await navigator.clipboard.writeText(pixKey);
    alert('Chave Pix copiada com sucesso!');
  } catch {
    alert(`Copie manualmente sua chave Pix: ${pixKey}`);
  }
}

function generateWhatsappOrder() {
  const { pixKey, whatsappNumber } = getConfig();

  if (cart.size === 0) {
    alert('Adicione pelo menos um produto antes de gerar o pedido.');
    return;
  }

  if (!/^\d{12,14}$/.test(whatsappNumber)) {
    alert('Configure um WhatsApp válido (somente números com DDI).');
    return;
  }

  const items = [...cart.values()];
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const lines = [
    'Olá! Quero fechar este pedido da Prata Express:',
    ...items.map((item) => `- ${item.qty}x ${item.name} (${currency(item.price)})`),
    `Total: ${currency(total)}`,
    `Pagamento via Pix: ${pixKey}`,
  ];

  const message = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, '_blank');
}

function handleSetupSubmit(event) {
  event.preventDefault();
  const pixKey = pixInput.value.trim();
  const whatsappNumber = whatsappInput.value.replace(/\D/g, '').trim();

  if (!pixKey) {
    setupMessage.textContent = 'Informe uma chave Pix válida.';
    return;
  }

  if (!/^\d{12,14}$/.test(whatsappNumber)) {
    setupMessage.textContent = 'WhatsApp inválido. Use somente números com DDI, ex: 5511999999999.';
    return;
  }

  const config = { pixKey, whatsappNumber };
  setConfig(config);
  applyConfigToScreen(config);
  setupMessage.textContent = 'Configuração salva com sucesso!';
}

productGrid.addEventListener('click', (event) => {
  if (event.target.matches('button[data-id]')) {
    addToCart(Number(event.target.dataset.id));
  }
});

setupForm.addEventListener('submit', handleSetupSubmit);
copyPixBtn.addEventListener('click', copyPix);
copyPixInlineBtn.addEventListener('click', copyPix);
generateOrderBtn.addEventListener('click', generateWhatsappOrder);

const initialConfig = getConfig();
applyConfigToScreen(initialConfig);
renderProducts();
updateSummary();
