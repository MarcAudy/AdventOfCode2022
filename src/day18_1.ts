import * as fs from 'fs'

type Point = {
    x: number
    y: number
    z: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const points: Point[] = lines.map(line => { 
                                            let match = line.match(/(.*),(.*),(.*)/)
                                            return {x: parseInt(match[1]),
                                                    y: parseInt(match[2]),
                                                    z: parseInt(match[3])}
                                          })

const maxX = Math.max(...points.map(p => p.x))
const maxY = Math.max(...points.map(p => p.y))
const maxZ = Math.max(...points.map(p => p.z))

let grid = new Array(maxX + 1).fill(null).map(_ => new Array(maxY + 1).fill(null).map(_ => new Array(maxZ + 1)))

for (const p of points) {
    grid[p.x][p.y][p.z] = 1
}

let exposedFaces = 0
for (const p of points) {

    if (p.z == 0 || grid[p.x][p.y][p.z-1] === undefined) { exposedFaces++ }
    if (p.z == maxZ || grid[p.x][p.y][p.z+1] === undefined) { exposedFaces++ }
    if (p.y == 0 || grid[p.x][p.y-1][p.z] === undefined) { exposedFaces++ }
    if (p.y == maxY || grid[p.x][p.y+1][p.z] === undefined) { exposedFaces++ }
    if (p.x == 0 || grid[p.x-1][p.y][p.z] === undefined) { exposedFaces++ }
    if (p.x == maxX || grid[p.x+1][p.y][p.z] === undefined) { exposedFaces++ }
}

console.log(exposedFaces)