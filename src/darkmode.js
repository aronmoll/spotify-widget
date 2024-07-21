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
  let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));

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
      lightColors[`--${alternate ? "alternate--" : "color--"}${item}`] = lightValue;
      darkColors[`--${alternate ? "alternate-dark--" : "dark--"}${item}`] = darkValue;
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

  function goDark(dark, animate) {
    if (dark) {
      localStorage.setItem("dark-mode", alternate ? "alternate-dark" : "true");
      setColors(darkColors, animate);
      togglePressed = "true";
    } else {
      localStorage.setItem("dark-mode", alternate ? "alternate-light" : "false");
      setColors(lightColors, animate);
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
      if (alternate) {
        storagePreference === "alternate-dark" ? goDark(true, false) : goDark(false, false);
      } else {
        storagePreference === "true" ? goDark(true, false) : goDark(false, false);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", (event) => {
    toggleEl = document.querySelectorAll("[dark-mode-toggle]");
    toggleEl.forEach(function (element) {
      element.setAttribute("aria-label", "View Dark Mode");
      element.setAttribute("role", "button");
      element.setAttribute("aria-pressed", togglePressed);
    });
    toggleEl.forEach(function (element) {
      element.addEventListener("click", function () {
        let darkClass = localStorage.getItem("dark-mode") === (alternate ? "alternate-dark" : "true");
        darkClass ? goDark(false, true) : goDark(true, true);
      });
    });
    loadDarkModeState();
  });
}

colorModeToggle();