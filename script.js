// Fade-in effect on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Back-to-top button
const backToTopBtn = document.createElement('button');
backToTopBtn.textContent = '⬆';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.display = 'none';
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});
document.body.appendChild(backToTopBtn);
window.addEventListener('scroll', () => {
  backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if(target) {
      target.scrollIntoView({behavior: 'smooth'});
    }
  });
});
