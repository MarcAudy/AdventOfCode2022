import * as fs from 'fs'

const PART1 = false
const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const messageLength = (PART1 ? 4 : 14)

for (const line of lines) {
    for (let i = 0; i < line.length; ++i)
    {
        if (new Array(...new Set(line.slice(i,i+messageLength))).length == messageLength)
        {
            console.log(i+messageLength)
            break
        }
    }
}
