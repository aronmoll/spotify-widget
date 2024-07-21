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
    const darkModeToggle = document.querySelector("[dark-mode-toggle]");
    const darkModeStatusElement = document.querySelector("[dark-mode-status]");

    if (dark) {
      localStorage.setItem("dark-mode", alternate ? "alternate-dark" : "true");
      document.body.classList.add(alternate ? "body-alternate-dark" : "body-dark");
      setColors(darkColors, animate);
      togglePressed = "true";
      darkModeToggle.setAttribute("dark-mode", "enable");
      darkModeStatusElement.setAttribute("dark-mode-status", "on");
      darkModeStatusElement.textContent = "On";
    } else {
      localStorage.setItem("dark-mode", alternate ? "alternate-light" : "false");
      document.body.classList.remove(alternate ? "body-alternate-dark" : "body-dark");
      setColors(lightColors, animate);
      togglePressed = "false";
      darkModeToggle.setAttribute("dark-mode", "disable");
      darkModeStatusElement.setAttribute("dark-mode-status", "off");
      darkModeStatusElement.textContent = "Off";
    }
    if (typeof toggleEl !== "undefined") {
      toggleEl.forEach(function (element) {
        element.setAttribute("aria-pressed", togglePressed);
      });
    }
  }

  let storagePreference = localStorage.getItem("dark-mode");
  if (storagePreference !== null) {
    if (alternate) {
      storagePreference === "alternate-dark" ? goDark(true, false) : goDark(false, false);
    } else {
      storagePreference === "true" ? goDark(true, false) : goDark(false, false);
    }
  }

  window.addEventListener("DOMContentLoaded", (event) => {
    toggleEl = document.querySelectorAll("[dark-mode-toggle]");
    toggleEl.forEach(function (element) {
      element.setAttribute("aria-label", "View Dark Mode");
      element.setAttribute("role", "button");
      element.setAttribute("aria-pressed", togglePressed);
    });
    toggleEl.forEach(function (element) {
      element.addEventListener("click", function () {
        let darkClass = document.body.classList.contains(alternate ? "body-alternate-dark" : "body-dark");
        darkClass ? goDark(false, true) : goDark(true, true);
      });
    });
  });
}

colorModeToggle();