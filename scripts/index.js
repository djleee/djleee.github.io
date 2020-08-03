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

// Update moon phase!
// Original Snippet: https://gist.github.com/endel/dfe6bb2fbe679781948c
const MoonOverlayCircleStyles = [
    "r: 9.5%", // new-moon
    "transform: translateX(-5%)",   // waxing-crescent-moon
    "display: none",                // quarter-moon
    "transform: translateX(-10%)",  // waxing-gibbous-moon
    "display: none",                // full-moon
    "transform: translateX(10%)",   // waning-gibbous-moon
    "display: none",                // last-quarter-moon
    "transform: translateX(5%)",    // waning-crescent-moon
]
const MoonOverlayRectangleStyles = [
    "display: none",                            // new-moon
    "display: none",                            // waxing-crescent-moon
    "x: 0; y: 0; height: 100%; width: 50%",     // quarter-moon
    "display: none",                            // waxing-gibbous-moon
    "display: none",                            // full-moon
    "display: none",                            // waning-gibbous-moon
    "x: 50%; y: 0; height: 100%; width: 50%",   // last-quarter-moon
    "display: none",                            // waning-crescent-moon
]
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate()
let c = e = jd = b = 0;
if (month < 3) {
    year--;
    month += 12;
}
++month;
c = 365.25 * year;
e = 30.6 * month;
jd = c + e + day - 694039.09; // jd is total days elapsed
jd /= 29.5305882; // divide by the moon cycle
b = parseInt(jd); // int(jd) -> b, take integer part of jd
jd -= b; // subtract integer part to leave fractional part of original jd
b = Math.round(jd * 8); // scale fraction from 0-8 and round
if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0

moonOverlayCircle.style = MoonOverlayCircleStyles[b];
moonOverlayRectangle.style = MoonOverlayRectangleStyles[b];


//Home Scroll down button
function homeDownButtonAction() {
    document.getElementById('about').scrollIntoView({block: "center",behavior: "smooth"});
}
homeDownButton.addEventListener('click', homeDownButtonAction);
homeDownButton.addEventListener('keypress', (e) => {if (e.keyCode == 13) {homeDownButtonAction();} });
