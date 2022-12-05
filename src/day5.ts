import * as fs from 'fs'

const PART1 = false
const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let lineCount = 0
while (lines[lineCount].length > 0) {
    ++lineCount
}

const stackLine = lines[lineCount-1]
const stackCount = parseInt(stackLine[stackLine.length-2])

let stacks: string[][] = []
for (let s = 0; s < stackCount; ++s)
{
    stacks[s] = []
}

for (let lc = lineCount-2; lc >= 0; --lc) {
    for (let s = 0; s < stackCount; ++s) {
        if (lines[lc][s*4+1] !== ' ') {
            stacks[s].push(lines[lc][s*4+1])
        }
    }
}

for (let lc = lineCount+1; lc < lines.length; ++lc)
{
    const match = lines[lc].match(/move (.*) from (.*) to (.*)/)
    let moveCount = parseInt(match[1])
    const source = parseInt(match[2])-1
    const dest = parseInt(match[3])-1

    if (PART1) {
        while (moveCount > 0) {
            stacks[dest].push(stacks[source].pop())
            --moveCount
        }
    }
    else {
        const toMove = stacks[source].slice(-moveCount)
        stacks[dest] = stacks[dest].concat(...toMove)
        stacks[source] = stacks[source].slice(0,-moveCount)
    }
}

let result = ''
for (const stack of stacks) {
    result += stack[stack.length-1]
}

console.log(result)