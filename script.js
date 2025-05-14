document.addEventListener("DOMContentLoaded", () => {
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const responseBox = document.getElementById('responseBox');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const copyBtn = document.getElementById('copyBtn');
  const footer = document.getElementById('footer');

  footer.innerHTML = `&copy; 2025 Yudzxml Made With ♥️`;

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

      const url = response.data.data.url;
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
});