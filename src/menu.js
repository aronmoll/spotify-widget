
// Import GSAP and necessary plugins
gsap.registerPlugin(CustomEase, ScrollTrigger);

// Create and rename the custom ease
CustomEase.create("manvydasEase", "M0,0 C0.49,0.03 0.13,0.99 1,1");

document.addEventListener('DOMContentLoaded', function () {
    // Setup a variable to track the toggle state
    let menuOpen = false;

    // Select the menu trigger, menu wrappers, and individual menu items (children of .menu-items)
    const menuWrapper = document.querySelector('.menu-wrapper');
    const menuButton = document.querySelector('.menu-button');
    const menuButtonWrappers = document.querySelectorAll('.menu-button_wrapper');
    const menuItemChildren = document.querySelectorAll('.menu-items > *');

    // Check if the menuWrapper exists
    if (!menuWrapper) {
        console.error('Menu wrapper element not found!');
        return;
    }

    // Function to open the menu
    function openMenu() {
        menuOpen = true;
        gsap.to(menuButtonWrappers, {
            duration: 0.5,
            y: '-102%',
            ease: "manvydasEase"
        });
        gsap.to(menuItemChildren, {
            opacity: 1,
            duration: 0.2,
            stagger: 0.05,
            delay: 0.2,
            ease: "manvydasEase"
        });
    }

    // Function to close the menu
    function closeMenu() {
        menuOpen = false;
        gsap.to(menuButtonWrappers, {
            duration: 0.5,
            y: '0%',
            ease: "manvydasEase"
        });
        gsap.to(menuItemChildren, {
            opacity: 0,
            duration: 0.2,
            stagger: {
                amount: 0.05 * (menuItemChildren.length - 1),
                from: "end"
            },
            ease: "manvydasEase"
        });
    }

    // Toggle the menu state on click
    function toggleMenu() {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Add event listener to the menu button
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            toggleMenu();
            // Trigger any additional animations on .menu-button
            // Add your custom button animations here if needed
        });
    } else {
        console.error('Menu button element not found!');
    }

    // ScrollTrigger for opening and closing the menu
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: ".mvp-spacer",
        start: "bottom bottom", // When the bottom of `.mvp-spacer` hits the bottom of the viewport
        onEnter: function() {
            if (!menuOpen) {
                menuButton.click(); // Trigger the click on `.menu-button` to open the menu
            }
        },
        onLeaveBack: function() {
            if (menuOpen) {
                menuButton.click(); // Trigger the click on `.menu-button` to close the menu
            }
        }
    });
});


// Assuming GSAP and CustomEase plugins are properly included
gsap.registerPlugin(CustomEase);

// Create and register the custom easing
CustomEase.create("manvydasEase", "M0,0 C0.49,0.03 0.13,0.99 1,1");

// Add click event listener to the .menu-item.is-contact
document.querySelector('.menu-item.is-contact').addEventListener('click', function() {
    // Step 1: Animate all .menu-items to opacity 0
    gsap.to('.menu-items .menu-item', {
        opacity: 0,
        duration: 0.20,
        stagger: 0.07,
        ease: "manvydasEase",
        onComplete: () => {
            // Step 3: Show .menu-loader and hide after 1.5 seconds
            document.querySelector('.menu-loader').style.display = 'flex';
            gsap.to('.menu-loader', {
                duration: 1,
                onComplete: () => {
                    document.querySelector('.menu-loader').style.display = 'none';

                    // Step 4: Display .contact-wrapper and animate child items
                    document.querySelector('.contact-wrapper').style.display = 'flex';
                    gsap.to('.contact-wrapper .menu-item', {
                        opacity: 1,
                        duration: 0.2,
                        stagger: 0.05,
                        ease: "manvydasEase"
                    });
                }
            });
        }
    });

    // Step 2: Animate .single-widget_wrap to opacity 0
    gsap.to('.single-widget_wrap', {
        opacity: 0,
        duration: 0.6,
        ease: "manvydasEase"
    });
});


