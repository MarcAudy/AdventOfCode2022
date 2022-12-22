import { assert } from 'console'
import { randomInt } from 'crypto'
import * as fs from 'fs'

type Point = {
    x: number
    y: number
}

type Location = {
    face: number
    x: number
    y: number
    facing: number
}

const RIGHT = 0
const DOWN = 1
const LEFT = 2
const UP = 3

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let instructions = lines[lines.length-1]

const FACE_SIZE = 50

let faces = new Array(6).fill(null).map(_ => new Array(FACE_SIZE).fill(null).map(_ => new Array(FACE_SIZE)))

let FACE_STARTS: Point[] = [{x:50,y:0},
                            {x:0,y:150},
                            {x:0,y:100},
                            {x:50,y:50},
                            {x:50,y:100},
                            {x:100,y:0}]

for (let faceIndex = 0; faceIndex < FACE_STARTS.length; ++faceIndex) {
    const fs = FACE_STARTS[faceIndex]
    for (let y = 0; y < FACE_SIZE; y++) {
        let line = lines[fs.y + y]
        for (let x = 0; x < FACE_SIZE; x++) {
            faces[faceIndex][y][x] = line[fs.x + x]
        }
    }
}

let curLocation: Location = {face: 0, x: 0, y: 0, facing: RIGHT}

while (instructions.length > 0) {

    let match = instructions.match(/([0-9]+)([RL]*)/)

    let toMove = parseInt(match[1])
    let rotation = match[2] || undefined

    instructions = instructions.slice(match[0].length)

    while (toMove > 0) {
        toMove--

        let nextLocation = {...curLocation}

        if (curLocation.facing === RIGHT) {
            if (curLocation.x < FACE_SIZE - 1) {
                nextLocation.x++
            }
            else {
                switch(curLocation.face) {
                    case 0:
                        nextLocation.face = 5
                        nextLocation.x = 0
                        break

                    case 1:
                        nextLocation.face = 4
                        nextLocation.x = curLocation.y
                        nextLocation.y = FACE_SIZE - 1
                        nextLocation.facing = UP

                        break

                    case 2:
                        nextLocation.face = 4
                        nextLocation.x = 0
                        break

                    case 3:
                        nextLocation.face = 5
                        nextLocation.x = curLocation.y
                        nextLocation.y = FACE_SIZE - 1
                        nextLocation.facing = UP
                        break

                    case 4:
                        nextLocation.face = 5
                        nextLocation.x = FACE_SIZE - 1
                        nextLocation.y = FACE_SIZE - curLocation.y - 1
                        nextLocation.facing = LEFT
                        break

                    case 5:
                        nextLocation.face = 4
                        nextLocation.x = FACE_SIZE - 1
                        nextLocation.y = FACE_SIZE - curLocation.y - 1
                        nextLocation.facing = LEFT
                        break
                }
            }
        }
        else if (curLocation.facing === LEFT) {
            if (curLocation.x > 0) {
                nextLocation.x--
            }
            else {
                switch(curLocation.face) {
                    case 0:
                        nextLocation.face = 2
                        nextLocation.x = 0
                        nextLocation.y = 50 - curLocation.y - 1
                        nextLocation.facing = RIGHT
                        break

                    case 1:
                        nextLocation.face = 0
                        nextLocation.x = curLocation.y
                        nextLocation.y = 0
                        nextLocation.facing = DOWN
                        break

                    case 2:
                        nextLocation.face = 0
                        nextLocation.x = 0
                        nextLocation.y = 50 - curLocation.y - 1
                        nextLocation.facing = RIGHT
                        break

                    case 3:
                        nextLocation.face = 2
                        nextLocation.x = curLocation.y
                        nextLocation.y = 0
                        nextLocation.facing = DOWN
                        break

                    case 4:
                        nextLocation.face = 2
                        nextLocation.x = FACE_SIZE - curLocation.x - 1
                        break

                    case 5:
                        nextLocation.face = 0
                        nextLocation.x = FACE_SIZE - curLocation.x - 1
                        break
                }            
            }
        }
        else if (curLocation.facing === UP) {
            if (curLocation.y > 0) {
                nextLocation.y--
            }
            else {
                switch(curLocation.face) {
                    case 0:
                        nextLocation.face = 1
                        nextLocation.x = 0
                        nextLocation.y = curLocation.x
                        nextLocation.facing = RIGHT
                        break

                    case 1:
                        nextLocation.face = 2
                        nextLocation.y = FACE_SIZE - 1
                        break

                    case 2:
                        nextLocation.face = 3
                        nextLocation.x = 0
                        nextLocation.y = curLocation.x
                        nextLocation.facing = RIGHT
                        break

                    case 3:
                        nextLocation.face = 0
                        nextLocation.y = FACE_SIZE - 1
                        break

                    case 4:
                        nextLocation.face = 3
                        nextLocation.y = FACE_SIZE - 1
                        break

                    case 5:
                        nextLocation.face = 1
                        nextLocation.y = FACE_SIZE - 1
                        break
                }
            }
        }
        else if (curLocation.facing === DOWN) {
            if (curLocation.y < FACE_SIZE - 1) {
                nextLocation.y++
            }
            else {
                switch(curLocation.face) {
                    case 0:
                        nextLocation.face = 3
                        nextLocation.y = 0
                        break

                    case 1:
                        nextLocation.face = 5
                        nextLocation.y = 0
                        break

                    case 2:
                        nextLocation.face = 1
                        nextLocation.y = 0
                        break

                    case 3:
                        nextLocation.face = 4
                        nextLocation.y = 0
                        break

                    case 4:
                        nextLocation.face = 1
                        nextLocation.x = FACE_SIZE - 1
                        nextLocation.y = curLocation.x
                        nextLocation.facing = LEFT
                        break

                    case 5:
                        nextLocation.face = 3
                        nextLocation.x = FACE_SIZE - 1
                        nextLocation.y = curLocation.x
                        nextLocation.facing = LEFT
                        break
                }
            }
        }

        if (faces[nextLocation.face][nextLocation.y][nextLocation.x] === "#") {
            break
        }
        curLocation = nextLocation
    }

    if (rotation) {
        switch(curLocation.facing) {
            case RIGHT:
                curLocation.facing = (rotation === 'R' ? DOWN : UP)
                break

            case LEFT:
                curLocation.facing = (rotation === 'R' ? UP : DOWN)
                break
        
            case UP:
                curLocation.facing = (rotation === 'R' ? RIGHT : LEFT)
                break

            case DOWN:
                curLocation.facing = (rotation === 'R' ? LEFT : RIGHT)
                break
        }
    }
}

const mapX = curLocation.x + FACE_STARTS[curLocation.face].x
const mapY = curLocation.y + FACE_STARTS[curLocation.face].y

console.log(1000 * (mapY + 1) + 4 * (mapX + 1) + curLocation.facing)