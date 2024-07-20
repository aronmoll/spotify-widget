// Import GSAP and necessary plugins
gsap.registerPlugin(CustomEase, ScrollTrigger);

// Create and rename the custom ease
CustomEase.create("manvydasEase", "M0,0 C0.49,0.03 0.13,0.99 1,1");

document.addEventListener('DOMContentLoaded', function () {
    // Setup a variable to track the toggle state
    let menuOpen = false;

    // Select elements
    const menuWrapper = document.querySelector('.menu-wrapper');
    const menuButton = document.querySelector('.menu-button');
    const menuButtonWrappers = document.querySelectorAll('.menu-button_wrapper');
    const menuItemChildren = document.querySelectorAll('.menu-items > *');
    const contactWrapper = document.querySelector('.contact-wrapper');
    const menuLoader = document.querySelector('.menu-loader');

    // Check if the necessary elements exist
    if (!menuWrapper || !menuButton) {
        console.error('Menu wrapper or menu button element not found!');
        return;
    }

    // Function to animate menu items
    function animateMenuItems(targets, options) {
        gsap.to(targets, {
            opacity: options.opacity,
            duration: options.duration || 0.2,
            stagger: options.stagger || 0.05,
            ease: "manvydasEase",
            delay: options.delay || 0
        });
    }

    // Function to toggle the menu
    function toggleMenu(open) {
        menuOpen = open;
        gsap.to(menuButtonWrappers, {
            duration: 0.5,
            y: open ? '-102%' : '0%',
            ease: "manvydasEase"
        });
        animateMenuItems(menuItemChildren, { 
            opacity: open ? 1 : 0, 
            delay: open ? 0.2 : 0, 
            stagger: { 
                amount: 0.05 * (menuItemChildren.length - 1), 
                from: open ? "start" : "end" 
            } 
        });
    }

    // Add event listener to the menu button
    menuButton.addEventListener('click', function() {
        toggleMenu(!menuOpen);
    });

    // Check if the current page is the home page
    if (window.location.pathname === '/') {
        // ScrollTrigger for opening and closing the menu
        ScrollTrigger.create({
            trigger: ".mvp-spacer",
            start: "bottom bottom", // When the bottom of `.mvp-spacer` hits the bottom of the viewport
            onEnter: () => !menuOpen && menuButton.click(), // Trigger the click on `.menu-button` to open the menu
            onLeaveBack: () => menuOpen && menuButton.click() // Trigger the click on `.menu-button` to close the menu
        });
    }

    // Function to handle contact or settings menu animation
    function handleSubMenu(menuClass) {
        animateMenuItems('.menu-items .menu-item', { opacity: 0, duration: 0.2, stagger: 0.07 });
        gsap.to('.single-widget_wrap', { opacity: 0, duration: 0.6, ease: "manvydasEase" });

        setTimeout(() => {
            menuLoader.style.display = 'flex';
            setTimeout(() => {
                menuLoader.style.display = 'none';
                const subMenu = document.querySelector(menuClass);
                subMenu.style.display = 'flex';
                animateMenuItems(`${menuClass} .menu-item`, { opacity: 1 });
            }, 1500);
        }, 200);
    }

    // Contact and settings menu click listeners
    document.querySelector('.menu-item.is-contact').addEventListener('click', () => handleSubMenu('.contact-wrapper'));
    document.querySelector('.menu-item.is-settings').addEventListener('click', () => handleSubMenu('.menu-items.is-settings'));

    // Close button functionality
    document.querySelector('.form-close').addEventListener('click', () => menuButton.click());

    // Form submit button functionality
    document.querySelector('.form-button.is-submit').addEventListener('click', () => {
        contactWrapper.style.display = 'none';
        menuLoader.style.display = 'flex';
        setTimeout(() => {
            menuLoader.style.display = 'none';
            contactWrapper.style.display = 'flex';
        }, 1500);
    });

    // Return from settings menu
    document.querySelector('.settings-return').addEventListener('click', () => {
        document.querySelector('.menu-items.is-settings').style.display = 'none';
        menuLoader.style.display = 'flex';
        setTimeout(() => {
            menuLoader.style.display = 'none';
            animateMenuItems('.menu-items .menu-item', { opacity: 1 });
        }, 1500);
    });

    // Menu main click listener
    document.querySelector('.menu-main').addEventListener('click', () => menuButton.click());

    // Close the menu if clicking outside of .menu-wrapper
    document.addEventListener('click', (event) => {
        if (menuOpen && !menuWrapper.contains(event.target) && !menuButton.contains(event.target)) {
            menuButton.click();
        }
    });

    // Loader animation
    function createLoader() {
        const target = document.querySelector('.loader-target');
        const characters = ['|', '/', '-', '\\'];
        let index = 0;
        function updateText() {
            target.textContent = characters[index];
            index = (index + 1) % characters.length; // Loop back to the first character
        }
        gsap.timeline({ repeat: -1, onRepeat: updateText }).to(target, { duration: 0.13, ease: "none" });
    }

    // Start the loader when the document is ready
    window.onload = createLoader;
});
