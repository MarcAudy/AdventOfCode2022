import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let cycleCount = 0
let spriteX = 1

let pixels = ""

function drawPixel() {
    const curX = cycleCount % 40
    if (curX >= spriteX - 1 && curX <= spriteX + 1) {
        pixels += "#"
    }
    else {
        pixels += "."
    }
}

for (const line of lines) {

    if (line === "noop") {
        drawPixel()
        cycleCount++
    }
    else {
        const addVal = parseInt(line.slice(5))
        drawPixel()
        cycleCount++
        drawPixel()
        cycleCount++
        spriteX += addVal
    }
}

for (let i=0; i < 6; ++i) {
    console.log(pixels.slice(i*40,(i*40)+40))
}