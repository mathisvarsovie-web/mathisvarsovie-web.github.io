const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class CyberParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedY = Math.random() * 2 + 1; // Tombent comme du code
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.y += this.speedY;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
        // On dessine des petits carrés de "code"
        ctx.fillRect(this.x, this.y, this.size, this.size * 5);
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new CyberParticle());
    }
}

function animate() {
    ctx.fillStyle = 'rgba(5, 10, 14, 0.1)'; // Effet de traînée
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

// Fin du chargement après 3 secondes
setTimeout(() => {
    document.getElementById('loader-overlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('loader-overlay').style.display = 'none';
        const content = document.getElementById('main-content');
        content.style.display = 'flex';
        setTimeout(() => content.style.opacity = '1', 50);
    }, 800);
}, 3000);

init();
animate();