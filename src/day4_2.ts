import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let contained = 0
for (const line of lines) {

    const match = line.match(/(.*)-(.*),(.*)-(.*)/)

    const r1min = parseInt(match[1])
    const r1max = parseInt(match[2])
    const r2min = parseInt(match[3])
    const r2max = parseInt(match[4])

    if (!(r1max < r2min || r2max < r1min))
    {
        contained++
    }


}

console.log(contained)