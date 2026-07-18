// ============================================================
//  GALLERY DATA
//  To add a photo: put the file in images/gallery/ and add a
//  line below. category must be one of the filter buttons:
//  bridal | arabic | indo-arabic | traditional | simple
// ============================================================
const GALLERY_IMAGES = [
  { id:'g1', url:'images/gallery/bridal-lotus-mandala.jpg',  title:'Bridal Lotus Mandala',   category:'bridal' },
  { id:'g2', url:'images/gallery/bridal-dulhan-full-arm.jpg', title:'Dulhan Full Arm',       category:'bridal' },
  { id:'g3', url:'images/gallery/bridal-temple-peacock.jpg',  title:'Temple & Peacock Arm',  category:'bridal' },
  { id:'g4', url:'images/gallery/traditional-peacock-pair.jpg', title:'Peacock Pair',       category:'traditional' },
  { id:'g5', url:'images/gallery/indo-arabic-floral-mandala.jpg', title:'Floral Mandala',   category:'indo-arabic' },
  { id:'g6', url:'images/gallery/practice.png', title:'Simple',   category:'simple' },
  { id:'g7', url:'images/gallery/arabic-mehndi.png', title:'Archana Devghare',   category:'arabic' },
  { id:'g8', url:'images/gallery/Aachal Lokhande.png', title:'Aachal Lokhande',   category:'arabic' },
  { id:'g9', url:'images/gallery/Arpita Didi.png', title:'Arpita Didi',   category:'bridal' },
  { id:'g10', url:'images/gallery/Gayatri Taii.png', title:'Gayatri Taii',   category:'traditional' },
  { id:'g11', url:'images/gallery/Mayuri Tai.png', title:'Mayuri Taii',   category:'traditional' },
  { id:'g12', url:'images/gallery/Neha Gedam(friend).png', title:'Neha Gedam(friend)',   category:'bridal' },
  { id:'g13', url:'images/gallery/Neha Tai.png', title:'Neha Taii',   category:'indo-arabic' },
  { id:'g14', url:'images/gallery/Pallavi Taii.png', title:'Pallavi Taii',   category:'indo-arabic' },
  { id:'g15', url:'images/gallery/Prapti Bodkhe(Sister).png', title:'Prapti Bodkhe(Sister)',   category:'bridal' },
  { id:'g16', url:'images/gallery/Priyanka Malpe.png', title:'Priyanka Malpe(sibling)',   category:'arabic' },
];

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initNavbar();
  initHamburger();
  initCounters();
  initGallery();
  initContactForm();
  initLightbox();
  AOS.init({ duration: 700, once: true, offset: 60 });
  // Set min date on date picker to today
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('fDate');
  if (dateEl) dateEl.min = today;
});

// ============================================================
//  APPLY ARTIST CONFIG
// ============================================================
function applyConfig() {
  const c = typeof ARTIST_CONFIG !== 'undefined' ? ARTIST_CONFIG : {};
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
  const setHref = (id, href) => { const el = document.getElementById(id); if (el) el.href = href || '#'; };

  // Text
  set('nav-artist-name', c.name || 'Mehndi Art');
  set('nav-artist-tagline', c.tagline || '');
  set('footName',        c.name || 'Mehndi Art');
  set('footCopyName',    c.name || 'Mehndi Art');
  set('cWa',             c.phone || '+91 99999 99999');
  set('cPh',             c.phone || '+91 99999 99999');
  set('cIg',             c.instagram || '@mehndiartist');
  set('cLoc',            c.location || 'India');
  set('exp-years',       c.experience || '');

  const photoEl = document.getElementById('artistPhoto');
  if (photoEl && c.photo) photoEl.src = c.photo;

  // Links
  const waDig = c.phoneDigits || '919999999999';
  setHref('cWa',     `https://wa.me/${waDig}`);
  setHref('cPh',     `tel:+${waDig}`);
  setHref('cIg',     c.instagramUrl || '#');
  setHref('instaBtn',c.instagramUrl || '#');
  setHref('waFloat', `https://wa.me/${waDig}`);
  setHref('ftWa',    `https://wa.me/${waDig}`);
  setHref('ftIg',    c.instagramUrl || '#');

  // Facebook button
  if (c.facebook) {
    const fbEl = document.getElementById('ftFb');
    if (fbEl) { fbEl.href = c.facebook; fbEl.style.display = ''; }
  }

  // Stats
  const statTargets = document.querySelectorAll('.stat-n');
  const cfgTargets  = [c.happyClients, c.bridalDone, c.experience, c.patterns];
  statTargets.forEach((el, i) => {
    const raw = (cfgTargets[i] || '').toString().replace(/\D/g, '');
    if (raw) el.dataset.target = raw;
  });
}

