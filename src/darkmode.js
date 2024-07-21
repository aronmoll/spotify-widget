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

  const isAboutPage = window.location.pathname === "/about";
  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("cubic-bezier(.49, .03, .13, .99)", scriptTag.getAttribute("ease"));

  const cssVariables = scriptTag.getAttribute("dark-mode-vars");

  if (!cssVariables.length) {
    console.warn("Value of dark-mode-vars attribute not found");
    return;
  }

  let lightColors = {};
  let darkColors = {};
  let alternateLightColors = {};
  let alternateDarkColors = {};

  cssVariables.split(",").forEach(function (item) {
    let lightValue = computed.getPropertyValue(`--color--${item}`);
    let darkValue = computed.getPropertyValue(`--dark--${item}`);
    let alternateLightValue = computed.getPropertyValue(`--alternate--${item}`);
    let alternateDarkValue = computed.getPropertyValue(`--alternate-dark--${item}`);
    
    if (lightValue.length) {
      lightColors[`--color--${item}`] = lightValue;
    }
    if (darkValue.length) {
      darkColors[`--color--${item}`] = darkValue;
    }
    if (alternateLightValue.length) {
      alternateLightColors[`--color--${item}`] = alternateLightValue;
    }
    if (alternateDarkValue.length) {
      alternateDarkColors[`--color--${item}`] = alternateDarkValue;
    }
  });

  if (!Object.keys(lightColors).length) {
    console.warn("No variables found matching dark-mode-vars attribute value");
    return;
  }

  function setColors(colorObject, animate) {
    console.log('Setting colors:', colorObject); // Debugging line
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
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
    let storagePreference = localStorage.getItem(isAboutPage ? "dark-mode-about" : "dark-mode");
    switch (storagePreference) {
      case "true":
        setColors(darkColors);
        htmlElement.classList.add("dark-mode");
        break;
      case "false":
        setColors(lightColors);
        htmlElement.classList.remove("dark-mode");
        break;
      case "alternate-dark":
        setColors(alternateDarkColors);
        htmlElement.classList.add("dark-mode");
        break;
      case "alternate-light":
        setColors(alternateLightColors);
        htmlElement.classList.remove("dark-mode");
        break;
      default:
        setColors(isAboutPage ? alternateLightColors : lightColors);
        htmlElement.classList.remove("dark-mode");
        break;
    }
  }

  function goDark(dark, alternate, animate) {
    if (dark) {
      localStorage.setItem(isAboutPage ? "dark-mode-about" : "dark-mode", alternate ? "alternate-dark" : "true");
      setColors(alternate ? alternateDarkColors : darkColors, animate);
      htmlElement.classList.add("dark-mode");
      togglePressed = "true";
    } else {
      localStorage.setItem(isAboutPage ? "dark-mode-about" : "dark-mode", alternate ? "alternate-light" : "false");
      setColors(alternate ? alternateLightColors : lightColors, animate);
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
    let storagePreference = localStorage.getItem(isAboutPage ? "dark-mode-about" : "dark-mode");
    if (storagePreference !== null) {
      console.log('Loaded dark mode state from storage:', storagePreference); // Debugging line
      switch (storagePreference) {
        case "true":
          goDark(true, false, false);
          break;
        case "false":
          goDark(false, false, false);
          break;
        case "alternate-dark":
          goDark(true, true, false);
          break;
        case "alternate-light":
          goDark(false, true, false);
          break;
      }
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
        darkClass ? goDark(false, isAboutPage, true) : goDark(true, isAboutPage, true);
      });
    });
  });
}

colorModeToggle();