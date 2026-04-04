document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed to only animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));


    // 2. Dynamic 3D effect for cards (Subtle Parallax)
    const dynamicCards = document.querySelectorAll('.dynamic-hover');
    
    dynamicCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // Calculate rotation values (very subtle)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -2; // max rotation degrees
            const rotateY = ((x - centerX) / centerX) * 2;
            
            card.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset transform smoothly
            card.style.transform = `perspective(1000px) scale(1) rotateX(0) rotateY(0)`;
        });
    });

    // 3. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)';
            navbar.style.background = '#ffffff';
        } else {
            navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
            navbar.style.boxShadow = 'none';
            navbar.style.background = '#ffffff';
        }
    });

    // 4. Job Search Shortcut (Cmd/Ctrl + K)
    const searchInput = document.querySelector('.job-search-input');
    if (searchInput) {
        document.body.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                // scroll to it
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

});
