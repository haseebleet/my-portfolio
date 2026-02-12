 (function() {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 30) navbar.classList.add('nav-scrolled');
                else navbar.classList.remove('nav-scrolled');
                setActiveLink();
            });

            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('active');
            });
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            });
            const navItems = document.querySelectorAll('.nav-links a');
            navItems.forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === "#" || href === "") return;
                    const target = document.querySelector(href);
                    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                });
            });

            function setActiveLink() {
                const sections = { 'home': document.getElementById('home'), 'about': document.getElementById('about'), 'skills': document.getElementById('skills'), 'projects': document.getElementById('projects'), 'contact': document.getElementById('contact') };
                const navLinksArray = document.querySelectorAll('.nav-links a');
                let scrollPos = window.scrollY + 150;
                for (const [key, section] of Object.entries(sections)) {
                    if (section) {
                        const offsetTop = section.offsetTop;
                        const offsetBottom = offsetTop + section.offsetHeight;
                        if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                            navLinksArray.forEach(link => {
                                link.classList.remove('active-nav');
                                const linkHref = link.getAttribute('href').replace('#', '');
                                if (linkHref === key) link.classList.add('active-nav');
                            });
                            break;
                        }
                    }
                }
            }

            const animatedElements = document.querySelectorAll('.edu-card, .project-item, .cert-card, .skills-category, .contact-card');
            const appearObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.animation = 'fadeSlideUp 0.6s forwards';
                        appearObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            animatedElements.forEach(el => { if (!el.classList.contains('contact-card')) el.style.opacity = '0'; appearObserver.observe(el); });
            document.querySelector('.contact-card').style.opacity = '1';
            window.addEventListener('load', setActiveLink);
        })();

const codeCanvas = document.getElementById('code-rain');
const codeCtx = codeCanvas?.getContext('2d');

if (codeCanvas && codeCtx) {
    let drops = [];
    let columns;
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    function initCodeRain() {
        codeCanvas.width = window.innerWidth;
        codeCanvas.height = window.innerHeight;
        
        columns = Math.floor(codeCanvas.width / 20);
        drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
    }
    
    function drawCodeRain() {
       
        codeCtx.fillStyle = 'rgba(246, 249, 252, 0.03)';
        codeCtx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);
        
        codeCtx.font = '16px "Courier New", monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            const x = i * 20;
            const y = drops[i] * 20;
            
           
            const gradient = codeCtx.createLinearGradient(x, y - 20, x, y);
            gradient.addColorStop(0, '#2563eb');
            gradient.addColorStop(1, '#4f46e5');
            
            codeCtx.fillStyle = gradient;
            codeCtx.globalAlpha = 0.25;
            codeCtx.fillText(char, x, y);
            
            if (drops[i] * 20 > codeCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        requestAnimationFrame(drawCodeRain);
    }
    
    initCodeRain();
    drawCodeRain();
    
    window.addEventListener('resize', initCodeRain);
}


const glow = document.getElementById('cursor-glow');

if (glow) {
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    
   
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-item, .skill-badge, .edu-card, .cert-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            glow.style.width = '500px';
            glow.style.height = '500px';
            glow.style.background = 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)';
        });
        el.addEventListener('mouseleave', () => {
            glow.style.width = '400px';
            glow.style.height = '400px';
            glow.style.background = 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)';
        });
    });
}

