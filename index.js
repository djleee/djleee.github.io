const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

// canvas.addEventListener('click', (e) => {
//     console.log('canvas.click' + e.clientX + ', ' + e.clientY);

//     ctx.beginPath();
//     ctx.fillStyle = 'rgb(255,0,0)';
//     ctx.arc(
//         (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
//         (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height,
//         1,
//         0,
//         2 * Math.PI,
//         false
//     );
//     ctx.fill();
// });

function drawCircle(e, radius) {
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.strokeStyle= 'rgb(255,255,255)'
    ctx.arc(
        (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height,
        radius,
        0,
        2 * Math.PI
    );
    ctx.stroke();
}


let i = 1;
function loop(e) {
    setTimeout(() => {
        i++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(e, i);
        if (i < 1000) {
            loop(e);
        }
    }, 10);
}

canvas.addEventListener('click', (e) => {
    console.log('canvas.click' + e.clientX + ', ' + e.clientY);
    i = 1;
    loop(e);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

