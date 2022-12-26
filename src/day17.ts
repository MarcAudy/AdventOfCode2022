import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let startTime = new Date().getTime()

const rocks = [[[2,3,4,5]], //["@@@@"],

               [[3],        //[".@.",
                [2,3,4],    // "@@@",
                [3]],       // ".@."],
            
               [[4],        //["..@",
                [4],        // "..@",
                [2,3,4]],   // "@@@"],

               [[2],        //["@",
                [2],        // "@",
                [2],        // "@",
                [2]],       // "@",

              [[2,3],       //["@@",
               [2,3]]       // "@@"]
            ] 

const PART1 = true
const CHAMBER_WIDTH = 7
const ROCKS_TO_SPAWN = (PART1 ? 2022 : 1000000000000)

enum LocationElement {
    Empty,
    AtRestRock,
    FallingRock
}

const ELEMENT_MASK = 0x3
const ElementSymbols = new Map([[LocationElement.Empty, '.'],[LocationElement.AtRestRock,'#'],[LocationElement.FallingRock,'@']])

let chamber: number[] = []

function getElement(row, col) {
    const shiftBy = col * 2
    return (chamber[row] & (ELEMENT_MASK << shiftBy)) >> shiftBy
}

function setElement(row, col, element) {
    const shiftBy = col * 2
    chamber[row] &= ~(ELEMENT_MASK << shiftBy)
    chamber[row] |= element << shiftBy
}

function drawChamber() {
    for (let i=chamber.length-1; i>=0; i--) {
        let row = '|'
        for (let c=0; c < CHAMBER_WIDTH; c++) {
            row += ElementSymbols.get(getElement(i,c))
        }
        row += '|'
        console.log(row)
    }
    console.log("+-------+")
    console.log()
}

let gustIndex = 0
let spawnedRocks = 0
let rockIndex = 0
let curRock: number[][]
let spawnNewRock = true
let bottomOfRockRow

let trackCycles = !PART1
let chamberAdditionalLength = 0
let seenSpawns = new Map()

