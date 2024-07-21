function colorModeToggle() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);
  let toggleEl;
  let togglePressed = "false";

  const scriptTag = document.querySelector("[dark-mode-vars]");
  if (!scriptTag) {
    console.warn("Script tag with dark-mode-vars attribute not found");
    return;
  }

  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("cubic-bezier(.49, .03, .13, .99)", scriptTag.getAttribute("ease"));

  const cssVariables = scriptTag.getAttribute("dark-mode-vars");
  const alternate = scriptTag.getAttribute("alternate") === "true";
  
  if (!cssVariables.length) {
    console.warn("Value of dark-mode-vars attribute not found");
    return;
  }

  let lightColors = {};
  let darkColors = {};
  cssVariables.split(",").forEach(function (item) {
    let lightValue = computed.getPropertyValue(`--${alternate ? "alternate--" : "color--"}${item}`);
    let darkValue = computed.getPropertyValue(`--${alternate ? "alternate-dark--" : "dark--"}${item}`);
    if (lightValue.length) {
      if (!darkValue.length) darkValue = lightValue;
      lightColors[`--color--${item}`] = lightValue;
      darkColors[`--color--${item}`] = darkValue;
    }
  });

  if (!Object.keys(lightColors).length) {
    console.warn("No variables found matching dark-mode-vars attribute value");
    return;
  }

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      const properties = {};
      Object.keys(colorObject).forEach(key => {
        properties[key] = colorObject[key];
      });
      gsap.to(htmlElement, {
        css: properties,
        duration: colorModeDuration,
        ease: colorModeEase
      });
    } else {
      Object.keys(colorObject).forEach(function (key) {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function initializeColors() {
    let storagePreference = localStorage.getItem("dark-mode");
    if (storagePreference === "true" || storagePreference === "alternate-dark") {
      setColors(darkColors, false);
      htmlElement.classList.add("dark-mode");
    } else {
      setColors(lightColors, false);
      htmlElement.classList.remove("dark-mode");
    }
  }

  function goDark(dark, animate) {
    if (dark) {
      localStorage.setItem("dark-mode", "true");
      setColors(darkColors, animate);
      htmlElement.classList.add("dark-mode");
      togglePressed = "true";
    } else {
      localStorage.setItem("dark-mode", "false");
      setColors(lightColors, animate);
      htmlElement.classList.remove("dark-mode");
      togglePressed = "false";
    }
    updateStatusElements(dark);
  }

  function updateStatusElements(dark) {
    const darkModeStatusElement = document.querySelector('[dark-mode-status]');
    if (darkModeStatusElement) {
      darkModeStatusElement.setAttribute('dark-mode-status', dark ? 'on' : 'off');
      darkModeStatusElement.textContent = dark ? 'On' : 'Off';
    }
    if (toggleEl) {
      toggleEl.forEach(function (element) {
        element.setAttribute('dark-mode', dark ? 'enable' : 'disable');
      });
    }
  }

  function loadDarkModeState() {
    let storagePreference = localStorage.getItem("dark-mode");
    if (storagePreference !== null) {
      console.log('Loaded dark mode state from storage:', storagePreference); // Debugging line
      storagePreference === "true" ? goDark(true, false) : goDark(false, false);
    } else {
      initializeColors();
    }
  }

  // Apply colors immediately to avoid flickering
  loadDarkModeState();

  document.addEventListener("DOMContentLoaded", (event) => {
    toggleEl = document.querySelectorAll("[dark-mode-toggle]");
    toggleEl.forEach(function (element) {
      element.setAttribute("aria-label", "View Dark Mode");
      element.setAttribute("role", "button");
      element.setAttribute("aria-pressed", togglePressed);
    });
    toggleEl.forEach(function (element) {
      element.addEventListener("click", function () {
        let darkClass = htmlElement.classList.contains("dark-mode");
        darkClass ? goDark(false, true) : goDark(true, true);
      });
    });
  });
}

colorModeToggle();