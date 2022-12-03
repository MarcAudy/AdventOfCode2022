import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let priSum = 0
for (let i = 0; i < lines.length; i += 3) {

    const r1 = new Set(new Array(...lines[i]))
    const r2 = new Set(new Array(...lines[i+1]))
    const r3 = new Set(new Array(...lines[i+2]))

    const intersect = new Set([...r1].filter(i => r2.has(i) && r3.has(i)));
    const ch1 = new Array(...intersect)[0]

    if (ch1 >= 'a' && ch1 <= 'z') {
        const pri = ch1.charCodeAt(0) - 'a'.charCodeAt(0) + 1
        priSum += pri
    }
    else {
        const pri = ch1.charCodeAt(0) - 'A'.charCodeAt(0) + 27
        priSum += pri
    }
}

console.log(priSum)