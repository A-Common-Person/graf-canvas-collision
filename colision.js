const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#000000";

class Circle {
    constructor(x, y, radius, color, text, speedX, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.text = text;
        this.speedX = speedX;
        this.speedY = speedY;
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.closePath();

        // Dibujar el texto en blanco y arriba del círculo
        context.fillStyle = "#FFFFFF";
        context.textAlign = "center";
        context.textBaseline = "bottom";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY - this.radius - 5);
    }

    update(context, circles) {
        this.posX += this.speedX;
        this.posY += this.speedY;

        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.speedY = -this.speedY;
        }

        this.checkCollisions(circles);
        this.draw(context);
    }

    checkCollisions(circles) {
        circles.forEach(circle => {
            if (circle !== this) {
                let dx = this.posX - circle.posX;
                let dy = this.posY - circle.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.radius + circle.radius) {
                    this.isColliding = true;
                    circle.isColliding = true;
                    this.color = "#0000FF";
                    circle.color = "#0000FF";

                    let tempSpeedX = this.speedX;
                    let tempSpeedY = this.speedY;
                    this.speedX = circle.speedX;
                    this.speedY = circle.speedY;
                    circle.speedX = tempSpeedX;
                    circle.speedY = tempSpeedY;

                    setTimeout(() => {
                        this.color = this.originalColor;
                        circle.color = circle.originalColor;
                    }, 200);
                }
            }
        });
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speedX = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
        let speedY = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1);
        let text = `C${i + 1}`;

        let newCircle = new Circle(x, y, radius, color, text, speedX, speedY);
        circles.push(newCircle);
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
