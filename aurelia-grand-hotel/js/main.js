document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const msg = document.getElementById("formMsg");
      msg.style.display = "block";
      msg.style.color = "#2e7d32";
      msg.textContent = "Thank you! Your message has been received. Our team will get back to you within 24 hours.";
      contactForm.reset();
    });
  }

  ["bookingForm", "bookingFormPage"].forEach(function (id) {
    const bookingForm = document.getElementById(id);
    if (bookingForm) {
      bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Booking request submitted! Our reservations team will confirm availability shortly.");
        bookingForm.reset();
      });
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
