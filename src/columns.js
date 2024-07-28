function gridViewToggle() {
    const htmlElement = document.documentElement;
    let toggleEl;
    let togglePressed = "false";
  
    const gridViewDuration = 0.5;
    const gridViewEase = "cubic-bezier(.49, .03, .13, .99)";
    const expirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds
  
    function toggleView(grid, animate) {
      const elements = document.querySelectorAll(".grid-12_col.pointer-events-none > *");
      const currentTime = new Date().getTime();
  
      if (grid) {
        localStorage.setItem("grid-view", "true");
        localStorage.setItem("grid-view-timestamp", currentTime.toString());
        if (animate) {
          gsap.to(elements, {
            opacity: 1,
            duration: gridViewDuration,
            ease: gridViewEase,
            stagger: 0.05
          });
        } else {
          elements.forEach(el => el.style.opacity = 1);
        }
        htmlElement.classList.add("grid-view");
        togglePressed = "true";
      } else {
        localStorage.setItem("grid-view", "false");
        if (animate) {
          gsap.to(elements, {
            opacity: 0,
            duration: gridViewDuration,
            ease: gridViewEase,
            stagger: 0.05
          });
        } else {
          elements.forEach(el => el.style.opacity = 0);
        }
        htmlElement.classList.remove("grid-view");
        togglePressed = "false";
      }
      updateStatusElements(grid);
    }
  
    function updateStatusElements(grid) {
      const gridViewStatusElement = document.querySelector('[grid-view-status]');
      if (gridViewStatusElement) {
        gridViewStatusElement.setAttribute('grid-view-status', grid ? 'on' : 'off');
        gridViewStatusElement.textContent = grid ? 'On' : 'Off';
      }
      if (toggleEl) {
        toggleEl.forEach(function (element) {
          element.setAttribute('grid-view', grid ? 'enable' : 'disable');
        });
      }
    }
  
    function loadGridViewState() {
      const currentTime = new Date().getTime();
      let storagePreference = localStorage.getItem("grid-view");
      let storageTimestamp = localStorage.getItem("grid-view-timestamp");
  
      if (storagePreference !== null && storageTimestamp !== null) {
        const timeElapsed = currentTime - parseInt(storageTimestamp, 10);
        if (timeElapsed < expirationTime) {
          console.log('Loaded grid view state from storage:', storagePreference); // Debugging line
          storagePreference === "true" ? toggleView(true, false) : toggleView(false, false);
        } else {
          localStorage.removeItem("grid-view");
          localStorage.removeItem("grid-view-timestamp");
          toggleView(false, false);
        }
      }
    }
  
    // Apply grid view state immediately to avoid flickering
    loadGridViewState();
  
    document.addEventListener("DOMContentLoaded", (event) => {
      toggleEl = document.querySelectorAll("[grid-view-toggle]");
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-label", "View Grid Mode");
        element.setAttribute("role", "button");
        element.setAttribute("aria-pressed", togglePressed);
      });
      toggleEl.forEach(function (element) {
        element.addEventListener("click", function () {
          let gridClass = htmlElement.classList.contains("grid-view");
          gridClass ? toggleView(false, true) : toggleView(true, true);
        });
      });
    });
  }
  
  gridViewToggle();
  