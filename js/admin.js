// ============================================================
//  ADMIN PANEL — Firebase-powered image upload & management
//  This file uses ES module syntax; loaded with type="module"
// ============================================================
import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject }
  from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// ---- grab config from config.js (global) ----
const firebaseConfig = typeof FIREBASE_CONFIG !== 'undefined' ? FIREBASE_CONFIG : null;
if (!firebaseConfig || firebaseConfig.apiKey === 'YOUR_API_KEY') {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;background:#FEF6E9;padding:20px;text-align:center">
      <div>
        <div style="font-size:2rem;margin-bottom:16px">⚠️</div>
        <h2 style="color:#7B1818;margin-bottom:12px">Firebase Not Configured</h2>
        <p style="color:#7A5C4A;max-width:420px">
          Please open <code>js/config.js</code> and fill in your Firebase project details,
          then set <code>USE_FIREBASE = true</code>.
        </p>
        <p style="margin-top:16px"><a href="index.html" style="color:#7B1818;font-weight:600">← Back to Website</a></p>
      </div>
    </div>`;
  throw new Error('Firebase not configured');
}

const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// ---- state ----
let allImages     = [];
let deleteTarget  = null;   // { id, storagePath }
let selectedFile  = null;
let currentFilter = 'all';

// ---- DOM ----
const loginScreen  = document.getElementById('loginScreen');
const adminPanel   = document.getElementById('adminPanel');
const loginForm    = document.getElementById('loginForm');
const loginError   = document.getElementById('loginError');
const loginBtn     = document.getElementById('loginBtn');
const logoutBtn    = document.getElementById('logoutBtn');
const uploadForm   = document.getElementById('uploadForm');
const uploadBtn    = document.getElementById('uploadBtn');
const uploadMsg    = document.getElementById('uploadMsg');
const dropZone     = document.getElementById('dropZone');
const fileInput    = document.getElementById('fileInput');
const previewWrap  = document.getElementById('previewWrap');
const previewImg   = document.getElementById('previewImg');
const clearImgBtn  = document.getElementById('clearImg');
const adminGallery = document.getElementById('adminGallery');
const galleryCount = document.getElementById('galleryCount');
const deleteModal  = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete= document.getElementById('confirmDelete');
const progressWrap = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressLabel= document.getElementById('progressLabel');

// ============================================================
//  AUTH STATE
// ============================================================
onAuthStateChanged(auth, user => {
  if (user) {
    loginScreen.style.display  = 'none';
    adminPanel.style.display   = 'block';
    loadGallery();
  } else {
    loginScreen.style.display  = 'flex';
    adminPanel.style.display   = 'none';
  }
});

// ============================================================
//  LOGIN
// ============================================================
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginError.textContent = '';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in…';
  try {
    await signInWithEmailAndPassword(auth,
      document.getElementById('loginEmail').value.trim(),
      document.getElementById('loginPass').value
    );
  } catch(err) {
    loginError.textContent = 'Invalid email or password.';
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// ============================================================
//  FILE INPUT / DRAG-DROP
// ============================================================
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('drag-over');
  handleFile(e.dataTransfer.files[0]);
});
clearImgBtn.addEventListener('click', clearImage);

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  selectedFile = file;
  const url = URL.createObjectURL(file);
  previewImg.src = url;
  previewWrap.style.display = 'block';
  dropZone.style.display    = 'none';
}
function clearImage() {
  selectedFile = null;
  fileInput.value = '';
  previewWrap.style.display = 'none';
  dropZone.style.display    = 'block';
  previewImg.src = '';
}

// ============================================================
//  UPLOAD
// ============================================================
uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!selectedFile) { showUploadMsg('Please select an image file.', 'error'); return; }

  const title    = document.getElementById('imgTitle').value.trim();
  const category = document.getElementById('imgCat').value;
  const desc     = document.getElementById('imgDesc').value.trim();
  if (!title || !category) { showUploadMsg('Title and Category are required.', 'error'); return; }

  uploadBtn.disabled = true;
  uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading…';
  showUploadMsg('', '');
  progressWrap.style.display = 'flex';

  const ext       = selectedFile.name.split('.').pop();
  const fileName  = `gallery/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storageRef= ref(storage, fileName);
  const task      = uploadBytesResumable(storageRef, selectedFile);

  task.on('state_changed',
    snap => {
      const pct = Math.round(snap.bytesTransferred / snap.totalBytes * 100);
      progressFill.style.width = pct + '%';
      progressLabel.textContent = pct + '%';
    },
    err => {
      showUploadMsg('Upload failed: ' + err.message, 'error');
      resetUploadBtn();
    },
    async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      await addDoc(collection(db, 'gallery'), {
        url, title, category, desc,
        storagePath: fileName,
        createdAt: serverTimestamp(),
      });
      showUploadMsg('Image uploaded successfully! ✓', 'success');
      uploadForm.reset();
      clearImage();
      progressWrap.style.display = 'none';
      progressFill.style.width = '0%';
      loadGallery();
      resetUploadBtn();
    }
  );
});

