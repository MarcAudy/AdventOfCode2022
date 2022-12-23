import { assert } from 'console'
import * as fs from 'fs'

type Point = {
    x: number
    y: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let elves: Map<number, Set<number>> = new Map()

function addElf(x,y) {
    let elvesAtY = elves.get(y)
    if (elvesAtY) {
        elvesAtY.add(x)
    }
    else {
        elves.set(y, new Set([x]))
    }
}

function isElfAt(x,y) {
    const elvesAtY = elves.get(y)
    return elvesAtY && elvesAtY.has(x)
}

enum AdjacencyMode {
    All,
    North,
    South,
    East,
    West,
}

function getNextMove(p: Point, mode): Point {
    switch(mode) {
        case AdjacencyMode.North:
            return {x: p.x, y: p.y - 1}
        case AdjacencyMode.South:
            return {x: p.x, y: p.y + 1}
        case AdjacencyMode.East:
            return {x: p.x + 1, y: p.y}
        case AdjacencyMode.West:
            return {x: p.x - 1, y: p.y}
    }
    assert()
}

function isElfAdjacent(x,y,mode) {

    let xOffsets = (mode == AdjacencyMode.East ? [1] : (mode == AdjacencyMode.West ? [-1] : [-1,0,1]))
    let yOffsets = (mode == AdjacencyMode.South ? [1] : (mode == AdjacencyMode.North ? [-1] : [-1,0,1]))

    for (let xOffset of xOffsets) {
        for (let yOffset of yOffsets) {
            if (xOffset != 0 || yOffset != 0) {
                if (isElfAt(x+xOffset,y+yOffset)) {
                    return true
                }
            }               
        }
    }

    return false
}

function checkStatus() {
    let elfCount = 0
    let elfMinRange: Point = {x: 1000000000, y: 1000000000 }
    let elfMaxRange: Point = {x: -1000000000, y: -1000000000 }
    
    elves.forEach((exes, y) => {
        if (exes.size > 0) {
            elfCount += exes.size
            exes.forEach(x => {
                elfMinRange.x = Math.min(elfMinRange.x, x)
                elfMaxRange.x = Math.max(elfMaxRange.x, x)   
            })
            elfMinRange.y = Math.min(elfMinRange.y, y)
            elfMaxRange.y = Math.max(elfMaxRange.y, y)
        }
    })
    
    console.log(`PART1: ${(elfMaxRange.x - elfMinRange.x + 1) * (elfMaxRange.y - elfMinRange.y + 1) - elfCount}`)    
}

lines.forEach((line, y) => [...line].forEach((ch, x) => { if (ch === "#") { addElf(x,y) }} ))

let adjacencyCheckOrder = [AdjacencyMode.North, AdjacencyMode.South, AdjacencyMode.West, AdjacencyMode.East]
let round = 0
while (true)
{
    round++

    let elvesToConsider: Point[] = []
    let stationaryElves: Point[] = []
    let nextMoves: Map<string, Point[]> = new Map()
    
    elves.forEach((exes, y) => exes.forEach(x => {
        (isElfAdjacent(x,y, AdjacencyMode.All) ? elvesToConsider : stationaryElves).push({x,y})
    }))

    if (elvesToConsider.length == 0) {
        break
    }

    for (let elfToConsider of elvesToConsider) {
        for (let adjacency of adjacencyCheckOrder) {
            if (!isElfAdjacent(elfToConsider.x, elfToConsider.y, adjacency)) {
                const nextPoint = getNextMove(elfToConsider, adjacency)
                const nextPointKey = `${nextPoint.x},${nextPoint.y}`
                let points = nextMoves.get(nextPointKey)
                if (!points) {
                    nextMoves.set(nextPointKey, [nextPoint, elfToConsider])
                }
                else {
                    points.push(elfToConsider)
                }
                break
            }
        }
    }

    adjacencyCheckOrder = [...adjacencyCheckOrder.slice(1), adjacencyCheckOrder[0]]

    nextMoves.forEach((points, nextMove) => {
        if (points.length == 2) {
            elves.get(points[1].y).delete(points[1].x)
            addElf(points[0].x, points[0].y)
        }
    })

    if (round == 10) {
        checkStatus()
    }
}

console.log(`PART2: ${round}`)