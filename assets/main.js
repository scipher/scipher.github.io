//import './style.css'
import './style.less';

(function () {
  document
    .querySelectorAll('.platform-carousel')
    .forEach(initCarousel);

  function initCarousel(cmp) {
    const track = cmp.querySelector('.platform-carousel__track');
    const slides = Array.from(cmp.querySelectorAll('.platform-carousel__slide'));
    const prevBtn = cmp.querySelector('.platform-carousel__nav--prev');
    const nextBtn = cmp.querySelector('.platform-carousel__nav--next');
    const tabsContainer = cmp.querySelector('.platform-carousel__tabs');

    if (!track || slides.length === 0) return;

    let index = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    /* ----------------------------------
       Generate Tabs Dynamically
    ---------------------------------- */
    function createTabs() {
      tabsContainer.innerHTML = ''; // Clear existing tabs
      
      slides.forEach((slide, i) => {
        const title = slide.querySelector('.platform-carousel__slide-title').textContent;
        const tab = document.createElement('button');
        tab.className = i === 0 
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
      const tabs = cmp.querySelectorAll('.platform-carousel__tab');
      tabs.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('platform-carousel__tab--active');
        } else {
          tab.classList.remove('platform-carousel__tab--active');
        }
      });
      
    };

    // NEW: Button state management
    const updateButtons = () => {
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
      
      // Visual feedback
      prevBtn.style.opacity = index === 0 ? '0.4' : '1';
      nextBtn.style.opacity = index === slides.length - 1 ? '0.4' : '1';
      prevBtn.style.cursor = index === 0 ? 'not-allowed' : 'pointer';
      nextBtn.style.cursor = index === slides.length - 1 ? 'not-allowed' : 'pointer';
    };

    const update = (animate = true) => {
      track.style.transition = animate ? 'transform 0.35s ease' : 'none';
      track.style.transform = `translate3d(${-index * slideWidth()}px, 0, 0)`;
      updateTabs();
      updateButtons();      



      

      const container = document.querySelector('.platform-carousel__tabs');
const activeTab = document.querySelector('.platform-carousel__tab--active');

if (container && activeTab) {
    const scrollPos = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
    container.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
    });
}






    };

    /* ----------------------------------
       Navigation: Buttons + Tabs + Drag
    ---------------------------------- */
    // Next button (with disabled check)
    nextBtn?.addEventListener('click', () => {
      if (nextBtn.disabled) return;
      index++;
      clampIndex();
      update();
    });

    // Prev button (with disabled check)
    prevBtn?.addEventListener('click', () => {
      if (prevBtn.disabled) return;
      index--;
      clampIndex();
      update();
    });

    // Tab clicks
    tabsContainer.addEventListener('click', (e) => {
      if (e.target.matches('.platform-carousel__tab')) {
        index = parseInt(e.target.dataset.slide);
        clampIndex();
        update();
      }
    });

    /* ----------------------------------
       Pointer Events (Drag/Swipe)
    ---------------------------------- */
    track.addEventListener('pointerdown', e => {
      isDragging = true;
      startX = e.clientX;
      currentX = 0;
      track.style.transition = 'none';
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointermove', e => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      track.style.transform = `translate3d(${currentX - index * slideWidth()}px, 0, 0)`;
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.35s ease';

      if (Math.abs(currentX) > slideWidth() / 3) {
        index += currentX < 0 ? 1 : -1;
      }

      clampIndex();
      currentX = 0;
      update();
    };

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);

    /* ----------------------------------
       Resize Handler
    ---------------------------------- */
    window.addEventListener('resize', () => {
      update(false);
    });

    /* ----------------------------------
       Init
    ---------------------------------- */
    createTabs();
    update(false);
  }
})();
