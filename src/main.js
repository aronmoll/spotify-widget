document.addEventListener('DOMContentLoaded', function() {
    // For the Menu
    let areItemsVisible = false;
    document.querySelector('.nav-mobile-button').addEventListener('click', function() {
        const items = document.querySelectorAll('.mobile-nav_items > *');
        const widgets = document.querySelectorAll('.widget-wrap > *');
        const targetOpacity = areItemsVisible ? 0 : 1;
        const animationDelay = areItemsVisible ? 0 : 0.18;
        const animationDuration = areItemsVisible ? 0.20 : 0.30;
        gsap.to(items, {
            opacity: targetOpacity,
            duration: animationDuration,
            ease: "cubic-bezier(.49,.03,.13,.99)",
            stagger: {
                amount: 0.2,
                from: areItemsVisible ? "end" : "start",
            },
            delay: animationDelay,
        });
        const widgetAnimationDelay = areItemsVisible ? 0 : (animationDelay + animationDuration - 0.13);
        const widgetAnimationDuration = areItemsVisible ? 0.20 : 0.40;
        gsap.to(widgets, {
            opacity: targetOpacity,
            duration: widgetAnimationDuration,
            ease: "cubic-bezier(.49,.03,.13,.99)",
            delay: widgetAnimationDelay,
            stagger: 0.05,
        });
        areItemsVisible = !areItemsVisible;
    });

    // For the Homepage
    function smoothScrollToSection() {
      // Get current rotation using GSAP's getProperty
      const currentRotation = gsap.getProperty(scrollIndicatorTarget, "rotation");
      
      let targetSectionId;
      
      // Determine the target section based on the rotation
      if (currentRotation > 90) {
          // If rotation is more than 90 degrees, target the #top section
          targetSectionId = "#top";
      } else {
          // Otherwise, target the #Main-content section
          targetSectionId = "#Main-content";
      }
      
      // Calculate the scroll target's offset top position
      const targetSection = document.querySelector(targetSectionId);
      if (targetSection) {
          const scrollTarget = targetSection.offsetTop;
  
          // Use GSAP to animate the scroll position with custom easing
          gsap.to(window, {
              scrollTo: {y: scrollTarget, autoKill: false},
              duration: 1.5, // Adjust the duration as needed
              ease: "cubic-bezier(.49,.03,.13,.99)"
          });
      }
  }
  
    // Add click event listener to the scroll indicator wrapper
    scrollIndicatorWrap.addEventListener('click', smoothScrollToSection);   
    gsap.to('.intro-text_wrap', {
        scrollTrigger: {
            trigger: '.Section_projects',
            start: 'top 90%',
            end: 'top 60%',
            scrub: true
        },
        opacity: 0,
        filter: 'blur(5px)',
        duration: 0.5
    });
});

