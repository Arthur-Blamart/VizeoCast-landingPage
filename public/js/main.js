/* VizeoCast — main.js */

// ── Nav scroll effect ──────────────────────────────────────────
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile burger menu ─────────────────────────────────────────
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ── Scroll reveal ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Contact form ───────────────────────────────────────────────
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function setError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (msg) {
    input.classList.add('error');
    error.textContent = msg;
  } else {
    input.classList.remove('error');
    error.textContent = '';
  }
  return !msg;
}

function validateForm(data) {
  let valid = true;
  if (!data.name.trim()) valid = setError('name', 'nameError', 'Votre nom est requis.') && valid;
  else setError('name', 'nameError', '');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!data.email.trim()) valid = setError('email', 'emailError', 'Votre email est requis.') && valid;
  else if (!emailOk) valid = setError('email', 'emailError', 'Adresse email invalide.') && valid;
  else setError('email', 'emailError', '');

  if (!data.message.trim()) valid = setError('message', 'messageError', 'Merci d\'écrire un message.') && valid;
  else setError('message', 'messageError', '');

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name:          form.name.value,
    email:         form.email.value,
    etablissement: form.etablissement.value,
    message:       form.message.value,
  };

  if (!validateForm(data)) return;

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  formSuccess.classList.remove('show');

  try {
    const res = await fetch('https://formspree.io/f/mrerwwbp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (res.ok) {
      formSuccess.textContent = '✓ Message envoyé ! Nous vous répondrons sous 24h.';
      formSuccess.style.color = '';
      formSuccess.style.background = '';
      formSuccess.classList.add('show');
      form.reset();
    } else {
      formSuccess.textContent = (json.errors && json.errors[0]?.message) || 'Une erreur est survenue.';
      formSuccess.style.color = '#ef4444';
      formSuccess.style.background = '#fef2f2';
      formSuccess.classList.add('show');
    }
  } catch {
    formSuccess.textContent = 'Impossible d\'envoyer le formulaire. Réessayez.';
    formSuccess.style.color = '#ef4444';
    formSuccess.style.background = '#fef2f2';
    formSuccess.classList.add('show');
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

// Clear error on input
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
  });
});

// ── Smooth anchor scroll with nav offset ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