// ============================================================
//  NAVBAR SCROLL EFFECT
// ============================================================
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ============================================================
//  MOBILE HAMBURGER
// ============================================================
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const toggle = () => {
    const open = links.classList.toggle('open');
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
  links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    links.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ============================================================
//  COUNTER ANIMATION
// ============================================================
function initCounters() {
  const els = document.querySelectorAll('.stat-n');
  const animate = (el) => {
    const target = +el.dataset.target || 0;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => observer.observe(el));
}

// ============================================================
//  GALLERY
// ============================================================
let galleryItems = [];
let currentCat   = 'all';
let lbIndex      = 0;

async function initGallery() {
  const grid = document.getElementById('galGrid');
  try {
    if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && typeof firebase !== 'undefined') {
      galleryItems = await loadFromFirebase();
    } else {
      galleryItems = GALLERY_IMAGES;
    }
  } catch(e) {
    console.warn('Gallery fallback to local data', e);
    galleryItems = GALLERY_IMAGES;
  }
  renderGallery(galleryItems);
  initFilters();
}

function renderGallery(items) {
  const grid = document.getElementById('galGrid');
  if (!items.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted);padding:60px">No images yet.</p>';
    return;
  }
  grid.innerHTML = items.map((img, i) => `
    <div class="gal-item" data-cat="${img.category || 'all'}" data-index="${i}" role="button" tabindex="0" aria-label="${img.title}">
      <img src="${img.url}" alt="${img.title}" loading="lazy">
      <div class="gal-overlay">
        <div class="gal-caption">
          <i class="fas fa-expand-alt" style="margin-right:6px"></i>${img.title}
        </div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.gal-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(+el.dataset.index));
    el.addEventListener('keydown', e => { if (e.key==='Enter') openLightbox(+el.dataset.index); });
  });
}

function initFilters() {
  document.querySelectorAll('.fil-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fil-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      const filtered = currentCat === 'all'
        ? galleryItems
        : galleryItems.filter(i => i.category === currentCat);
      renderGallery(filtered);
    });
  });
}

// ============================================================
//  LIGHTBOX
// ============================================================
function initLightbox() {
  document.getElementById('lbBg').addEventListener('click', closeLightbox);
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => shiftLightbox(-1));
  document.getElementById('lbNext').addEventListener('click', () => shiftLightbox(+1));
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   shiftLightbox(-1);
    if (e.key === 'ArrowRight')  shiftLightbox(+1);
  });
}

function getVisibleItems() {
  return currentCat === 'all' ? galleryItems : galleryItems.filter(i => i.category === currentCat);
}

function openLightbox(index) {
  const items = getVisibleItems();
  lbIndex = index;
  const item = items[lbIndex];
  if (!item) return;
  document.getElementById('lbImg').src = item.url;
  document.getElementById('lbCap').textContent = item.title;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function shiftLightbox(dir) {
  const items = getVisibleItems();
  lbIndex = (lbIndex + dir + items.length) % items.length;
  document.getElementById('lbImg').src = items[lbIndex].url;
  document.getElementById('lbCap').textContent = items[lbIndex].title;
}

// ============================================================
//  CONTACT FORM → WhatsApp
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const c = typeof ARTIST_CONFIG !== 'undefined' ? ARTIST_CONFIG : {};
    const name    = document.getElementById('fName').value.trim();
    const phone   = document.getElementById('fPhone').value.trim();
    const service = document.getElementById('fService').value;
    const date    = document.getElementById('fDate').value;
    const msg     = document.getElementById('fMsg').value.trim();
    const waDig   = c.phoneDigits || '919999999999';

    const text = [
      `Hello! I would like to book a mehndi appointment.`,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      service ? `*Service:* ${service}` : '',
      date    ? `*Date:* ${date}` : '',
      msg     ? `*Message:* ${msg}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${waDig}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

// ============================================================
//  FIREBASE GALLERY LOADER (used when USE_FIREBASE = true)
// ============================================================
async function loadFromFirebase() {
  const db  = firebase.firestore();
  const snap= await db.collection('gallery').orderBy('createdAt','desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
