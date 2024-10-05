import './styles.css';
import { openDB } from 'idb';

// Initialize IndexedDB
const initdb = async () => {
  const db = await openDB('jate', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('jate')) {
        db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
};

// Save content to IndexedDB
const saveContent = async (content) => {
  const db = await initdb();
  const tx = db.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  await store.put({ content });
  await tx.done;
};

// Get content from IndexedDB
const getContent = async () => {
  const db = await initdb();
  const tx = db.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const allEntries = await store.getAll();
  await tx.done;
  return allEntries[allEntries.length - 1]?.content || '';
};

// DOM Elements
const textEditor = document.getElementById('text-editor');
const installBtn = document.getElementById('install-btn');

// Load content on startup
window.addEventListener('load', async () => {
  const content = await getContent();
  textEditor.value = content;
});

// Save content when window loses focus
window.addEventListener('blur', () => {
  saveContent(textEditor.value);
});

// PWA Installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('Service worker registered.', reg))
      .catch((err) => console.log('Service worker registration failed:', err));
  });
}
