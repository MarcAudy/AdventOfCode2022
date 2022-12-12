import * as fs from 'fs'

const PART1 = false

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

type Point = {
    x: number
    y: number
}

let pointsToConsider = []

const grid = lines.map(line => new Array(line.length))

const height = lines.length
const width = lines[0].length

const startNode = (PART1 ? "S" : "E")
const targetNode = (PART1 ? "E" : "a") // This assumes part 2 will be shorter, it could fail if the shortest point was the origina 'S'

let startPoint
for (let y = 0; y < lines.length && !startPoint; ++y) {
    const S = lines[y].indexOf(startNode)
    if (S != -1) { startPoint = {x: S, y} }
}

grid[startPoint.y][startPoint.x] = 0
pointsToConsider.push(startPoint)

function getCharCode(loc) {
    if (loc === "S") { loc = "a" }
    else if (loc === "E") { loc = "z" }
    return loc.charCodeAt(0)
}

function validDest(src, dest) {

    const srcCharCode = getCharCode(src)
    const destCharCode = getCharCode(dest)
    if (PART1) {
        return (srcCharCode + 1 >= destCharCode) 
    }
    else {
        return (srcCharCode - 1 <= destCharCode)
    }
}

function considerDest(srcPoint, destPoint) {
    if (grid[destPoint.y][destPoint.x] === undefined) {
        if (validDest(lines[srcPoint.y][srcPoint.x], lines[destPoint.y][destPoint.x])) {
            if (lines[destPoint.y][destPoint.x] === targetNode) {
                console.log(grid[srcPoint.y][srcPoint.x] + 1)
                return true
            }
            grid[destPoint.y][destPoint.x] = grid[srcPoint.y][srcPoint.x] + 1
            pointsToConsider.push(destPoint)
        }
    }
    return false
}

while (pointsToConsider.length)
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