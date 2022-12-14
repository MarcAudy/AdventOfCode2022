import { assert } from 'console'
import * as fs from 'fs'

const PART1 = true

type Point = {
    x: number
    y: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let SAND_SOURCE = 500

let caveWidthMax = SAND_SOURCE
let caveWidthMin = SAND_SOURCE
let caveDepth = 0

let rockFormations = []
for (const line of lines) {
    let endPoints: any[] = line.split("->")
    for (let i in endPoints) {
        const xy = endPoints[i].split(",")
        endPoints[i] = {x: parseInt(xy[0]), y: parseInt(xy[1])}
        caveDepth = Math.max(caveDepth, endPoints[i].y)
    }
    rockFormations.push(endPoints)
}

if (!PART1) {
    caveDepth += 2
}

let cave = new Array(SAND_SOURCE+caveDepth).fill([]).map(_ => new Array(caveDepth+1))

if (!PART1) {
    cave.forEach(column => column[caveDepth] = "#")
}

for (const rockFormation of rockFormations) {
    let src = rockFormation[0]
    for (let destIndex = 1; destIndex < rockFormation.length; ++destIndex) {
        let dest = rockFormation[destIndex]

        if (src.x == dest.x) {
            for (let y = Math.min(src.y,dest.y); y <= Math.max(src.y,dest.y); ++y) {
                cave[src.x][y] = "#"
            }
        }
        else {
            for (let x = Math.min(src.x,dest.x); x <= Math.max(src.x,dest.x); ++x) {
                cave[x][src.y] = "#"
            }

        }

        src = dest
    }
}

function finished(sandPoint) {
    if (PART1) {
        if (sandPoint.y == caveDepth) {
            return true
        }
    }
    else if (sandPoint.x == SAND_SOURCE && sandPoint.y == 0) {
        return true
    }

    return false
}

let sandCount = 0
while(true) {
    let sandPoint = {x:SAND_SOURCE,y:0}

    while(true) {
        if (cave[sandPoint.x][sandPoint.y+1] === undefined) {
            sandPoint.y++
        }
        else {
            if (cave[sandPoint.x-1][sandPoint.y+1] === undefined) {
                sandPoint.x--
                sandPoint.y++
            }
            else if (cave[sandPoint.x+1][sandPoint.y+1] === undefined) {
                sandPoint.x++
                sandPoint.y++
            }
            else {
                cave[sandPoint.x][sandPoint.y] = "o"
                sandCount++
                break   
            }
        }

        if (finished(sandPoint)) {
            break
        }
    }

    if (finished(sandPoint)) {
        break
    }
}

console.log(sandCount)