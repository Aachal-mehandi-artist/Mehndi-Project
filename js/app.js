// ============================================================
//  SAMPLE GALLERY DATA — shown when Firebase is not configured
//  Replace these with your own images in the admin panel
// ============================================================
const SAMPLE_IMAGES = [
  { id:'s1', url:'https://images.unsplash.com/photo-1590736969596-720e4bfa35a9?w=600&q=80', title:'Bridal Full Hand',       category:'bridal'      },
  { id:'s2', url:'https://images.unsplash.com/photo-1583391265914-c4a1b72c0b7a?w=600&q=80', title:'Arabic Floral',          category:'arabic'      },
  { id:'s3', url:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80', title:'Traditional Design',       category:'traditional' },
  { id:'s4', url:'https://images.unsplash.com/photo-1611926485963-96d2e8c7cfa3?w=600&q=80', title:'Indo Arabic Bridal',     category:'indo-arabic' },
  { id:'s5', url:'https://images.unsplash.com/photo-1617529497624-7c8ee93e11b2?w=600&q=80', title:'Simple Occasion',        category:'simple'      },
  { id:'s6', url:'https://images.unsplash.com/photo-1583391265800-da4a47b6b6de?w=600&q=80', title:'Bridal Back Hand',       category:'bridal'      },
  { id:'s7', url:'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=600&q=80', title:'Arabic Bold Florals',    category:'arabic'      },
  { id:'s8', url:'https://images.unsplash.com/photo-1583391265914-c4a1b72c0b7a?w=400&q=80', title:'Party Design',          category:'simple'      },
  { id:'s9', url:'https://images.unsplash.com/photo-1590736969596-720e4bfa35a9?w=400&q=80', title:'Festive Traditional',   category:'traditional' },
  { id:'s10',url:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80', title:'Bridal Feet',              category:'bridal'      },
  { id:'s11',url:'https://images.unsplash.com/photo-1611926485963-96d2e8c7cfa3?w=400&q=80', title:'Indo Arabic Pattern',  category:'indo-arabic' },
  { id:'s12',url:'https://images.unsplash.com/photo-1617529497624-7c8ee93e11b2?w=400&q=80', title:'Simple Arabic',        category:'arabic'      },
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
  set('footName',        c.name || 'Mehndi Art');
  set('footCopyName',    c.name || 'Mehndi Art');
  set('cWa',             c.phone || '+91 99999 99999');
  set('cPh',             c.phone || '+91 99999 99999');
  set('cIg',             c.instagram || '@mehndiartist');
  set('cLoc',            c.location || 'India');

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
      galleryItems = SAMPLE_IMAGES;
    }
  } catch(e) {
    console.warn('Gallery fallback to sample data', e);
    galleryItems = SAMPLE_IMAGES;
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
