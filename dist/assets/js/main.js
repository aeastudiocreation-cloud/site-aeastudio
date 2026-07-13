/**
 * A&A Studio — Main JavaScript (Stitch Aesthetic)
 * GSAP + ScrollTrigger + Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Lenis Smooth Scroll Setup
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Update Alpine's mobile menu to work with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    // ==========================================================================
    // 2. Header Scroll Effect (Glassmorphism on scroll)
    // ==========================================================================
    const header = document.getElementById('main-header');
    if (header) {
        lenis.on('scroll', ({ scroll }) => {
            if (scroll > 80) {
                header.classList.add('bg-[#1A0B22]/80', 'backdrop-blur-md', 'border-b', 'border-white/10');
            } else {
                header.classList.remove('bg-[#1A0B22]/80', 'backdrop-blur-md', 'border-b', 'border-white/10');
            }
        });
    }

    // ==========================================================================
    // 3. GSAP ScrollTrigger Animations (Stitch Vibe)
    // ==========================================================================
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animation (Initial Load)
    gsap.from("#hero h1", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
    });
    gsap.from("#hero p", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.4
    });
    gsap.from("#hero .flex", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.6
    });

    // Section Headers
    gsap.utils.toArray('.text-center.max-w-2xl, .text-center.mb-16').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Cards / Grid Items (Fade Up)
    const grids = ['#credibilidade .grid', '#servicos .grid', '#beneficios .grid', '#como-funciona .grid', '#depoimentos .grid'];
    grids.forEach(selector => {
        const grid = document.querySelector(selector);
        if (grid) {
            const items = gsap.utils.toArray(grid.children);
            items.forEach((item, index) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: (index % 4) * 0.15,
                    ease: "back.out(1.2)"
                });
            });
        }
    });

    // Image Reveal (Quem Somos)
    const sobreImg = document.querySelector('#sobre img');
    if(sobreImg) {
        gsap.from(sobreImg.parentElement, {
            scrollTrigger: {
                trigger: sobreImg.parentElement,
                start: "top 80%",
            },
            scale: 0.8,
            opacity: 0,
            rotation: 2,
            duration: 1.5,
            ease: "expo.out"
        });
    }

    // FAQ Accordions Stagger
    const faqs = gsap.utils.toArray('#faq .space-y-4 > div');
    faqs.forEach((faq, index) => {
        gsap.from(faq, {
            scrollTrigger: {
                trigger: faq,
                start: "top 90%",
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: (index % 5) * 0.1,
            ease: "power2.out"
        });
    });

});
