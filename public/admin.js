const siteForm = document.getElementById('siteForm');
const loginBox = document.getElementById('loginBox');
const editorBox = document.getElementById('editorBox');
const loginStatus = document.getElementById('loginStatus');
const saveStatus = document.getElementById('saveStatus');

async function loadSite() {
  const response = await fetch('/api/site');
  const site = await response.json();

  const fields = siteForm.elements;
  for (const field of fields) {
    if (!field.name) continue;
    if (field.name.includes('contact.')) {
      const key = field.name.split('.')[1];
      field.value = site.contact?.[key] || '';
      continue;
    }
    field.value = site[field.name] ?? '';
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (response.ok) {
    loginBox.classList.remove('active');
    editorBox.classList.add('active');
    loginStatus.textContent = '';
    await loadSite();
  } else {
    loginStatus.textContent = data.message || 'Login failed';
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  editorBox.classList.remove('active');
  loginBox.classList.add('active');
}

siteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(siteForm);
  const payload = { ...Object.fromEntries(formData.entries()) };

  payload.contact = {
    email: payload['contact.email'],
    phone: payload['contact.phone'],
    location: payload['contact.location'],
    socials: payload['contact.socials']
  };

  delete payload['contact.email'];
  delete payload['contact.phone'];
  delete payload['contact.location'];
  delete payload['contact.socials'];

  const response = await fetch('/api/site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  saveStatus.textContent = response.ok ? 'Saved successfully' : (result.message || 'Save failed');

  if (response.ok) {
    window.location.href = '/';
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/site');
  const site = await response.json();

  if (site && Object.keys(site).length > 0) {
    loginBox.classList.add('active');
    editorBox.classList.remove('active');
  }
});

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('logoutBtn').addEventListener('click', logout);
