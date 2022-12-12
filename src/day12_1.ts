import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

type Point = {
    x: number
    y: number
}

let startPoint

let pointsToConsider = []

const grid = lines.map(line => new Array(line.length))

const height = lines.length
const width = lines[0].length

for (let y = 0; y < lines.length && !startPoint; ++y) {
    const S = lines[y].indexOf("S")

    if (S != -1) { startPoint = {x: S, y} }
}

grid[startPoint.y][startPoint.x] = 0
pointsToConsider.push(startPoint)

function validDest(src, dest) {
    const srcCharCode = (src === "S" ? "a".charCodeAt(0) : src.charCodeAt(0))
    const destCharCode = (dest === "E" ? "z".charCodeAt(0) : dest.charCodeAt(0))
    return (srcCharCode + 1 >= destCharCode) 
}

function considerDest(srcPoint, destPoint) {
    if (grid[destPoint.y][destPoint.x] === undefined) {
        if (validDest(lines[srcPoint.y][srcPoint.x], lines[destPoint.y][destPoint.x])) {
            if (lines[destPoint.y][destPoint.x] === "E") {
                console.log(grid[srcPoint.y][srcPoint.x] + 1)
                return true
            }
            grid[destPoint.y][destPoint.x] = grid[srcPoint.y][srcPoint.x] + 1
            pointsToConsider.push(destPoint)
        }
    }
    return false
}

while (true)
{
    const curPoint = pointsToConsider[0]
    pointsToConsider = pointsToConsider.slice(1)

    if (curPoint.x > 0) {
        const destPoint = {x:curPoint.x-1, y:curPoint.y}
        if (considerDest(curPoint, destPoint)) { break }
    }
    if (curPoint.x < width - 1) {
        const destPoint = {x:curPoint.x+1, y:curPoint.y}
        if (considerDest(curPoint, destPoint)) { break }
    }
    if (curPoint.y > 0) {
        const destPoint = {x:curPoint.x, y:curPoint.y-1}
        if (considerDest(curPoint, destPoint)) { break }
    }
    if (curPoint.y < height - 1) {
        const destPoint = {x:curPoint.x, y:curPoint.y+1}
        if (considerDest(curPoint, destPoint)) { break }
    }
}

