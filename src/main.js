// Flag to keep track of the items' visibility
let areItemsVisible = false;

document.querySelector('.nav-mobile-button').addEventListener('click', function() {
  const items = document.querySelectorAll('.mobile-nav_items > *');
  const widgets = document.querySelectorAll('.widget-wrap > *'); // Select all children of .widget-wrap

  // Determine the target opacity based on current visibility
  const targetOpacity = areItemsVisible ? 0 : 1;

  // Define the delay based on the items' current visibility
  // Delay should only apply when items are not visible yet (going from 0 opacity to 1)
  const animationDelay = areItemsVisible ? 0 : 0.18;

  // Determine the duration based on the items' current visibility
  // Duration should be 0.20 seconds when items are visible (going from 1 opacity to 0)
  const animationDuration = areItemsVisible ? 0.20 : 0.30;

  // Use GSAP to animate these items with a delay and dynamic duration
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

  // Adjust the widgetAnimationDelay to start 0.01 seconds earlier when becoming visible
  const widgetAnimationDelay = areItemsVisible ? 0 : (animationDelay + animationDuration - 0.13);
  const widgetAnimationDuration = areItemsVisible ? 0.20 : 0.40; // Adjusted duration for consistency with your initial request

  gsap.to(widgets, {
    opacity: targetOpacity,
    duration: widgetAnimationDuration,
    ease: "cubic-bezier(.49,.03,.13,.99)",
    delay: widgetAnimationDelay, // Adjusted start time
    stagger: 0.05, // Stagger effect for the widgets
  });

  // Toggle the visibility flag
  areItemsVisible = !areItemsVisible;
});

gsap.to('.scroll-indicator_target', {
  rotation: 180, // Rotate the target to 180 degrees
  scrollTrigger: {
      trigger: document.documentElement, // This uses the entire document as the trigger
      start: "top top", // Start the animation at the top of the document
      end: "bottom bottom", // End the animation at the bottom
      scrub: true // Smooth scrubbing, linking the animation progress to the scroll position
  }
});