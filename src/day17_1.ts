import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const rocks = [["@@@@"],

             [".@.",
              "@@@",
              ".@."],
            
             ["..@.",
              "..@",
              "@@@"],

             ["@",
              "@",
              "@",
              "@",],

             ["@@",
              "@@"]
            ] 

const CHAMBER_WIDTH = 7

let chamber: string[] = []

let gustIndex = 0
let spawnedRocks = 0
let rockIndex = 0
let curRock: string[]
let spawnNewRock = true
let bottomOfRockRow

while (true) {
    if (spawnNewRock) {

        if (spawnedRocks == 2022) {
            break
        }

        curRock = rocks[rockIndex]
        
        for (let eIndex = 0; eIndex < 3; ++eIndex) {
            chamber.push(".".repeat(CHAMBER_WIDTH))
        }
        bottomOfRockRow = chamber.length
        for (let rIndex = curRock.length-1; rIndex >= 0; --rIndex) {
            chamber.push(".."+curRock[rIndex]+".".repeat(CHAMBER_WIDTH-2-curRock[rIndex].length))
        }
        spawnedRocks++
        spawnNewRock = false
        rockIndex = (rockIndex + 1) % rocks.length
    }

    const moveLeft = (lines[0][gustIndex] === "<")
    gustIndex = (gustIndex + 1) % lines[0].length

    let canMove = true
    for (let row of chamber.slice(bottomOfRockRow,bottomOfRockRow+curRock.length)) {
        if (moveLeft) {
            let index = row.indexOf("@")
            if (index == 0 || row[index-1] === "#") {
                canMove = false
                break
            }
        }
        else {
            let index = row.lastIndexOf("@")
            if (index == CHAMBER_WIDTH - 1 || row[index + 1] === "#") {
                canMove = false
                break
            }
        }
    }

    if (canMove) {
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            let tempRow = [...chamber[bottomOfRockRow+rIndex]]
            if (moveLeft) {
                for (let i=0; i < CHAMBER_WIDTH-1; ++i) {          
                    if (tempRow[i+1] === "@") {
                        tempRow[i] = "@"
                        tempRow[i+1] = "."
                    }
                }
            }
            else {
                for (let i=CHAMBER_WIDTH-1; i > 0; --i) {          
                    if (tempRow[i-1] === "@") {
                        tempRow[i] = "@"
                        tempRow[i-1] = "."
                    }
                }
            }
            chamber[bottomOfRockRow+rIndex] = tempRow.join("")
        }
    }

    let atRest = bottomOfRockRow == 0
    if (!atRest) {
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            for (let i = 0; i < CHAMBER_WIDTH; ++i) {
                if (chamber[bottomOfRockRow+rIndex][i] === "@" && chamber[bottomOfRockRow+rIndex-1][i] === "#") {
                    atRest = true
                    break
                }
            }
        }
    }

    if (atRest) {
        spawnNewRock = true
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            chamber[bottomOfRockRow+rIndex] = [...chamber[bottomOfRockRow+rIndex]].map(ch => ch === "@" ? "#" : ch).join("")
        }
    }
    else {
        for (let rIndex=0; rIndex < curRock.length; ++rIndex) {
            let tempRow = [...chamber[bottomOfRockRow+rIndex-1]].map(ch => ch === "@" ? "." : ch)
            for (let i=0; i < CHAMBER_WIDTH; ++i) {               
                if (chamber[bottomOfRockRow + rIndex][i] === "@" ) {
                    tempRow[i] = "@"
                }
            }
            chamber[bottomOfRockRow+rIndex-1] = tempRow.join("")
        }
        chamber[bottomOfRockRow+curRock.length-1] = [...chamber[bottomOfRockRow+curRock.length-1]].map(ch => ch === "@" ? "." : ch).join("")
        if ([...chamber[chamber.length-1]].filter(ch => ch === ".").length == CHAMBER_WIDTH) {
            chamber.pop()
        }
        bottomOfRockRow--
    }
}

console.log(chamber.length)