// Function to create the loading animation
function createLoader() {
    const target = document.querySelector('.loader-target');
    const characters = ['|', '/', '-', '\\'];
    let index = 0;

    // Function to update the text
    function updateText() {
        target.textContent = characters[index];
        index = (index + 1) % characters.length; // Loop back to the first character
    }

    // Use GSAP to create a timed loop
    gsap.timeline({repeat: -1, onRepeat: updateText})
        .to(target, {duration: 0.13, ease: "none"});
}

// Start the loader when the document is ready
window.onload = createLoader;


document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.querySelector('.form-close');
    var menuButton = document.querySelector('.menu-button');

    closeButton.addEventListener('click', function() {
        menuButton.click(); // Simulate a click on the menu button
    });
});


// Add click event listener to the .menu-button
document.querySelector('.menu-button').addEventListener('click', function() {
    // Set .contact-wrapper to display none
    document.querySelector('.contact-wrapper').style.display = 'none';
});


// Add click event listener to the .form-button.is-submit
document.querySelector('.form-button.is-submit').addEventListener('click', function() {
    // Hide .contact-wrapper
    document.querySelector('.contact-wrapper').style.display = 'none';

    // Display .menu-loader
    document.querySelector('.menu-loader').style.display = 'flex';

    // Use GSAP to handle the timing
    gsap.to('.menu-loader', {
        duration: 1.5, // duration to keep the loader displayed
        onComplete: () => {
            // Hide .menu-loader after the animation completes
            document.querySelector('.menu-loader').style.display = 'none';

            // Display .contact-wrapper again
            document.querySelector('.contact-wrapper').style.display = 'flex';
        }
    });
});


// Select the elements
const menuMain = document.querySelector('.menu-main');
const menuButton = document.querySelector('.menu-button');

// Add click event listener to .menu-main
menuMain.addEventListener('click', () => {
  // Programmatically trigger a click on .menu-button
  menuButton.click();
});




// Assuming GSAP and CustomEase plugins are properly included
gsap.registerPlugin(CustomEase);

// Create and register the custom easing
CustomEase.create("manvydasEase", "M0,0 C0.49,0.03 0.13,0.99 1,1");

// Add click event listener to the .menu-item.is-settings
document.querySelector('.menu-item.is-settings').addEventListener('click', function() {
    // Step 1: Animate all .menu-items to opacity 0
    gsap.to('.menu-items .menu-item', {
        opacity: 0,
        duration: 0.20,
        stagger: 0.07,
        ease: "manvydasEase",
        onComplete: () => {
            // Step 3: Show .menu-loader and hide after 1.5 seconds
            document.querySelector('.menu-loader').style.display = 'flex';
            gsap.to('.menu-loader', {
                duration: 1,
                onComplete: () => {
                    document.querySelector('.menu-loader').style.display = 'none';

                    // Step 4: Display .menu-items.is-settings and animate child items
                    document.querySelector('.menu-items.is-settings').style.display = 'flex';
                    gsap.to('.menu-items.is-settings > .menu-item', {
                        opacity: 1,
                        duration: 0.2,
                        stagger: 0.05,
                        ease: "manvydasEase"
                    });
                }
            });
        }
    });

    // Step 2: Animate .single-widget_wrap to opacity 0
    gsap.to('.single-widget_wrap', {
        opacity: 0,
        duration: 0.6,
        ease: "manvydasEase"
    });
});


// Assuming GSAP and CustomEase plugins are properly included
gsap.registerPlugin(CustomEase);

// Create and register the custom easing
CustomEase.create("manvydasEase", "M0,0 C0.49,0.03 0.13,0.99 1,1");

// Add click event listener to the .settings-return
document.querySelector('.settings-return').addEventListener('click', function() {
    // Immediately set .menu-items.is-settings to display none
    document.querySelector('.menu-items.is-settings').style.display = 'none';

    // Step 3: Show .menu-loader and hide after 1.5 seconds
    document.querySelector('.menu-loader').style.display = 'flex';
    gsap.to('.menu-loader', {
        duration: 1.5,
        onComplete: () => {
            document.querySelector('.menu-loader').style.display = 'none';

            // Step 5: Animate all .menu-items to opacity 100
            gsap.to('.menu-items .menu-item', {
                opacity: 1,
                duration: 0.20,
                stagger: 0.07,
                ease: "manvydasEase"
            });
        }
    });
});
