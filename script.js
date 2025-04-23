const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const responseBox = document.getElementById('responseBox');
const loadingSpinner = document.getElementById('loadingSpinner');
const copyBtn = document.getElementById('copyBtn');
const modeToggle = document.getElementById('modeToggle');
const footer = document.getElementById('footer'); // Menambahkan footer di sini

// Dark mode toggle
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Mengubah teks tombol mode
  if (isDarkMode) {
    modeToggle.textContent = "Mode Siang";
  } else {
    modeToggle.textContent = "Mode Malam";
  }

  localStorage.setItem('darkMode', isDarkMode);
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  modeToggle.textContent = "Mode Siang"; // Mengubah teks tombol saat mode gelap aktif
} else {
  modeToggle.textContent = "Mode Malam"; // Mengubah teks tombol saat mode terang aktif
}

// Menambahkan copyright di footer
footer.innerHTML = `&copy; ${new Date().getFullYear()} Uploader To Github By Yudzxml. All rights reserved.`;

form.addEventListener('submit', async (e) => {
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

    const response = await axios.post('https://api-upload-cyan.vercel.app/api/upload', uint8Array, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-filename': file.name
      }
    });

    const url = response.data.url;
    responseBox.textContent = JSON.stringify(response.data, null, 2);
    showCopyButton(url);

  } catch (error) {
    console.error('Upload error:', error);
    responseBox.textContent = `Error: ${error.message}`;
    alert('Upload gagal: ' + error.message);
  } finally {
    loadingSpinner.style.display = 'none';
  }
});

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