while (true) {

    if (spawnNewRock) {

        if (spawnedRocks == ROCKS_TO_SPAWN) {
            break
        }

        if (trackCycles) {
            const spawnKey = rockIndex | (gustIndex << 3)
            let seenSpawn = seenSpawns.get(spawnKey)
            if (seenSpawn) {
                if (seenSpawn.length > 1) {
                    let segment1 = seenSpawn[seenSpawn.length-2]
                    let segment1SpawnedRocks = segment1[0]
                    let segment1Start = segment1[1]

                    let segment2 = seenSpawn[seenSpawn.length-1]
                    let segment2SpawnedRocks = segment2[0]
                    let segment2Start = segment2[1]

                    let rocksSpawnedDuringSegment1 = segment2SpawnedRocks - segment1SpawnedRocks
                    let segment1Length = segment2Start - segment1Start
                    let cycle = segment1Length == chamber.length - segment2Start && rocksSpawnedDuringSegment1 == spawnedRocks - segment2SpawnedRocks
                    for (let i=0; cycle && i < segment1Length; ++i) {
                        cycle = (chamber[segment1Start+i] == chamber[segment2Start+i])
                    }
                    if (cycle) {
                        trackCycles = false
                        let cycleRepeats = Math.floor((ROCKS_TO_SPAWN - spawnedRocks) / rocksSpawnedDuringSegment1)
                        chamberAdditionalLength = cycleRepeats * segment1Length
                        spawnedRocks += cycleRepeats * rocksSpawnedDuringSegment1
                    }
                    else
                    {
                        seenSpawn.push([spawnedRocks, chamber.length])
                    }
                }
                else {
                    seenSpawn.push([spawnedRocks, chamber.length])
                }
            }
            else {
                seenSpawns.set(spawnKey,[[spawnedRocks, chamber.length]])
            }
        }

        if (spawnedRocks == ROCKS_TO_SPAWN) {
            break
        }

        curRock = rocks[rockIndex]
        
        for (let eIndex = 0; eIndex < 3; ++eIndex) {
            chamber.push(0)
        }
        bottomOfRockRow = chamber.length
        for (let rIndex = curRock.length-1; rIndex >= 0; --rIndex) {
            chamber.push(0)
            for (const cIndex of curRock[rIndex]) {
                setElement(chamber.length-1,cIndex,LocationElement.FallingRock)
            }
        }
        spawnedRocks++
        spawnNewRock = false
        rockIndex = (rockIndex + 1) % rocks.length
    }

    //drawChamber()
    const moveLeft = (lines[0][gustIndex] === "<")
    gustIndex = (gustIndex + 1) % lines[0].length

    let canMove = true
    for (let rowIndex=bottomOfRockRow; rowIndex < bottomOfRockRow+curRock.length; ++rowIndex) {
        if (moveLeft) {
            let index
            for (index=0; index < CHAMBER_WIDTH; ++index) {
                if (getElement(rowIndex, index) == LocationElement.FallingRock)
                    break
            }
            if (index == 0 || getElement(rowIndex, index-1) == LocationElement.AtRestRock) {
                canMove = false
                break
            }
        }
        else {
            let index
            for (index=CHAMBER_WIDTH - 1; index >= 0; --index) {
                if (getElement(rowIndex, index) == LocationElement.FallingRock)
                    break
            }
            if (index == CHAMBER_WIDTH - 1 || getElement(rowIndex, index+1) == LocationElement.AtRestRock) {
                canMove = false
                break
            }
        }
    }

    if (canMove) {
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            if (moveLeft) {
                for (let i=0; i < CHAMBER_WIDTH-1; ++i) {
                    if (getElement(bottomOfRockRow+rIndex, i+1) == LocationElement.FallingRock) {
                        setElement(bottomOfRockRow+rIndex, i, LocationElement.FallingRock)
                        setElement(bottomOfRockRow+rIndex, i+1, LocationElement.Empty)
                    }
                }
            }
            else {
                for (let i=CHAMBER_WIDTH-1; i > 0; --i) {          
                    if (getElement(bottomOfRockRow+rIndex, i-1) == LocationElement.FallingRock) {
                        setElement(bottomOfRockRow+rIndex, i, LocationElement.FallingRock)
                        setElement(bottomOfRockRow+rIndex, i-1, LocationElement.Empty)
                    }
                }
            }
        }
    }

    let atRest = bottomOfRockRow == 0
    if (!atRest) {
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            for (let i = 0; i < CHAMBER_WIDTH; ++i) {
                if (getElement(bottomOfRockRow+rIndex,i) == LocationElement.FallingRock && getElement(bottomOfRockRow+rIndex-1,i) == LocationElement.AtRestRock) {
                    atRest = true
                    break
                }
            }
        }
    }

    if (atRest) {
        spawnNewRock = true
        let sliceRow
        for (let rIndex=curRock.length-1; rIndex >= 0; --rIndex) {
            for (let i = 0; i < CHAMBER_WIDTH; ++i) {
                if (getElement(bottomOfRockRow+rIndex,i) == LocationElement.FallingRock) { 
                    setElement(bottomOfRockRow+rIndex,i,LocationElement.AtRestRock)
                }
            }
        }
    }
    else {
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            for (let i = 0; i < CHAMBER_WIDTH; ++i) {
                if (getElement(bottomOfRockRow+rIndex,i) == LocationElement.FallingRock) {
                    setElement(bottomOfRockRow+rIndex-1,i,LocationElement.FallingRock)
                }
                else if (getElement(bottomOfRockRow+rIndex-1,i) == LocationElement.FallingRock) {
                    setElement(bottomOfRockRow+rIndex-1,i,LocationElement.Empty)
                }
            }
        }
        
        for (let i = 0; i < CHAMBER_WIDTH; ++i) {
            if (getElement(bottomOfRockRow+curRock.length-1,i) == LocationElement.FallingRock) {
                setElement(bottomOfRockRow+curRock.length-1,i,LocationElement.Empty)
            }
        }
        if (chamber[chamber.length-1] == 0) {
            chamber.pop()
        }
        bottomOfRockRow--
    }
}

let endDate = new Date()

console.log(endDate.getTime() - startTime)
console.log(chamber.length + chamberAdditionalLength)