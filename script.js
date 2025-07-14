// Sticky nav active section highlight
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = Array.from(document.querySelectorAll('main section')).filter(s => s.id);

function onScroll() {
  const scrollPos = window.scrollY + 120;
  let activeId = '';
  for (const section of sections) {
    if (section.offsetTop <= scrollPos) {
      activeId = section.id;
    }
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href').slice(1) === activeId);
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Subtle button animation on click
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'scale(0.97)';
  });
  btn.addEventListener('mouseup', () => {
    btn.style.transform = '';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// Animate-in on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-in');
  const windowHeight = window.innerHeight;
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 60) {
      if (el.dataset.animate === 'slide-up') {
        el.classList.add('slide-up');
      } else {
        el.classList.add('fade-in');
      }
    }
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('resize', animateOnScroll);
document.addEventListener('DOMContentLoaded', animateOnScroll);

// FAQ expand/collapse with arrow animation
const faqCards = document.querySelectorAll('.faq-card');
faqCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('open');
    card.setAttribute('aria-expanded', card.classList.contains('open'));
    const arrow = card.querySelector('.faq-arrow');
    if (arrow) {
      arrow.style.transform = card.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
      arrow.style.transition = 'transform 0.3s';
    }
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      card.click();
    }
  });
});

// Contact form success
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for contacting Dun Na Media! We will get back to you soon.');
    contactForm.reset();
  });
}
// Newsletter form success
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for subscribing!');
    newsletterForm.reset();
  });
}
// Sticky nav shadow on scroll
const header = document.querySelector('.main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 4px 24px rgba(45,225,163,0.10)';
  } else {
    header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
  }
});

// Optimize images for loading
const imgs = document.querySelectorAll('img');
imgs.forEach(img => {
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }
}); 