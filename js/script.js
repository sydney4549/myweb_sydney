/* Interactive features for SIAMPAKU SYDNEY's portfolio (ICT251 Activity 3):
   1. Contact form validation and preview (compulsory)
   2. Photo gallery viewer
   3. Project search and filter, with expandable details
   4. Light and dark theme switch                                        */

// ---------- 1. Contact form validation and preview ----------
const form = document.getElementById('contact-form');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Show or clear the error message under one field.
function setError(id, message) {
  const field = document.getElementById(id);
  document.getElementById(id + '-error').textContent = message;
  field.closest('.form-row').classList.toggle('invalid', message !== '');
  field.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
}

// Check name, email and message. Returns true only when all are valid.
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let ok = true;

  if (name === '') { setError('name', 'Enter your name. Spaces alone are not accepted.'); ok = false; }
  else { setError('name', ''); }

  if (email === '') { setError('email', 'Enter your email address.'); ok = false; }
  else if (!emailPattern.test(email)) { setError('email', 'Use a valid format, such as name@example.com.'); ok = false; }
  else { setError('email', ''); }

  if (message === '') { setError('message', 'Write a message. Spaces alone are not accepted.'); ok = false; }
  else { setError('message', ''); }

  return ok;
}

form.addEventListener('submit', function (event) {
  event.preventDefault(); // keep everything in the browser, nothing is sent
  const preview = document.getElementById('preview');

  if (!validateForm()) {
    preview.hidden = true;
    form.querySelector('.invalid input, .invalid textarea').focus();
    return;
  }

  // textContent makes sure typed text is shown as plain text, never as HTML
  const topic = document.getElementById('topic');
  document.getElementById('out-name').textContent = document.getElementById('name').value.trim();
  document.getElementById('out-email').textContent = document.getElementById('email').value.trim();
  document.getElementById('out-topic').textContent = topic.options[topic.selectedIndex].text;
  document.getElementById('out-message').textContent = document.getElementById('message').value.trim();
  preview.hidden = false;
});

// ---------- 2. Photo gallery viewer ----------
const photos = [
  { src: 'images/photo1.jpg',
    alt: 'Students studying together at a table in the computer lab',
    caption: 'Photo 1: Studying with classmates in the computer lab.' },
  { src: 'images/photo2.jpg',
    alt: 'A football being kicked on a green pitch at sunset',
    caption: 'Photo 2: Playing football, one of my favourite hobbies.' },
  { src: 'images/photo3.jpg',
    alt: 'A laptop on a desk showing lines of HTML code',
    caption: 'Photo 3: My desk where I practise coding every day.' }
];
let current = 0;
const galleryImg = document.getElementById('gallery-img');
const prevBtn = document.getElementById('gallery-prev');
const nextBtn = document.getElementById('gallery-next');

// Show the photo at the current position and disable buttons at the first and last photo.
function showPhoto() {
  const photo = photos[current];
  galleryImg.src = photo.src;
  galleryImg.alt = photo.alt;
  document.getElementById('gallery-caption').textContent = photo.caption;
  document.getElementById('gallery-count').textContent = 'Photo ' + (current + 1) + ' of ' + photos.length;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === photos.length - 1;
}

prevBtn.addEventListener('click', function () { if (current > 0) { current--; showPhoto(); } });
nextBtn.addEventListener('click', function () { if (current < photos.length - 1) { current++; showPhoto(); } });
showPhoto();

// ---------- 3. Project search / filter and expandable details ----------
const cards = Array.from(document.querySelectorAll('#project-grid .project-card'));
const searchBox = document.getElementById('project-search');
const statusEl = document.getElementById('project-status');

// Show only the cards that contain every word typed in the search box.
function filterProjects() {
  const words = searchBox.value.toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;
  cards.forEach(function (card) {
    const text = (card.textContent + ' ' + card.dataset.tags).toLowerCase();
    const match = words.every(function (word) { return text.includes(word); });
    card.hidden = !match;
    if (match) { shown++; }
  });
  statusEl.textContent = shown === 0
    ? 'No projects match "' + searchBox.value.trim() + '". Try another word or press Reset.'
    : 'Showing ' + shown + ' of ' + cards.length + ' projects.';
}

searchBox.addEventListener('input', filterProjects);
document.getElementById('project-reset').addEventListener('click', function () {
  searchBox.value = '';
  filterProjects();
  searchBox.focus();
});
filterProjects();

// Open or close one card's details and update the button text and state.
document.querySelectorAll('.expand-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    const detail = document.getElementById(button.getAttribute('aria-controls'));
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    button.textContent = isOpen ? 'Show details' : 'Hide details';
    detail.hidden = isOpen;
  });
});

// ---------- 4. Light and dark theme switch ----------
const themeBtn = document.getElementById('theme-toggle');

// Apply a theme and update the button label and pressed state.
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* storage not available */ }
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeBtn.addEventListener('click', function () {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});
