// Canvas Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();

const MAX_RIPPLE_SIZE = 300;

// Setup canvas resizing
function initCanvas() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    rect = canvas.getBoundingClientRect();
}
initCanvas();
window.addEventListener("resize", initCanvas);

// Helper function to generate color rgb string
function generateColor(t) {
    return `rgba(255, 255, 255, ${t})`
}

// Helper to create a ripple object
function initRipple(x, y, r, d) {
    return {
        x: x,
        y: y,
        r: r,
        delta: d
    }
}

// Setup waterdrop animation
let drawInterval;
function drawRipples(rips) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = rips.length -1; i >= 0; i--) {
        ctx.beginPath();
        // Transitions the color from 255 to 0
        ctx.strokeStyle = generateColor((Math.max(MAX_RIPPLE_SIZE - (rips[i].r), 0)/MAX_RIPPLE_SIZE));
        ctx.arc(
            (rips[i].x - rect.left) / (rect.right - rect.left) * canvas.width,
            (rips[i].y - rect.top) / (rect.bottom - rect.top) * canvas.height,
            rips[i].r,
            0,
            2 * Math.PI
        );
        ctx.stroke();

        rips[i].r += rips[i].delta;

        // Only check the most recent ripple
        if (rips[i].r > MAX_RIPPLE_SIZE) {
            rips.splice(i,1);
            if (rips.length == 0) {
                clearInterval(drawInterval);
            }
        }
    }
}

let ripples = []

canvas.addEventListener('click', (e) => {
    ripples.unshift(initRipple(e.clientX, e.clientY, 1, 1));
    clearInterval(drawInterval);
    drawInterval = setInterval(() => drawRipples(ripples), 5);
});
