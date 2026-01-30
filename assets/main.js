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
    cmp.addEventListener(
      'touchmove',
      (e) => {
        if (isDragging) e.preventDefault();
      },
      { passive: false }
    );

    /* ----------------------------------
       Pointer Events (Swipe)
    ---------------------------------- */
    track.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      currentX = 0;
      track.style.transition = 'none';
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      currentX = e.clientX - startX;

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
