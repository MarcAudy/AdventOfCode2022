import * as fs from 'fs'

type Point = {
    x: number
    y: number
    z: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const points: Point[] = lines.map(line => { 
                                            let match = line.match(/(.*),(.*),(.*)/)
                                            return {x: parseInt(match[1])+1,
                                                    y: parseInt(match[2])+1,
                                                    z: parseInt(match[3])+1}
                                          })

const maxX = Math.max(...points.map(p => p.x)) + 2
const maxY = Math.max(...points.map(p => p.y)) + 2
const maxZ = Math.max(...points.map(p => p.z)) + 2

let grid = new Array(maxX + 1).fill(null).map(_ => new Array(maxY + 1).fill(null).map(_ => new Array(maxZ + 1)))

function getGridValue(p: Point) {
    return grid[p.x][p.y][p.z]
}

function setGridValue(p: Point, v) {
    grid[p.x][p.y][p.z] = v
}

for (const p of points) {
    setGridValue(p,1)
}

let pointsToConsider: Point[] = [{x: 0, y: 0, z: 0}]
setGridValue(pointsToConsider[0],0)

let exposedFaces = 0
while (pointsToConsider.length) {
    const curPoint = pointsToConsider.pop()

    let considerNextPoint = (nextPoint: Point) => {
        let p = getGridValue(nextPoint)
        if (p == 1) {
            exposedFaces++
        }
        else if (p === undefined) {
            pointsToConsider.push(nextPoint)
            setGridValue(nextPoint,0)
        }
    }

    if (curPoint.x > 0) {
        considerNextPoint({...curPoint, x:curPoint.x-1})
    }
    if (curPoint.x < maxX) {
        considerNextPoint({...curPoint, x:curPoint.x+1})
    }
    if (curPoint.y > 0) {
        considerNextPoint({...curPoint, y:curPoint.y-1})
    }
    if (curPoint.y < maxY) {
        considerNextPoint({...curPoint, y:curPoint.y+1})
    }
    if (curPoint.z > 0) {
        considerNextPoint({...curPoint, z:curPoint.z-1})
    }
    if (curPoint.z < maxZ) {
        considerNextPoint({...curPoint, z:curPoint.z+1})
    }

}

console.log(exposedFaces)