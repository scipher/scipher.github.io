
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('mobile-open');
    });
  }

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      faqItems.forEach(function (other) {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      workItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  const counters = document.querySelectorAll('.count');
  const animateCounter = function (el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const interval = setInterval(function () {
      count += step;
      if (count >= target) {
        el.textContent = target;
        clearInterval(interval);
      } else {
        el.textContent = count;
      }
    }, 20);
  };

  if (counters.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      const formMsg = document.querySelector('.form-msg');

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        formMsg.textContent = 'Please fill in all required fields.';
        formMsg.style.background = 'rgba(232,67,147,0.12)';
        formMsg.style.color = '#c0245f';
        formMsg.classList.add('show');
        return;
      }
      if (!emailPattern.test(email)) {
        formMsg.textContent = 'Please enter a valid email address.';
        formMsg.style.background = 'rgba(232,67,147,0.12)';
        formMsg.style.color = '#c0245f';
        formMsg.classList.add('show');
        return;
      }

      formMsg.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
      formMsg.style.background = 'rgba(0,206,201,0.12)';
      formMsg.style.color = '#00806e';
      formMsg.classList.add('show');
      contactForm.reset();
    });
  }

  const newsletterForm = document.querySelector('#newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value.trim()) {
        alert('Thanks for subscribing with: ' + input.value.trim());
        newsletterForm.reset();
      }
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
});
