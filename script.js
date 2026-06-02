// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    init3DTilt();
    initScrollAnimations();
    initMobileMenu();
    initNavbarScroll();
    initFloatingEcosystem();
    hideSplineLogo();
    
    // Trigger initial reveal animations
    setTimeout(() => {
        document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
    
    // Attempt to hide Spline watermark
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        // We use a short interval to catch the shadow root elements as they render
        const hideLogo = setInterval(() => {
            if (splineViewer.shadowRoot) {
                const logo = splineViewer.shadowRoot.querySelector('#logo');
                if (logo) {
                    logo.style.display = 'none';
                    clearInterval(hideLogo);
                }
            }
        }, 100);
        
        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(hideLogo), 5000);
    }
});

// Particles System using Canvas
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > width) this.x = 0;
            else if (this.x < 0) this.x = width;
            
            if (this.y > height) this.y = 0;
            else if (this.y < 0) this.y = height;
        }
        
        draw() {
            // White particles with slightly increased opacity
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.75})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw constellation lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    // White connections with slightly increased opacity
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - distance/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Immersive 3D Tilt Interaction
function init3DTilt() {
    const container = document.getElementById('tilt-container');
    const hero = document.querySelector('.hero');
    
    if (!container || !hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        
        // Calculate center point of the 3D container
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to center
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Compute rotation angles (max 15 degrees) - Disabled per user request
        // const rotateX = (mouseY / (rect.height / 2)) * -15;
        // const rotateY = (mouseX / (rect.width / 2)) * 15;
        
        // Apply 3D transform with smooth interpolation
        // container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Face parallax tracking
        const face = document.getElementById('robot-face');
        if (face) {
            const faceMoveX = (mouseX / (rect.width / 2)) * 25; // Exaggerate movement for face
            const faceMoveY = (mouseY / (rect.height / 2)) * 25;
            face.style.transform = `translate(calc(-50% + ${faceMoveX}px), calc(-50% + ${faceMoveY}px)) translateZ(70px)`;
        }
    });
    
    // Reset position smoothly when mouse leaves
    hero.addEventListener('mouseleave', () => {
        // container.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        // container.style.transition = 'transform 0.5s ease-out';

        const face = document.getElementById('robot-face');
        if (face) {
            face.style.transform = `translate(-50%, -50%) translateZ(70px)`;
            face.style.transition = 'transform 0.5s ease-out';
        }
    });
    
    // Enable fast tracking when mouse enters
    hero.addEventListener('mouseenter', () => {
        // container.style.transition = 'transform 0.1s ease';
        
        const face = document.getElementById('robot-face');
        if (face) {
            face.style.transition = 'transform 0.1s ease';
        }
    });
}

// Scroll Intersection Animations
function initScrollAnimations() {
    const options = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);
    
    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Navigation Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && closeMenu && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
        
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }
}

// Sticky Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}


// Cinematic AI Orchestration
function initFloatingEcosystem() {
    const ecosystem = document.querySelector('.floating-ecosystem');
    const nodes = document.querySelectorAll('.holographic-capsule');
    
    if (!ecosystem || nodes.length === 0) return;
    
    // Un-hide ecosystem first
    ecosystem.style.display = 'block';
    
    // Cinematic Boot-Up Sequence
    setTimeout(() => {
        // Start ecosystem
        ecosystem.classList.add('active');
        
        // Staggered node boot-up
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.classList.add('active');
            }, index * 1000); // 1-second delay between each node
        });
    }, 3000); // Wait 3 seconds after load
}

// Hide Spline Logo Hack
function hideSplineLogo() {
    let attempts = 0;
    const checkExist = setInterval(function() {
        attempts++;
        const spline = document.querySelector('spline-viewer');
        if (spline && spline.shadowRoot) {
            const logo = spline.shadowRoot.querySelector('#logo');
            if (logo) logo.remove();
            
            const links = spline.shadowRoot.querySelectorAll('a');
            links.forEach(link => {
                if (link.href && link.href.includes('spline.design')) {
                    link.remove();
                }
            });
        }
        
        // Stop checking after 5 seconds
        if (attempts > 50) {
            clearInterval(checkExist);
        }
    }, 100);
}
