const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let isLogoFormed = false;
const numberOfParticles = 200; // Un peu plus pour bien dessiner le logo

// Définition des 4 zones du logo Windows (carrés)
const logoSize = 120;
const gap = 8;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const targets = [
    { x: centerX - logoSize / 2, y: centerY - logoSize / 2 }, // Haut Gauche
    { x: centerX + gap, y: centerY - logoSize / 2 },        // Haut Droite
    { x: centerX - logoSize / 2, y: centerY + gap },        // Bas Gauche
    { x: centerX + gap, y: centerY + gap }                // Bas Droite
];

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        
        // Vitesse de flottement (ton ancien code)
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Cible pour le logo
        const targetObj = targets[Math.floor(Math.random() * targets.length)];
        this.targetX = targetObj.x + Math.random() * (logoSize / 2 - gap);
        this.targetY = targetObj.y + Math.random() * (logoSize / 2 - gap);
        
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(0, 242, 255, ${this.opacity})`;
    }

    update() {
        // Temps écoulé depuis le début (pour laisser flotter un peu avant de former le logo)
        const timeElapsed = performance.now();

        if (timeElapsed < 2500) {
            // PHASE 1 : Flottement libre (Ton ancien code)
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        } else {
            // PHASE 2 : Formation du logo (Attraction)
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            this.x += dx * 0.05;
            this.y += dy * 0.05;

            // Vérification si le logo est formé (si la première particule est arrivée)
            if (Math.abs(dx) < 0.5 && !isLogoFormed) {
                isLogoFormed = true;
                triggerFlash();
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        // On dessine des petits carrés pour rappeler Windows
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function triggerFlash() {
    // Petit flash blanc
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // On révèle la page après 800ms
    setTimeout(revealPage, 800);
}

function revealPage() {
    const loader = document.getElementById('loader-overlay');
    const content = document.getElementById('main-content');
    const sideNav = document.querySelector('.side-nav');

    if (loader) loader.style.opacity = '0';
    
    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            setTimeout(() => content.style.opacity = '1', 50);
        }
        if (sideNav) {
            sideNav.style.display = 'flex';
            setTimeout(() => sideNav.style.opacity = '1', 50);
        }
    }, 800);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});