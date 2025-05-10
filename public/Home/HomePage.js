document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Hero text animation
  gsap.from('.hero h1', { opacity: 0, y: -50, duration: 1.2 });
  gsap.from('.hero p', { opacity: 0, y: 30, duration: 1, delay: 0.5 });
  gsap.from('.hero-btn', { opacity: 0, scale: 0.8, duration: 1, delay: 1 });
});
/* Scroll-triggered animations for info sections
    gsap.from(".info-box", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
            trigger: ".info",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });
}); */
