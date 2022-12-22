import { assert } from 'console'
import { randomInt } from 'crypto'
import * as fs from 'fs'

type Point = {
    x: number
    y: number
}

const RIGHT = 0
const DOWN = 1
const LEFT = 2
const UP = 3

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let instructions = lines[lines.length-1]

const mapHeight = lines.length - 2
const mapWidth = Math.max(...lines.slice(0,-2).map(line => line.length))

let map = new Array(mapHeight).fill(null).map(_ => new Array(mapWidth))

for (let y=0; y < lines.length - 2; ++y) {
    const line = lines[y]
    for (let x=0; x < line.length; ++x) {
        if (line[x] === "." || line[x] === "#") {
            map[y][x] = line[x]
        }
    }
}

let curLocation: Point = {x: lines[0].indexOf("."), y: 0}
let curFacing = RIGHT

while (instructions.length > 0) {

    let match = instructions.match(/([0-9]+)([RL]*)/)

    let toMove = parseInt(match[1])
    let rotation = match[2] || undefined

    instructions = instructions.slice(match[0].length)

    if (curFacing === RIGHT) {
        while (toMove > 0) {
            toMove--
            let nextX
            if (curLocation.x < mapWidth - 1 && map[curLocation.y][curLocation.x+1] !== undefined) {
                nextX = curLocation.x + 1
            }
            else {
                nextX = map[curLocation.y].findIndex(v => v !== undefined)
            }
            if (map[curLocation.y][nextX] === "#") {
                break
            }
            curLocation.x = nextX
        }
    }
    else if (curFacing === LEFT) {
        while (toMove > 0) {
            toMove--
            let nextX
            if (curLocation.x > 0 && map[curLocation.y][curLocation.x-1] !== undefined) {
                nextX = curLocation.x - 1
            }
            else {
                for (nextX = mapWidth-1; map[curLocation.y][nextX] === undefined; --nextX);
            }
            if (map[curLocation.y][nextX] === "#") {
                break
            }
            curLocation.x = nextX
        }
    }
    else if (curFacing === UP) {
        while (toMove > 0) {
            toMove--
            let nextY
            if (curLocation.y > 0 && map[curLocation.y-1][curLocation.x] !== undefined) {
                nextY = curLocation.y - 1
            }
            else {
                for (nextY = mapHeight-1; map[nextY][curLocation.x] === undefined; --nextY);
            }
            if (map[nextY][curLocation.x] === "#") {
                break
            }
            curLocation.y = nextY
        }
    }
    else if (curFacing === DOWN) {
        while (toMove > 0) {
            toMove--
            let nextY
            if (curLocation.y < mapHeight - 1 && map[curLocation.y+1][curLocation.x] !== undefined) {
                nextY = curLocation.y + 1
            }
            else {
                for (nextY = 0; map[nextY][curLocation.x] === undefined; ++nextY);
            }
            if (map[nextY][curLocation.x] === "#") {
                break
            }
            curLocation.y = nextY
        }
    }

    if (rotation) {
        switch(curFacing) {
            case RIGHT:
                curFacing = (rotation === 'R' ? DOWN : UP)
                break

            case LEFT:
                curFacing = (rotation === 'R' ? UP : DOWN)
                break
        
            case UP:
                curFacing = (rotation === 'R' ? RIGHT : LEFT)
                break

            case DOWN:
                curFacing = (rotation === 'R' ? LEFT : RIGHT)
                break
        }
    }
}

console.log(1000 * (curLocation.y + 1) + 4 * (curLocation.x + 1) + curFacing)