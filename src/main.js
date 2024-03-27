
const gsap = require('gsap');

// Flag to keep track of the items' visibility
let areItemsVisible = false;

document.querySelector('.nav-mobile-button').addEventListener('click', function() {
  const items = document.querySelectorAll('.mobile-nav_items > *');

  // Determine the target opacity based on current visibility
  const targetOpacity = areItemsVisible ? 0 : 1;

  // Define the delay based on the items' current visibility
  // Delay should only apply when items are not visible yet (going from 0 opacity to 1)
  const animationDelay = areItemsVisible ? 0 : 0.18;

  // Use GSAP to animate these items with a delay
  gsap.to(items, {
    opacity: targetOpacity, // Toggle opacity based on the flag
    duration: 0.30, // Duration of 0.30 seconds
    ease: "cubic-bezier(.49,.03,.13,.99)", // Custom cubic-bezier easing
    stagger: {
      amount: 0.2, // Total animation time for the stagger effect
      from: "start", // Start staggering from the first element
    },
    delay: animationDelay, // Apply conditional delay based on visibility
  });

  // Toggle the visibility flag
  areItemsVisible = !areItemsVisible;
});
