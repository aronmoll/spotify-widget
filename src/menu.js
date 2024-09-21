// Import GSAP and necessary plugins
gsap.registerPlugin(CustomEase, ScrollTrigger);

// Create and rename the custom ease
CustomEase.create("manvydasEase", "M0,0 C0.49,0.03 0.13,0.99 1,1");

document.addEventListener('DOMContentLoaded', function () {
    let menuOpen = false;
    let submenuAnimation = null;

    const elements = {
        menuWrapper: document.querySelector('.menu-wrapper'),
        menuButton: document.querySelector('.menu-button'),
        menuButtonWrappers: document.querySelectorAll('.menu-button_wrapper'),
        menuItemChildren: document.querySelectorAll('.menu-items > *'),
        contactWrapper: document.querySelector('.contact-wrapper'),
        menuLoader: document.querySelector('.menu-loader'),
        settingsWrapper: document.querySelector('.menu-items.is-settings')
    };

    if (!elements.menuWrapper || !elements.menuButton) {
        console.error('Menu wrapper or menu button element not found!');
        return;
    }

    function animateMenuItems(targets, { opacity, duration = 0.2, stagger = 0.05, delay = 0 }) {
        gsap.to(targets, {
            opacity,
            duration,
            stagger,
            ease: "manvydasEase",
            delay
        });
    }

    function toggleMenu(open) {
        menuOpen = open;
        gsap.to(elements.menuButtonWrappers, {
            duration: 0.5,
            y: open ? '-102%' : '0%',
            ease: "manvydasEase"
        });
        animateMenuItems(elements.menuItemChildren, {
            opacity: open ? 1 : 0,
            delay: open ? 0.2 : 0,
            stagger: {
                amount: 0.05 * (elements.menuItemChildren.length - 1),
                from: open ? "start" : "end"
            }
        });

        if (open) {
            if (submenuAnimation) {
                submenuAnimation.kill();
                submenuAnimation = null;
            }
            elements.menuLoader.style.display = 'none';
            elements.contactWrapper.style.display = 'none';
            elements.settingsWrapper.style.display = 'none';
        }
    }

    elements.menuButton.addEventListener('click', () => {
        toggleMenu(!menuOpen);
    });

    function isAtBottom() {
        return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    }

    if (window.location.pathname === '/') {
        ScrollTrigger.create({
            trigger: ".mvp-spacer",
            start: "bottom bottom",
            onEnter: () => !menuOpen && !isAtBottom() && elements.menuButton.click(),
            onLeaveBack: () => menuOpen && elements.menuButton.click()
        });
    }

    function handleSubMenu(menuClass) {
        if (submenuAnimation) {
            submenuAnimation.kill();
        }

        submenuAnimation = gsap.timeline()
            .to('.menu-items .menu-item', {
                opacity: 0,
                duration: 0.2,
                stagger: 0.07,
                ease: "manvydasEase"
            })
            .to('.single-widget_wrap', {
                opacity: 0,
                duration: 0.6,
                ease: "manvydasEase"
            }, "<")
            .set(elements.menuLoader, { display: 'flex' })
            .to(elements.menuLoader, { duration: 1.5 })
            .set(elements.menuLoader, { display: 'none' })
            .set(menuClass, { display: 'flex' })
            .to(`${menuClass} .menu-item`, {
                opacity: 1,
                duration: 0.2,
                stagger: 0.05,
                ease: "manvydasEase"
            });
    }

    document.querySelector('.menu-item.is-contact').addEventListener('click', () => handleSubMenu('.contact-wrapper'));
    document.querySelector('.menu-item.is-settings').addEventListener('click', () => handleSubMenu('.menu-items.is-settings'));

    document.querySelector('.form-close').addEventListener('click', () => elements.menuButton.click());

    document.querySelector('.form-button.is-submit').addEventListener('click', () => {
        elements.contactWrapper.style.display = 'none';
        elements.menuLoader.style.display = 'flex';
        setTimeout(() => {
            elements.menuLoader.style.display = 'none';
            elements.contactWrapper.style.display = 'flex';
        }, 1500);
    });

    document.querySelector('.settings-return').addEventListener('click', () => {
        if (submenuAnimation) {
            submenuAnimation.kill();
            submenuAnimation = null;
        }
        elements.settingsWrapper.style.display = 'none';
        elements.menuLoader.style.display = 'flex';
        setTimeout(() => {
            elements.menuLoader.style.display = 'none';
            animateMenuItems('.menu-items .menu-item', { opacity: 1 });
        }, 1500);
    });

    document.querySelector('.menu-main').addEventListener('click', () => elements.menuButton.click());

    document.addEventListener('click', (event) => {
        if (menuOpen && !elements.menuWrapper.contains(event.target) && !elements.menuButton.contains(event.target)) {
            elements.menuButton.click();
        }
    });

    function createLoader() {
        const target = document.querySelector('.loader-target');
        const characters = ['|', '/', '-', '\\'];
        let index = 0;
        function updateText() {
            target.textContent = characters[index];
            index = (index + 1) % characters.length;
        }
        gsap.timeline({ repeat: -1, onRepeat: updateText }).to(target, { duration: 0.13, ease: "none" });
    }

    window.onload = createLoader;

    // Add an event listener for the back button to act like the dark mode back button
    const backButton = document.querySelector('[data-form="menu"]');
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Close the contact form or submenu and return to the main menu
            elements.contactWrapper.style.display = 'none';
            elements.menuLoader.style.display = 'flex';  // Optionally show a loader

            setTimeout(() => {
                elements.menuLoader.style.display = 'none';
                animateMenuItems('.menu-items .menu-item', { opacity: 1 });
            }, 1500);
        });
    }
});
