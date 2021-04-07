// Constants
const MAX_RIPPLE_SIZE = 300;
const RAIN_ENABLED_CLASS = "fas fa-tint";
const RAIN_DISABLED_CLASS = "fas fa-tint-slash";
const MOON_ENABLED_CLASS = "fas fa-moon";
const MOON_DISABLED_CLASS = "fas fa-fish";
const LIGHT_ENABLED_CLASS = "far fa-lightbulb";

// HTML Element Variables and friends
const stylesheet = document.getElementById("stylesheet");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
const rainToggle = document.getElementById("rain-toggle");
const rainToggleIcon = document.getElementById("rain-toggle-icon");
const moonToggle = document.getElementById("moon-toggle");
const moonToggleIcon = document.getElementById("moon-toggle-icon");
const lightToggle = document.getElementById("light-toggle");

const homeDownButton = document.getElementById("home-down-button");

const homeDiv = document.getElementById("home");
const moon = document.getElementById("moon-group");
const moonOverlayCircle = document.getElementById("moon-overlay-circle");
const moonOverlayRectangle = document.getElementById("moon-overlay-rectangle");
const fish = document.getElementById("fish");

// State Variables
let isRaining = false;
let isMoonEnabled = true;
let isDarkEnabled = true;

//Helper Functions
// Reset Canvas size to window
function initCanvases() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    rect = canvas.getBoundingClientRect();
    drawMoonFish(0, 0);
}
// Helper function to generate color rgb string
function generateColor(t) {
    return `rgba(245, 245, 245, ${t})`
}
function generateInvertedColor(t) {
    return `rgba(12, 12, 12, ${t})`
}
// Helper to create a ripple object
function initRipple(x, y) {
    return {
        x: x,
        y: y,
        r: 1,
        delta: 1
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
        // Inverted color wave 1 smaller
        ctx.beginPath();
        ctx.strokeStyle = generateInvertedColor((Math.max(MAX_RIPPLE_SIZE - (rips[i].r), 0) / MAX_RIPPLE_SIZE));
        ctx.arc(
            (rips[i].x - rect.left) / (rect.right - rect.left) * canvas.width,
            (rips[i].y - rect.top) / (rect.bottom - rect.top) * canvas.height,
            rips[i].r-1,
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
        fish.style = "display: ";
    } else {
        moonToggleIcon.className = MOON_ENABLED_CLASS;
        moon.style = "display: ";
        fish.style = "display: none";
    }
    isMoonEnabled = !isMoonEnabled;
    drawMoonFish(0, 0);
});
lightToggle.addEventListener('click', () => {
    if (isDarkEnabled) {
        stylesheet.href = "styles/index_light.css";
        fish.href.baseVal="./images/koi-black.png";
    } else {
        stylesheet.href = "styles/index.css";
        fish.href.baseVal="./images/koi-white.png";
    }
    isDarkEnabled = !isDarkEnabled;
})


// Home Canvas
function drawMoonFish(xSway, ySway) {
    if (isMoonEnabled) {
        moon.style = "transform: translate(" + xSway + "px, " + ySway / 10 + "px)";
    } else {
        fish.style = "transform: translate(" + (xSway - (fish.width.baseVal.value/2)) + "px, " + ((ySway / 10) - (fish.height.baseVal.value/2)) + "px)";
    }
}

homeDiv.addEventListener("mousemove", (e) => {
    drawMoonFish(((canvas.width / 2) - e.clientX) * 0.1, ((canvas.height / 2) - e.clientY) * 0.2);
});
window.addEventListener("deviceorientation", (event) => {
    drawMoonFish(event.gamma*1.5, event.beta*1.5);
}, true);

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


//Home Scroll down button
function homeDownButtonAction() {
    document.getElementById('about').scrollIntoView({block: "center",behavior: "smooth"});
}
homeDownButton.addEventListener('click', homeDownButtonAction);
homeDownButton.addEventListener('keypress', (e) => {if (e.keyCode == 13) {homeDownButtonAction();} });
