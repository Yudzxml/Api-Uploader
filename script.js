const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const responseBox = document.getElementById('responseBox');
const loadingSpinner = document.getElementById('loadingSpinner');
const copyBtn = document.getElementById('copyBtn');
const modeToggle = document.getElementById('modeToggle');
const footer = document.getElementById('footer');

// Inisialisasi dark mode dari localStorage
const isDark = localStorage.getItem('darkMode') === 'true';
document.body.classList.toggle('dark-mode', isDark);
modeToggle.textContent = isDark ? 'Mode Siang' : 'Mode Malam';

// Toggle dark mode
modeToggle?.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark-mode');
  modeToggle.textContent = dark ? 'Mode Siang' : 'Mode Malam';
  localStorage.setItem('darkMode', dark);
});

// Tambahkan isi footer secara dinamis
footer.innerHTML = `&copy; ${new Date().getFullYear()} Uploader To GitHub By Yudzxml. All rights reserved.`;

// Event saat form disubmit
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) return alert('Pilih file terlebih dahulu!');
  if (file.size > MAX_FILE_SIZE) return alert('Ukuran maksimal 100MB');

  loadingSpinner.style.display = 'block';
  responseBox.textContent = 'Uploading...';
  copyBtn.style.display = 'none';

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const res = await axios.post('https://api-upload-cyan.vercel.app/api/upload', uint8Array, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-filename': file.name
      }
    });

    const url = res.data?.data?.url;
    responseBox.textContent = JSON.stringify(res.data, null, 2);
    showCopyButton(url);

  } catch (err) {
    console.error('Upload error:', err);
    responseBox.textContent = `Error: ${err.message}`;
    alert('Upload gagal: ' + err.message);
  } finally {
    loadingSpinner.style.display = 'none';
  }
});

// Tampilkan tombol salin URL
function showCopyButton(url) {
  copyBtn.style.display = 'block';
  copyBtn.textContent = 'Copy URL';

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(url).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy URL';
        copyBtn.style.display = 'none';
      }, 2000);
    });
  };
}