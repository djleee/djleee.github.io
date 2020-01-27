const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();

//Setup canvas resizing
function initCanvas() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    rect = canvas.getBoundingClientRect();
}
initCanvas();
window.addEventListener("resize", initCanvas);

//Setup waterdrop animation
let drawInterval;
function drawRipple(rip) {
    console.log("RUNNING :)");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle= rip.color;
    ctx.arc(
        (rip.x - rect.left) / (rect.right - rect.left) * canvas.width,
        (rip.y - rect.top) / (rect.bottom - rect.top) * canvas.height,
        rip.r,
        0,
        2 * Math.PI
    );
    ctx.stroke();

    rip.r += rip.delta;
    if(rip.r > 1500) {
        clearInterval(drawInterval);
    }
}

let ripple = {
    color: 'rgb(255,255,255)',
    x: 0,
    y: 0,
    r: 0,
    delta: 0
}

canvas.addEventListener('click', (e) => {
    ripple.x = e.clientX;
    ripple.y = e.clientY;
    ripple.r = 1;
    ripple.delta = 1;

    clearInterval(drawInterval);
    drawInterval = setInterval(() => drawRipple(ripple), 1);
});
