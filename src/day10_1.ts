import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const cyclesToSum = [20,60,100,140,180,220]

let cycleCount = 1
let registerX = 1

let signalSum = 0

function updateSignalSum() {
    if (cyclesToSum.filter(cts => cts == cycleCount).length > 0) {
        signalSum += registerX
    }
}

for (const line of lines) {

    if (line === "noop") {
        updateSignalSum()
        cycleCount++
    }
    else {
        const addVal = parseInt(line.slice(5))
        updateSignalSum()
        cycleCount++
        updateSignalSum()
        cycleCount++
        registerX += addVal
    }
}

console.log(signalSum)