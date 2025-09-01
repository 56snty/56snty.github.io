// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('digitalCanvas'),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create particle system with colors
const particleCount = 3000;
const particles = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
const colorArray = new Float32Array(particleCount * 3);
const sizeArray = new Float32Array(particleCount);
const velocityArray = new Float32Array(particleCount * 3); // For attraction

for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 80;
    posArray[i + 1] = (Math.random() - 0.5) * 80;
    posArray[i + 2] = (Math.random() - 0.5) * 80;
    
    const hue = Math.random() * 0.2 + 0.7;
    const color = new THREE.Color().setHSL(hue, 0.6, Math.random() * 0.4 + 0.6);
    colorArray[i] = color.r;
    colorArray[i + 1] = color.g;
    colorArray[i + 2] = color.b;
    
    sizeArray[i/3] = Math.random() * 0.3 + 0.05;
    
    velocityArray[i] = 0;
    velocityArray[i + 1] = 0;
    velocityArray[i + 2] = 0;
}

particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
particles.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(particles, particleMaterial);
scene.add(particleMesh);

// Camera position
camera.position.z = 20;

// Mouse position for attraction
const mouse = new THREE.Vector2();
const mouse3D = new THREE.Vector3();
document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    
    particleMesh.rotation.x += 0.0005;
    particleMesh.rotation.y += 0.0005;
    
    // Twinkling
    for (let i = 0; i < particleCount; i++) {
        sizeArray[i] = 0.1 + 0.2 * Math.sin(time + i * 0.01);
    }
    particles.attributes.size.needsUpdate = true;
    
    // Particle attraction to mouse with reduced force
    mouse3D.set(mouse.x * 40, mouse.y * 40, 0);
    for (let i = 0; i < particleCount * 3; i += 3) {
        const dx = mouse3D.x - posArray[i];
        const dy = mouse3D.y - posArray[i + 1];
        const dz = mouse3D.z - posArray[i + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 10) { // Reduced radius
            const force = (10 - dist) / 10 * 0.005; // Reduced force
            velocityArray[i] += dx / dist * force;
            velocityArray[i + 1] += dy / dist * force;
            velocityArray[i + 2] += dz / dist * force;
        }
        
        // Apply velocity and dampen
        posArray[i] += velocityArray[i];
        posArray[i + 1] += velocityArray[i + 1];
        posArray[i + 2] += velocityArray[i + 2];
        velocityArray[i] *= 0.98; // Increased damping
        velocityArray[i + 1] *= 0.98;
        velocityArray[i + 2] *= 0.98;
        
        // Softer boundary
        if (Math.abs(posArray[i]) > 40) velocityArray[i] *= -0.5;
        if (Math.abs(posArray[i + 1]) > 40) velocityArray[i + 1] *= -0.5;
        if (Math.abs(posArray[i + 2]) > 40) velocityArray[i + 2] *= -0.5;
    }
    particles.attributes.position.needsUpdate = true;
    
    // Parallax
    camera.position.x += (mouse.x * 10 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 6 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {x: e.clientX, y: e.clientY, duration: 0.1});
    gsap.to(cursorFollower, {x: e.clientX, y: e.clientY, duration: 0.3});
});

// Cursor effects
document.querySelectorAll('.nav-portal, .skill-item, .github-link, .upcoming-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {scale: 1.5, borderColor: 'rgba(255, 255, 255, 0.5)', duration: 0.2});
        gsap.to(cursorFollower, {width: 30, height: 30, duration: 0.2});
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {scale: 1, borderColor: 'rgba(255, 255, 255, 1)', duration: 0.2});
        gsap.to(cursorFollower, {width: 8, height: 8, duration: 0.2});
    });
});

// Navigation with GSAP transitions
const navPortals = document.querySelectorAll('.nav-portal');
const sections = document.querySelectorAll('.section');
let currentSection = document.getElementById('hero');
let isAnimating = false;

navPortals.forEach(portal => {
    portal.addEventListener('click', () => {
        const targetId = portal.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection === currentSection || isAnimating) return;
        
        isAnimating = true;
        navPortals.forEach(p => p.classList.remove('active'));
        portal.classList.add('active');
        
        gsap.to(currentSection, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                currentSection.classList.remove('active');
                targetSection.classList.add('active');
                currentSection = targetSection;
                gsap.fromTo(targetSection, {
                    opacity: 0,
                    y: -50
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    onComplete: () => {
                        isAnimating = false;
                        gsap.set(targetSection, {clearProps: "all"});
                    }
                });
                animateSection(targetId);
            }
        });
    });
});

// Function to animate specific sections
function animateSection(sectionId) {
    if (sectionId === 'hero') {
        // Reset and re-type subtitle if returning to hero
        subtitleEl.textContent = '';
        charIndex = 0;
        typeSubtitle();
    } else if (sectionId === 'skills') {
        gsap.from('.skill-item', {
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        });
    } else if (sectionId === 'projects') {
        gsap.from('.upcoming-card', {
            opacity: 0,
            scale: 0.8,
            stagger: 0.2,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    } else if (sectionId === 'contact') {
        gsap.from('.github-link', {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
}

// Hero typing effect with layout shift prevention
const subtitleText = "Crafting bold digital experiences with code, design, and imagination. Currently shaping my future in Eindhoven.";
const subtitleEl = document.querySelector('.hero-subtitle');
let charIndex = 0;

function typeSubtitle() {
    // Temporarily set full text to measure height
    subtitleEl.textContent = subtitleText;
    const height = subtitleEl.offsetHeight;
    subtitleEl.style.height = `${height}px`;
    subtitleEl.textContent = ''; // Reset text
    
    function type() {
        if (charIndex < subtitleText.length) {
            subtitleEl.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 30);
        } else {
            subtitleEl.style.height = 'auto'; // Reset height after typing
        }
    }
    type();
}

gsap.from('.hero-logo', {opacity: 0, y: -50, duration: 1, ease: 'bounce.out', onComplete: typeSubtitle});

// Skill tooltips
document.querySelectorAll('.skill-item').forEach(item => {
    const tooltip = document.createElement('span');
    tooltip.classList.add('skill-tooltip');
    tooltip.textContent = item.dataset.proficiency;
    item.appendChild(tooltip);
});

// Upcoming cards hover
document.querySelectorAll('.upcoming-card').forEach(card => {
    const title = document.createElement('span');
    title.classList.add('upcoming-title');
    title.textContent = card.dataset.title;
    card.appendChild(title);
});

// Prevent scroll
document.body.addEventListener('wheel', (e) => {
    e.preventDefault();
}, { passive: false });

// Random floating animation for nav icons
navPortals.forEach((portal, index) => {
    gsap.to(portal, {
        y: () => Math.sin(index) * 10,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
    });
});