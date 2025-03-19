const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#000000";

let circles = [];
let removedCircles = 0;
const counterDisplay = document.getElementById("counter");

class Circle {
    constructor(x, radius, color, speedY) {
        this.posX = x;
        this.posY = -radius;
        this.radius = radius;
        this.color = color;
        this.speedY = speedY;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }

    update() {
        this.posY += this.speedY;
        if (this.posY - this.radius > canvas.height) {
            this.resetPosition();
        }
    }

    resetPosition() {
        this.posX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.posY = -this.radius;
        this.speedY = Math.random() * 3 + 1;
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    isClicked(mouseX, mouseY) {
        let dx = this.posX - mouseX;
        let dy = this.posY - mouseY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Ajustar la tolerancia dinámicamente en función del radio
        let extraTolerance = Math.max(3, 10 - this.radius * 0.2);
        return distance < this.radius + extraTolerance;
    }
}

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 15 + 15; // Evitamos círculos demasiado pequeños (mínimo 15)
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speedY = Math.random() * 3 + 1;
        circles.push(new Circle(x, radius, color, speedY));
    }
}

canvas.addEventListener("click", function (event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    for (let i = circles.length - 1; i >= 0; i--) {
        if (circles[i].isClicked(mouseX, mouseY)) {
            console.log(`Círculo eliminado en X:${mouseX}, Y:${mouseY}, Radio:${circles[i].radius}`);
            circles.splice(i, 1);
            removedCircles++;
            counterDisplay.textContent = `Círculos eliminados: ${removedCircles}`;
            generateCircles(1);
            break;
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();