function resetUploadBtn() {
  uploadBtn.disabled = false;
  uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Image';
}
function showUploadMsg(msg, type) {
  uploadMsg.textContent = msg;
  uploadMsg.className   = 'upload-msg ' + type;
}

// ============================================================
//  LOAD GALLERY
// ============================================================
async function loadGallery() {
  adminGallery.innerHTML = '<div class="adm-loading"><div class="spinner"></div><p>Loading…</p></div>';
  try {
    const q    = query(collection(db,'gallery'), orderBy('createdAt','desc'));
    const snap = await getDocs(q);
    allImages  = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderAdminGallery();
    updateCount();
  } catch(e) {
    adminGallery.innerHTML = '<p style="padding:40px;text-align:center;color:#DC2626">Failed to load gallery.</p>';
  }
}

function renderAdminGallery() {
  const items = currentFilter === 'all' ? allImages : allImages.filter(i => i.category === currentFilter);
  if (!items.length) {
    adminGallery.innerHTML = '<p style="padding:40px;text-align:center;color:var(--muted)">No images in this category.</p>';
    return;
  }
  adminGallery.innerHTML = items.map(img => `
    <div class="adm-img-card">
      <img src="${img.url}?v=2" alt="${img.title}" loading="lazy">
      <div class="adm-img-info">
        <strong>${img.title}</strong>
        <span>${img.category}</span>
        <div class="adm-img-actions">
          <button class="del-btn" data-id="${img.id}" data-path="${img.storagePath || ''}">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
    </div>`).join('');

  adminGallery.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTarget = { id: btn.dataset.id, storagePath: btn.dataset.path };
      deleteModal.style.display = 'flex';
    });
  });
}

function updateCount() {
  galleryCount.textContent = allImages.length + ' image' + (allImages.length!==1?'s':'');
}

// ---- Filters ----
document.querySelectorAll('.adm-filters .fil').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.adm-filters .fil').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.cat;
    renderAdminGallery();
  });
});

// ============================================================
//  DELETE
// ============================================================
cancelDelete.addEventListener('click', () => { deleteModal.style.display = 'none'; deleteTarget = null; });
confirmDelete.addEventListener('click', async () => {
  if (!deleteTarget) return;
  confirmDelete.disabled = true;
  confirmDelete.textContent = 'Deleting…';
  try {
    await deleteDoc(doc(db, 'gallery', deleteTarget.id));
    if (deleteTarget.storagePath) {
      try { await deleteObject(ref(storage, deleteTarget.storagePath)); } catch(_) {}
    }
    deleteModal.style.display = 'none';
    deleteTarget = null;
    await loadGallery();
  } catch(e) {
    alert('Delete failed: ' + e.message);
  } finally {
    confirmDelete.disabled = false;
    confirmDelete.textContent = 'Delete';
  }
});
