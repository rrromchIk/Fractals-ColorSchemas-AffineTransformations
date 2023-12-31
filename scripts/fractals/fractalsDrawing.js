const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

const drawSinCosFractal = (zoom, iterations, hue) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const zx = ((x / canvas.width) * 4 - 2) / zoom
            const zy = ((y / canvas.height) * 4 - 2) / zoom

            let a = zx
            let b = zy
            let iteration = 0

            while (iteration < iterations) {
                const aSquared = a * a
                const bSquared = b * b
                if (aSquared + bSquared > 200) {
                    ctx.fillStyle = '#000000'
                    ctx.fillRect(x, y, 1, 1)
                    break;
                }

                // Fractal sin(z) * cos(z)
                const newA = Math.sin(a) * Math.cos(a) - Math.sinh(b) * Math.cosh(b) + zx;
                const newB = Math.sin(a) * Math.cosh(b) + Math.cos(a) * Math.sinh(b) + zy;

                a = newA
                b = newB
                iteration++
            }

            const saturation = ((iterations - iteration) / iterations) * 100
            const color = `hsl(${hue - iteration * 5}, ${saturation}%, 50%)`

            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1)
        }
    }
}

const drawChFractal = (zoom, iterations, hue) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const zx = ((x / canvas.width) * 4 - 2) / zoom
            const zy = ((y / canvas.height) * 4 - 2) / zoom

            let a = zx
            let b = zy
            let iteration = 0

            let ca = 0.2 //[-1, 1]
            let cb = 0.8

            while (iteration < iterations) {
                const aSquared = a * a
                const bSquared = b * b
                if (aSquared + bSquared > 100) {
                    ctx.fillStyle = '#000000'
                    ctx.fillRect(x, y, 1, 1)
                    break;
                }

                // Fractal cosh(z)
                const newA = Math.cosh(a) * Math.cos(b) + ca
                const newB = Math.sinh(a) * Math.sin(b) + cb

                a = newA
                b = newB
                iteration++
            }

            const saturation = ((iterations - iteration) / iterations) * 100
            const color = `hsl(${hue - iteration * 5}, ${saturation}%, 50%)`
            ctx.fillStyle = color
            ctx.fillRect(x, y, 1, 1)
        }
    }
}

const axiom = 'F';
const rule = 'F=F+F--F+F';
const anglePlus = 85;
const angleMinus = 85;
let currentSentence = axiom;
let currentLength = 0;

function applyRules(sentence) {
    const rulesArray = rule.split(';')
    for (const r of rulesArray) {
        const [predecessor, successor] = r.split('=')
        const regex = new RegExp(predecessor, 'g')
        sentence = sentence.replace(regex, successor)
    }
    return sentence;
}

function draw(width, height, rotationAngle = 0) {
    ctx.beginPath()
    ctx.save()
    ctx.translate(width, height) // Start drawing from the bottom center
    ctx.rotate((rotationAngle * Math.PI) / 180)

    for (const char of currentSentence) {
        if (char === 'F') {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -currentLength)
            ctx.translate(0, -currentLength)
        } else if (char === '+') {
            ctx.rotate((anglePlus * Math.PI) / 180)
        } else if (char === '-') {
            ctx.rotate((-angleMinus * Math.PI) / 180)
        }
    }

    ctx.stroke()
    ctx.restore()
}

function drawCezaroFractal(zoom, iteration, hue) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentSentence = axiom;

    const initialLength = (Math.min(canvas.width, canvas.height)) * zoom * Math.pow(0.725, -iteration)
    const a = initialLength * Math.pow(0.725, iteration)
    currentLength = initialLength

    for (let i = 0; i < iteration; i++) {
        currentSentence = applyRules(currentSentence)
        console.log(currentSentence);
        currentLength /= 3 // Reduce the length for each iteration
    }

    const color = `hsl(${hue}, ${100}%, 50%)`
    if (ctx) {
        ctx.strokeStyle = color
    }

    const centerDelta = (Math.abs(canvas.width - canvas.height) / 2) / zoom

    draw(canvas.width - centerDelta, canvas.height, -90)
    draw(canvas.width - centerDelta, canvas.height - a, 180)
    draw(canvas.width - centerDelta - a, canvas.height, 0)
    draw(canvas.width - centerDelta - a, canvas.height - a, 90)
}


