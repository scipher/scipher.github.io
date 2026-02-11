(function () {
  document.querySelectorAll('.platform-carousel').forEach(initCarousel);

  function initCarousel(cmp) {
    const track = cmp.querySelector('.platform-carousel__track');
    const slides = Array.from(cmp.querySelectorAll('.platform-carousel__slide'));
    const prevBtn = cmp.querySelector('.platform-carousel__nav--prev');
    const nextBtn = cmp.querySelector('.platform-carousel__nav--next');
    const tabsContainer = cmp.querySelector('.platform-carousel__tabs');


    if (!track || !slides.length) return;

    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    /* ----------------------------------
       Tabs
    ---------------------------------- */
    function createTabs() {
      if (!tabsContainer) return;
      tabsContainer.innerHTML = '';
      slides.forEach((slide, i) => {
        const title = slide.querySelector('.platform-carousel__slide-title')?.textContent || `Slide ${i + 1}`;
        const tab = document.createElement('button');
        tab.className =
          i === 0
            ? 'platform-carousel__tab platform-carousel__tab--active'
            : 'platform-carousel__tab';
        tab.dataset.slide = i;
        tab.textContent = title;
        tabsContainer.appendChild(tab);
      });
    }

    /* ----------------------------------
       Helpers
    ---------------------------------- */
    const slideWidth = () => cmp.getBoundingClientRect().width;

    const clampIndex = () => {
      index = Math.max(0, Math.min(index, slides.length - 1));
    };

    const updateTabs = () => {
      if (!tabsContainer) return;
      const tabs = tabsContainer.querySelectorAll('.platform-carousel__tab');
      tabs.forEach((tab, i) =>
        tab.classList.toggle('platform-carousel__tab--active', i === index)
      );

      // Center active tab
      const activeTab = tabsContainer.querySelector('.platform-carousel__tab--active');
      if (activeTab) {
        const scrollPos =
          activeTab.offsetLeft -
          tabsContainer.clientWidth / 2 +
          activeTab.clientWidth / 2;

        tabsContainer.scrollTo({
          left: scrollPos,
          behavior: 'smooth',
        });
      }
    };

    const updateButtons = () => {
      if (!prevBtn || !nextBtn) return;

      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;

      prevBtn.style.opacity = prevBtn.disabled ? '0.4' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.4' : '1';
      prevBtn.style.cursor = prevBtn.disabled ? 'not-allowed' : 'pointer';
      nextBtn.style.cursor = nextBtn.disabled ? 'not-allowed' : 'pointer';
    };

    const update = (animate = true) => {
      track.style.transition = animate ? 'transform 0.35s ease-out' : 'none';
      const moveX = Math.round(-index * slideWidth());
      track.style.transform = `translate3d(${moveX}px, 0, 0)`;

      updateTabs();
      updateButtons();
    };

    /* ----------------------------------
       iOS TOUCH FIX (CRITICAL)
    ---------------------------------- */
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalSwipe = false;

    cmp.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isHorizontalSwipe = false;
      },
      { passive: true }
    );

    cmp.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging || e.touches.length !== 1) return;

        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);

        // Lock only if horizontal gesture
        if (!isHorizontalSwipe) {
          isHorizontalSwipe = dx > dy;
        }

        if (isHorizontalSwipe) {
          e.preventDefault(); // block page scroll ONLY for horizontal swipe
        }
      },
      { passive: false }
    );

    /* ----------------------------------
       Pointer Events (Swipe)
    ---------------------------------- */
    let hasMoved = false;

    track.addEventListener('pointerdown', (e) => {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      currentX = 0;
      track.style.transition = 'none';
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      currentX = e.clientX - startX;

      if (Math.abs(currentX) > 5) {
        hasMoved = true;        //  ADD (detect swipe)
      }

      // Edge resistance (iOS-friendly)
      if (
        (index === 0 && currentX > 0) ||
        (index === slides.length - 1 && currentX < 0)
      ) {
        currentX /= 3;
      }

      const moveX = currentX - index * slideWidth();
      track.style.transform = `translate3d(${Math.round(moveX)}px, 0, 0)`;
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;

      if (e?.pointerId !== undefined) {
        track.releasePointerCapture(e.pointerId);
      }

      const threshold = slideWidth() / 4;
      if (Math.abs(currentX) > threshold) {
        if (currentX < 0 && index < slides.length - 1) index++;
        else if (currentX > 0 && index > 0) index--;
      }

      currentX = 0;
      clampIndex();
      update();
    };

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);

    /* ----------------------------------
       Navigation
    ---------------------------------- */
    nextBtn?.addEventListener('click', () => {
      if (index < slides.length - 1) {
        index++;
        update();
      }
    });

    prevBtn?.addEventListener('click', () => {
      if (index > 0) {
        index--;
        update();
      }
    });

    tabsContainer?.addEventListener('click', (e) => {
      if (e.target.matches('.platform-carousel__tab')) {
        index = parseInt(e.target.dataset.slide, 10);
        clampIndex();
        update();
      }
    });

    /* ----------------------------------
       Keyboard navigation (NEW)
    ---------------------------------- */
    // Add this block inside your `initCarousel` function
    cmp.addEventListener('keydown', (e) => {
      // Only respond if the carousel or its inside element is focused
      if (!cmp.contains(document.activeElement)) {
        return;
      }

      // Use e.key for modern browsers (ArrowLeft, ArrowRight)
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (index > 0) {
          index--;
          update();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (index < slides.length - 1) {
          index++;
          update();
        }
      }
    });

    // Optional: make the carousel focusable so keyboard can enter it
    if (!cmp.hasAttribute('tabindex')) {
      cmp.setAttribute('tabindex', '0');
    }

    /* ----------------------------------
       Resize
    ---------------------------------- */
    window.addEventListener('resize', () => update(false));

    /* ----------------------------------
       Init
    ---------------------------------- */
    createTabs();
    update(false);
  }
})();
