// Configuración del canvas de partículas
const canvas = document.getElementById('canvas-particles');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 200 // Radio de atracción/interacción
};

let animationId = null;
let isPageVisible = true;

// Colores basados en el tema del servidor
const COLORS = {
    primary: '#6c5ce7',
    secondary: '#a8e6cf',
    accent: '#00f2fe',
    dark: '#1a1a2e',
    light: '#ffffff'
};

// Detectar movimiento del mouse
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Resetear mouse cuando sale del canvas
canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Ajustar canvas al tamaño de la ventana
window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

// Optimizar rendimiento cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && animationId) {
        animate();
    }
});

class Particle {
    constructor(x, y, directionX, directionY, size, color, speed) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.speed = speed || Math.random() * 0.5 + 0.2;
        this.originalColor = color;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    // Dibujar cada partícula con efecto glow
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        // Efecto de brillo
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Resetear shadow
        ctx.shadowBlur = 0;
    }
    
    // Actualizar posición y reacción al mouse
    update() {
        // Movimiento base
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
        
        // Efecto de pulso en el color
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        this.color = this.originalColor;
        
        // Rebote en bordes con efecto suave
        if (this.x > canvas.width - this.size || this.x < this.size) {
            this.directionX = -this.directionX;
            this.x = Math.min(Math.max(this.x, this.size), canvas.width - this.size);
        }
        if (this.y > canvas.height - this.size || this.y < this.size) {
            this.directionY = -this.directionY;
            this.y = Math.min(Math.max(this.y, this.size), canvas.height - this.size);
        }
        
        // Interacción avanzada con el cursor
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Fuerza de repulsión/atracción
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                const repelX = Math.cos(angle) * force * 3;
                const repelY = Math.sin(angle) * force * 3;
                
                // Repeler partículas del mouse
                this.x -= repelX;
                this.y -= repelY;
                
                // Cambiar color temporalmente al interactuar
                this.color = COLORS.accent;
            }
        }
        
        this.pulsePhase += this.pulseSpeed;
        this.draw();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    if (!canvas || !ctx) return;
    
    particlesArray = [];
    const area = canvas.height * canvas.width;
    const numberOfParticles = Math.min(Math.floor(area / 8000), 200); // Límite máximo de 200 partículas
    
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2.5 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 2) - 1;
        const directionY = (Math.random() * 2) - 1;
        
        // Colores basados en el tema
        const colorChoice = Math.random();
        let color;
        if (colorChoice < 0.6) color = COLORS.primary;
        else if (colorChoice < 0.8) color = COLORS.accent;
        else color = COLORS.secondary;
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Conectar partículas con líneas (Efecto Red Neuronal mejorado)
function connect() {
    const maxDistance = Math.min(canvas.width / 6, canvas.height / 6, 150);
    
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                // Opacidad basada en distancia
                const opacity = (1 - distance / maxDistance) * 0.5;
                
                // Gradiente entre colores
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                
                // Crear gradiente para las líneas
                const gradient = ctx.createLinearGradient(
                    particlesArray[a].x, particlesArray[a].y,
                    particlesArray[b].x, particlesArray[b].y
                );
                gradient.addColorStop(0, particlesArray[a].color);
                gradient.addColorStop(1, particlesArray[b].color);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Efecto de fondo con gradiente animado
let gradientOffset = 0;
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f0f1a');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Efecto de partículas de fondo
    ctx.fillStyle = 'rgba(108, 92, 231, 0.05)';
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(
            (Math.sin(gradientOffset + i) * canvas.width * 0.1) + (canvas.width * (i % 10) / 10),
            (Math.cos(gradientOffset * 0.7 + i) * canvas.height * 0.1) + (canvas.height * Math.floor(i / 10) / 10),
            1,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    gradientOffset += 0.005;
}

function animate() {
    if (!isPageVisible || !canvas || !ctx) {
        animationId = requestAnimationFrame(animate);
        return;
    }
    
    animationId = requestAnimationFrame(animate);
    drawBackground();
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Inicialización con manejo de errores
function startParticles() {
    try {
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        resizeCanvas();
        init();
        animate();
    } catch (error) {
        console.error('Error initializing particles:', error);
    }
}

// Exportar funciones para uso global
window.startParticles = startParticles;
window.particlesManager = {
    stop: () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    },
    restart: () => {
        window.particlesManager.stop();
        startParticles();
    },
    setMouseRadius: (radius) => {
        mouse.radius = radius;
    }
};

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startParticles);
} else {
    startParticles();
}