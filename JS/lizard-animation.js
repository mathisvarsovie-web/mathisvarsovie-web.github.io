const canvas = document.getElementById('lizardCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let segments = [];
let particles = [];
const numSegments = 12;
const segmentSize = 10;

let fly = { x: 0, y: 0, angle: 0 };
let isExploded = false;
let explosionAlpha = 0;

// On précharge le logo pour l'explosion
const logoImg = new Image();
logoImg.src = "Image/Logo_entreprise/GNS3.png";

class Segment {
    constructor(parent, size) {
        this.parent = parent;
        this.size = size;
        this.x = parent ? parent.x : 0;
        this.y = parent ? parent.y : 0;
        this.absAngle = 0;
        this.children = [];
    }

    // Ta logique de cinématique inverse
    follow(targetX, targetY) {
        var dist = ((this.x - targetX) ** 2 + (this.y - targetY) ** 2) ** 0.5;
        this.x = targetX + this.size * (this.x - targetX) / dist;
        this.y = targetY + this.size * (this.y - targetY) / dist;
        this.absAngle = Math.atan2(this.y - targetY, this.x - targetX);
        if (this.children.length > 0) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].follow(this.x, this.y);
            }
        }
    }

    draw() {
        ctx.strokeStyle = '#4db8e5';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.absAngle) * this.size, this.y + Math.sin(this.absAngle) * this.size);
        ctx.stroke();
        if (this.children[0]) this.children[0].draw();
    }
}

// Système de particules pour l'explosion
function createExplosion(x, y) {
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            size: Math.random() * 5,
            color: '#4db8e5'
        });
    }
}

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    segments = [];
    let root = new Segment(null, segmentSize);
    root.x = width / 2 - 200;
    root.y = height / 2;
    segments.push(root);
    let prev = root;
    for (let i = 1; i < numSegments; i++) {
        let curr = new Segment(prev, segmentSize);
        prev.children.push(curr);
        prev = curr;
    }
    fly.x = width + 50;
    fly.y = height / 2;
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    if (!isExploded) {
        // Animation de vol et de poursuite
        fly.angle += 0.05;
        fly.y += Math.sin(fly.angle) * 3;
        fly.x -= 4; // Vitesse de la mouche

        segments[0].follow(fly.x, fly.y);
        segments[0].draw();

        // Dessin de la mouche
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(fly.x, fly.y, 4, 0, Math.PI * 2); ctx.fill();

        // COLLISION AU MILIEU
        if (fly.x <= width / 2) {
            isExploded = true;
            createExplosion(width / 2, height / 2);
            setTimeout(showPage, 2000); // Délai avant d'afficher la page
        }
    } else {
        // Animation de l'explosion
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });

        // Apparition du logo GNS3 en fondu
        explosionAlpha += 0.02;
        ctx.globalAlpha = Math.min(explosionAlpha, 1);
        const logoSize = 150 * Math.min(explosionAlpha, 1);
        ctx.drawImage(logoImg, (width / 2) - (logoSize / 2), (height / 2) - (logoSize / 2), logoSize, logoSize);
        ctx.globalAlpha = 1;
    }

    requestAnimationFrame(animate);
}

function showPage() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('main-content');
    loader.style.transition = "opacity 1s ease";
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
        content.classList.remove('hidden');
    }, 1000);
}

window.addEventListener('resize', init);
init();
animate();