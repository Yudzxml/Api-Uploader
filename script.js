// Tambah nomor
document.getElementById('updateForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const key = document.getElementById('key').value.trim();
  const phones = document.getElementById('phones').value.trim();
  const status = document.getElementById('status');
  status.textContent = 'Memproses...';

  const body = {
    phones: phones.split(',').map(p => p.trim()).filter(p => p)
  };
  if (key) body.key = key;

  try {
    const res = await fetch('/api/update-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    status.textContent = text;
  } catch (err) {
    status.textContent = 'Terjadi kesalahan: ' + err.message;
  }
});

// Hapus nomor
document.getElementById('hapusForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const phones = document.getElementById('hapusPhones').value.trim();
  const status = document.getElementById('status');
  status.textContent = 'Memproses penghapusan...';

  try {
    const res = await fetch('/api/update-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'hapus',
        phones: phones.split(',').map(p => p.trim()).filter(p => p)
      })
    });

    const text = await res.text();
    status.textContent = text;
  } catch (err) {
    status.textContent = 'Terjadi kesalahan: ' + err.message;
  }
});