// Constants
const MAX_RIPPLE_SIZE = 300;
const RAIN_ENABLED_CLASS = "fas fa-tint";
const RAIN_DISABLED_CLASS = "fas fa-tint-slash";
const MOON_ENABLED_CLASS = "fas fa-moon";
const MOON_DISABLED_CLASS = "fas fa-fish";

// HTML Element Variables and friends
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();
const rainToggle = document.getElementById("rain-toggle");
const rainToggleIcon = document.getElementById("rain-toggle-icon");
const moonToggle = document.getElementById("moon-toggle");
const moonToggleIcon = document.getElementById("moon-toggle-icon");

const homeDiv = document.getElementById("home");
const moon = document.getElementById("moon");
const moon2 = document.getElementById("moon2");
const fish = document.getElementById("fish");
const fish2 = document.getElementById("fish2");

// State Variables
let isRaining = false;
let isMoonEnabled = true;

//Helper Functions
// Reset Canvas size to window
function initCanvases() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    rect = canvas.getBoundingClientRect();
    drawMoons(0, 0);
}
// Helper function to generate color rgb string
function generateColor(t) {
    return `rgba(255, 255, 255, ${t})`
}
function generateInvertedColor(t) {
    return `rgba(0, 0, 0, ${t})`
}
// Helper to create a ripple object
function initRipple(x, y) {
    return {
        x: x,
        y: y,
        r: 1,
        delta: 2
    }
}
// Create a ripple somewhere in the canvas
function createRandomRipple() {
    return initRipple(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height)
    );
}

// Here we go
initCanvases();
window.addEventListener("resize", initCanvases);

// Setup waterdrop animation
let drawInterval;
function drawRipples(rips) {
    for (var i = rips.length - 1; i >= 0; i--) {
        ctx.beginPath();
        // Transitions the color from 255 to 0
        ctx.strokeStyle = generateColor((Math.max(MAX_RIPPLE_SIZE - (rips[i].r), 0) / MAX_RIPPLE_SIZE));
        ctx.arc(
            (rips[i].x - rect.left) / (rect.right - rect.left) * canvas.width,
            (rips[i].y - rect.top) / (rect.bottom - rect.top) * canvas.height,
            rips[i].r,
            0,
            2 * Math.PI
        );
        ctx.stroke();

        // Draw Inverted one for inverted segments
        ctx.beginPath();
        // Transitions the color from 255 to 0
        ctx.strokeStyle = generateInvertedColor((Math.max(MAX_RIPPLE_SIZE - (rips[i].r), 0) / MAX_RIPPLE_SIZE));
        ctx.arc(
            (rips[i].x - rect.left) / (rect.right - rect.left) * canvas.width,
            (rips[i].y - rect.top) / (rect.bottom - rect.top) * canvas.height,
            rips[i].r - 1,
            0,
            2 * Math.PI
        );
        ctx.stroke();

        rips[i].r += rips[i].delta;

        // Only check the most recent ripple
        if (rips[i].r > MAX_RIPPLE_SIZE) {
            rips.splice(i, 1);
            if (rips.length == 0) {
                if (isRaining) {
                    rips.push(createRandomRipple());
                } else {
                    // clearInterval(drawInterval);
                }
            }
        }
    }
}

let ripples = []
canvas.addEventListener('click', (e) => {
    ripples.unshift(initRipple(e.clientX, e.clientY));
});
rainToggle.addEventListener('click', () => {
    if (isRaining) {
        ripples.length = 0;
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // clearInterval(drawInterval);
        rainToggleIcon.className = RAIN_DISABLED_CLASS;
    } else {
        ripples.push(createRandomRipple());
        rainToggleIcon.className = RAIN_ENABLED_CLASS;
    }
    isRaining = !isRaining;
});
moonToggle.addEventListener('click', () => {
    if (isMoonEnabled) {
        moonToggleIcon.className = MOON_DISABLED_CLASS;
        moon.style = "display: none";
        moon2.style = "display: none;perspective: 100px";
        fish.style = "display: ";
        fish2.style = "display: ";
    } else {
        moonToggleIcon.className = MOON_ENABLED_CLASS;
        moon.style = "display: ";
        moon2.style = "display: ";
        fish.style = "display: none";
        fish2.style = "display: none";
    }
    isMoonEnabled = !isMoonEnabled;
    drawMoons(0, 0);
});


// Home Canvas
function drawMoons(xSway, ySway) {
    if (isMoonEnabled) {
        moon.style = "transform: translate(" + xSway + "px, " + ySway / 10 + "px)";
        moon2.style = "transform: translate(" + xSway + "px, " + ySway / -10 + "px)";
    } else {
        fish.style = "transform: translate(" + (2 * homeDiv.clientWidth / 5 + xSway) + "px, " + ((homeDiv.clientHeight / 5) + ySway / 10) + "px) scale(0.5, 0.5)";
        fish2.style = "transform: translate(" + (3 * homeDiv.clientWidth / 5 + xSway) + "px, " + ((7 * homeDiv.clientHeight / 8) + ySway / -10) + "px) scale(-0.5, -0.35)";
    }
}

homeDiv.addEventListener("mousemove", (e) => {
    // if (isMoonEnabled) {
    // }
    drawMoons(((canvas.width / 2) - e.clientX) * 0.1, ((canvas.height / 2) - e.clientY) * 0.2);
});

homeDiv.addEventListener('click', (e) => {
    ripples.unshift(initRipple(e.clientX, e.clientY));
});

function animateLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    drawRipples(ripples);

    requestAnimationFrame(animateLoop);
}
animateLoop();

// Workplace gallery
let expandedDiv = document.createElement("div");
for (let item of document.getElementsByClassName("workplace-card")) {
    if(expandedDiv.parentNode) {
        expandedDiv.parentNode.removeChild(expandedDiv);
    }
    item.addEventListener('click', () => {
        expandedDiv.style = "height: 600px;";
        expandedDiv.innerHTML = item.dataset.company;
        item.append(expandedDiv);
    });
}