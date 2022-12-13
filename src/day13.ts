import { assert } from 'console'
import * as fs from 'fs'

const PART1 = false

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

function parseList(line) {
    
    if (line[0] !== '[') {
        return parseInt(line)
    }

    if (line.length == 2) {
        return []
    }

    let elements = []
    
    let nestLevel = 0
    let elementStart = 1
    for (let ch = 1; ch < line.length - 1; ++ch)
    {
        if (line[ch] === "[") {
            ++nestLevel
        }
        else if (line[ch] === "]") {
            --nestLevel
        }
        else if (line[ch] === ",") {
            if (nestLevel == 0) {
                elements.push(parseList(line.slice(elementStart,ch)))
                elementStart = ch+1
            }
        }
    }
    elements.push(parseList(line.slice(elementStart,-1)))
    return elements
}

function compareLists(left, right) {

    let element = 0

    while(true)
    {
        if (left.length == element) {
            return (left.length == right.length ? '=' : '<')
        }
        else if (right.length == element) {
            return '>'
        }
        else if (typeof left[element] === "number") {
            if (typeof right[element] === "number") {
                if (left[element] < right[element]) {
                    return '<'
                }
                else if (left[element] > right[element]) {
                    return '>'
                }
            }
            else {
                const compare = compareLists([left[element]], right[element])
                if (compare !== '=') {
                    return compare
                }
            }
        }
        else {
            if (typeof right[element] === "number") {
                const compare = compareLists(left[element], [right[element]])
                if (compare !== '=') {
                    return compare
                }
            }
            else {
                const compare = compareLists(left[element], right[element])
                if (compare !== '=') {
                    return compare
                }
            }
        }
        ++element
    }
}

if (PART1) {
    let correctSum = 0

    for (let i = 0, pairCount = 1; i < lines.length; i+=3, ++pairCount) {
        const left = parseList(lines[i])
        const right = parseList(lines[i+1])

        const compare = compareLists(left, right)

        if (compare === '<') {
            correctSum += pairCount
        }
    }

    console.log(correctSum)
}
else {
    let packets = []

    packets.push(parseList("[[2]]"))
    packets.push(parseList("[[6]]"))
    
    for (let line of lines)
    {
        if (line.length > 0)
        {
            packets.push(parseList(line))
        }
    }
    
    packets.sort((a, b) => compareLists(a,b) === '<' ? -1 : 1)
    
    let decoderKey = 1
    for (let i = 0; i < packets.length; ++i)
    {
        if (packets[i].length == 1) {
            if (typeof packets[i][0] !== "number") {
                if (packets[i][0].length == 1) {
                    if (packets[i][0][0] == 2 || packets[i][0][0] == 6) {
                        decoderKey *= i+1
                    }
                }
            }
        }
    }
    
    console.log(decoderKey)    
}