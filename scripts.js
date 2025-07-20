// Optional: smooth scroll for anchor links
document.querySelectorAll('nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
