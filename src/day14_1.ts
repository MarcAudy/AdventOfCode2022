import { assert } from 'console'
import * as fs from 'fs'

type Point = {
    x: number
    y: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let caveWidthMax = 500
let caveWidthMin = 500
let caveDepth = 0

let rockFormations = []
for (const line of lines) {
    let endPoints: any[] = line.split("->")
    for (let i in endPoints) {
        const xy = endPoints[i].split(",")
        endPoints[i] = {x: parseInt(xy[0]), y: parseInt(xy[1])}
        caveWidthMax = Math.max(caveWidthMax, endPoints[i].x)
        caveWidthMin = Math.min(caveWidthMin, endPoints[i].x)
        caveDepth = Math.max(caveDepth, endPoints[i].y)
    }
    rockFormations.push(endPoints)
}

let cave = new Array(caveWidthMax+1).fill([]).map(_ => new Array(caveDepth+1))

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

function printCave() {

    for (let y=0; y <= caveDepth; ++y) {
        let row = ''
        for (let x=caveWidthMin; x <= caveWidthMax; ++x)
        {
            row += (cave[x][y] === undefined ? '.' : cave[x][y])
        }
        console.log(row)
    }
    console.log()
}

let sandCount = 0
while(true) {
    let sandPoint = {x:500,y:0}

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

        if (sandPoint.y == caveDepth) {
            break
        }
    }

    if (sandPoint.y == caveDepth) {
        break
    }
}

console.log(sandCount)