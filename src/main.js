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
    const scrollIndicatorWrap = document.querySelector(".scroll-indicator_wrap");
    const scrollIndicatorTarget = document.querySelector(".scroll-indicator_target");
    
    // GSAP animation
    gsap.to(scrollIndicatorTarget, {
        rotation: 180,
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
    
    // Function to smoothly scroll to the section
    function smoothScrollToSection() {
        // Get current rotation using GSAP's getProperty
        const currentRotation = gsap.getProperty(scrollIndicatorTarget, "rotation");
        
        let targetSection;
        
        // Determine the target section based on the rotation
        if (currentRotation > 90) {
            // If rotation is more than 90 degrees, target the #top section
            targetSection = document.querySelector("#top");
        } else {
            // Otherwise, target the #Main-content section
            targetSection = document.querySelector("#Main-content");
        }
        
        // Smooth scroll to the target section
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    }
    
    // Add click event listener to the scroll indicator wrapper
    scrollIndicatorWrap.addEventListener('click', smoothScrollToSection);   
    gsap.to('.intro-text_wrap', {
        scrollTrigger: {
            trigger: '.projects-wrap',
            start: 'top 90%',
            end: 'top 60%',
            scrub: true
        },
        opacity: 0,
        filter: 'blur(5px)',
        duration: 0.5
    });
});

