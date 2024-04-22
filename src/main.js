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
  gsap.registerPlugin(ScrollTrigger);
  const scrollIndicatorTarget = document.querySelector(".scroll-indicator_target");
  gsap.to(scrollIndicatorTarget, {
      rotation: 180,
      scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true
      }
  });
  gsap.to('.intro-text_wrap', {
      scrollTrigger: {
          trigger: '.section_projects',
          start: 'top 90%',
          end: 'top 60%',
          scrub: true
      },
      opacity: 0,
      filter: 'blur(5px)',
      duration: 0.5
  });

  // For elements with the [data-parallax="true"] attribute
  document.querySelectorAll('[data-parallax="true"]').forEach(item => {
    // Initialize the position of each image
    gsap.set(item, { yPercent: -10 });

    gsap.to(item, {
      yPercent: 10,
      ease: 'none', // Adjust the easing as needed
      scrollTrigger: {
        trigger: item.closest('[data-parallax="true"]'), // Use the closest parent with [data-parallax="true"] as the trigger
        start: 'top bottom', // Animation starts when the top of the trigger hits the bottom of the viewport
        end: 'bottom top', // Adjust the end point as needed
        scrub: true // Enables smooth animation progression with scroll
      }
    });
  });
});
