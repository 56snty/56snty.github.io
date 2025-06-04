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
        
        // Create particle system
        const particleCount = 2000;
        const particles = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const sizeArray = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position
            posArray[i] = (Math.random() - 0.5) * 50;
            posArray[i + 1] = (Math.random() - 0.5) * 50;
            posArray[i + 2] = (Math.random() - 0.5) * 50;
            
            // Size
            sizeArray[i/3] = Math.random() * 0.5 + 0.1;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        
        // Particle material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const particleMesh = new THREE.Points(particles, particleMaterial);
        scene.add(particleMesh);
        
        // Add grid structure
        const gridGeometry = new THREE.BufferGeometry();
        const gridCount = 1000;
        const gridArray = new Float32Array(gridCount * 3);
        
        for (let i = 0; i < gridCount * 3; i += 3) {
            gridArray[i] = (Math.random() - 0.5) * 100;
            gridArray[i + 1] = (Math.random() - 0.5) * 100;
            gridArray[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        gridGeometry.setAttribute('position', new THREE.BufferAttribute(gridArray, 3));
        
        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1
        });
        
        const gridMesh = new THREE.LineSegments(gridGeometry, gridMaterial);
        scene.add(gridMesh);
        
        // Camera position
        camera.position.z = 10;
        
        // Mouse move effect
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate particles
            particleMesh.rotation.x += 0.001;
            particleMesh.rotation.y += 0.001;
            
            // Rotate grid
            gridMesh.rotation.y += 0.0005;
            
            // Move camera based on mouse
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Custom cursor
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            
            setTimeout(() => {
                cursorFollower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }, 100);
        });
        
        // Interactive elements cursor effect
        document.querySelectorAll('.nav-portal, .skill-category, .github-link').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                cursorFollower.style.width = '30px';
                cursorFollower.style.height = '30px';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'rgba(255, 255, 255, 1)';
                cursorFollower.style.width = '8px';
                cursorFollower.style.height = '8px';
            });
        });
        
        // Navigation
        const navPortals = document.querySelectorAll('.nav-portal');
        const sections = document.querySelectorAll('.section');
        
        navPortals.forEach(portal => {
            portal.addEventListener('click', () => {
                const target = portal.getAttribute('data-target');
                
                // Update active nav
                navPortals.forEach(p => p.classList.remove('active'));
                portal.classList.add('active');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(target).classList.add('active');
            });
        });
        
        // Prevent scroll from affecting the experience
        document.body.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });