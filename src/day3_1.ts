import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let priSum = 0
for (const line of lines) {

    const c1 = new Set(new Array(...line).slice(0, line.length/2))
    const c2 = new Set(new Array(...line).slice(line.length/2))

    const intersect = new Set([...c1].filter(i => c2.has(i)));
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