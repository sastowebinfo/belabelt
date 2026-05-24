/* ============================================================
   script.js — Bela Belt Coffee
   Features:
   - Sticky navbar
   - Mobile menu
   - Scroll reveal
   - Counter animation
   - Gallery (from localStorage or defaults, with labels)
   - Contact form → localStorage storage
   ============================================================ */

const SITE_VERSION = '2.9'; // BUMP THIS FOR EVERY DEPLOYMENT TO FORCE GUEST REFRESH

/* ─── Default Gallery Images ─────────────────────────────── */
const DEFAULT_GALLERY = [
  { src: 'images/img21.jpeg', label: 'Bela Belt Signature' },
  { src: 'images/img20.jpeg', label: 'Golden Crema' },
  { src: 'images/img18.jpeg', label: 'Crafted with Passion' },
  { src: 'images/img17.jpeg', label: 'Himalayan Blend' },
  { src: 'images/img15.jpeg', label: 'Coffee Culture' },
  { src: 'images/img14.jpeg', label: 'Our Signature' },
  { src: 'images/img12.jpeg', label: 'Morning Ritual' },
  { src: 'images/img9.jpeg',  label: 'The Café' },
  { src: 'images/img23.jpeg', label: 'Bela Belt Special' },
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Bela Belt Coffee', price: 'Rs. 2,250', quantity: '1000gm', img: 'images/product1.jpeg' },
  { id: 2, name: 'Bela Belt Coffee', price: 'Rs. 1,150', quantity: '500gm', img: 'images/product2.jpeg' }
];

/* ─── localStorage helpers ──────────────────────────────── */
function getGallery() {
  try {
    // Version key: bump this to reset gallery cache when defaults change
    const GALLERY_VERSION = 'v14_' + SITE_VERSION;
    if (localStorage.getItem('bb_gallery_version') !== GALLERY_VERSION) {
      localStorage.setItem('bb_gallery_version', GALLERY_VERSION);
      localStorage.removeItem('bb_gallery'); // clear old cached gallery
    }
    const stored = JSON.parse(localStorage.getItem('bb_gallery'));
    return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_GALLERY;
  } catch { return DEFAULT_GALLERY; }
}

function saveGallery(data) {
  localStorage.setItem('bb_gallery', JSON.stringify(data));
}

function getProducts() {
  try {
    const PRODUCTS_VERSION = 'v3_updated_prices';
    if (localStorage.getItem('bb_products_version') !== PRODUCTS_VERSION) {
      localStorage.setItem('bb_products_version', PRODUCTS_VERSION);
      localStorage.removeItem('bb_products');
    }
    const stored = JSON.parse(localStorage.getItem('bb_products'));
    return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}

function saveProducts(data) {
  localStorage.setItem('bb_products', JSON.stringify(data));
}

function getContacts() {
  try {
    return JSON.parse(localStorage.getItem('bb_contacts')) || [];
  } catch { return []; }
}

function saveContact(entry) {
  const list = getContacts();
  list.unshift(entry);
  localStorage.setItem('bb_contacts', JSON.stringify(list));
}

/* ─── Render Gallery ────────────────────────────────────── */
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const items = getGallery();
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item reveal';
    div.setAttribute('data-index', i);
    const imgSrc = item.src.includes('?') ? item.src : `${item.src}?v=${SITE_VERSION}`;
    div.innerHTML = `
      <img src="${imgSrc}" alt="${item.label}" loading="lazy" />
      <div class="gallery-overlay">
        <span class="gallery-label">${item.label}</span>
      </div>`;
    grid.appendChild(div);
  });
  // re-observe new reveal items
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── Render Products ───────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const items = getProducts();
  grid.innerHTML = '';
  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'product-card reveal';
    const imgSrc = item.img.includes('?') ? item.img : `${item.img}?v=${SITE_VERSION}`;
    div.innerHTML = `
      <div class="product-img-wrap">
        <img src="${imgSrc}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <h3 class="product-name">${item.name}</h3>
        <p class="product-qty">${item.quantity}</p>
        <div class="product-footer">
          <a href="https://wa.me/9779841418609?text=Hello%20Bela%20Belt%20Coffee,%20I'm%20interested%20in%20inquiring%20about%20the%20${encodeURIComponent(item.name)}%20(${encodeURIComponent(item.quantity) || 'N/A'})." 
             class="btn-buy" target="_blank" style="width: 100%; text-align: center;">Inquiry</a>
        </div>
      </div>`;
    grid.appendChild(div);
  });
  
  // Re-observe EVERYTHING
  observer.disconnect();
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── Sticky Navbar ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── Mobile Nav ────────────────────────────────────────── */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navToggle').classList.toggle('active');
}
function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('active');
}

/* ─── Scroll Reveal ─────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── Counter Animation ──────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = start + suffix;
  }, 16);
}

const statsSection = document.getElementById('about');
let counted = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    animateCounter(document.getElementById('stat1'), 5000, '+');
    animateCounter(document.getElementById('stat2'), 30, '+');
    animateCounter(document.getElementById('stat3'), 2, '+');
  }
}, { threshold: 0.5 });
if (statsSection) statsObserver.observe(statsSection);

/* ─── Contact Form ──────────────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const msg   = document.getElementById('contactMessage');
    const errN  = document.getElementById('err-name');
    const errE  = document.getElementById('err-email');
    const errM  = document.getElementById('err-msg');

    // Reset
    [errN, errE, errM].forEach(el => el.style.display = 'none');
    [name, email, msg].forEach(el => el.style.borderColor = '');

    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
      errN.style.display = 'block';
      name.style.borderColor = '#e57373';
      valid = false;
    }
    // Validate email
    const emailRex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRex.test(email.value.trim())) {
      errE.style.display = 'block';
      email.style.borderColor = '#e57373';
      valid = false;
    }
    // Validate message
    if (!msg.value.trim() || msg.value.trim().length < 10) {
      errM.style.display = 'block';
      msg.style.borderColor = '#e57373';
      valid = false;
    }

    if (!valid) return;

    // Save to localStorage
    const entry = {
      id:      Date.now(),
      name:    name.value.trim(),
      email:   email.value.trim(),
      message: msg.value.trim(),
      date:    new Date().toLocaleString('en-NP', { timeZone: 'Asia/Kathmandu' })
    };
    saveContact(entry);

    // Success feedback
    const successEl = document.getElementById('formSuccess');
    successEl.style.display = 'block';
    form.reset();

    // Hide success after 5s
    setTimeout(() => { successEl.style.display = 'none'; }, 5000);
  });
}

/* ─── Init ──────────────────────────────────────────────── */
renderGallery();
renderProducts();
