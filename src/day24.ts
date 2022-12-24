import * as fs from 'fs'

const PART1 = false

type Point = {
    x: number
    y: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

enum BlizzType {
    Empty = 0,
    Up = 1,
    Down = 2,
    Left = 4,
    Right = 8
}

const BlizzSymbols = new Map([['.',BlizzType.Empty],['^',BlizzType.Up],['v',BlizzType.Down],['<',BlizzType.Left],['>',BlizzType.Right]])

let grids = [lines.slice(1,-1).map(line => [...line.slice(1,-1)].map(ch => BlizzSymbols.get(ch)))]
const gridHeight = grids[0].length
const gridWidth = grids[0][0].length

type ElfLocation = {
    x: number,
    y: number,
    minute: number
}

class ElfLocations {

    private elfLocations: ElfLocation[]
    private seenElfLocations: Set<number>

    constructor(private goalLocation: Point) {
        this.elfLocations = []
        this.seenElfLocations = new Set()
    }

    get length() {
        return this.elfLocations.length
    }

    addLocation(elfLoc: ElfLocation) {
        const hashSize = this.seenElfLocations.size
        this.seenElfLocations.add(this.hashElfLocation(elfLoc))
        if (hashSize != this.seenElfLocations.size) {
            this.elfLocations.splice(this.findInsertionPoint(elfLoc) + 1, 0, elfLoc);
        }
    }

    popLocation(): ElfLocation {
        return this.elfLocations.pop()
    }

    private hashElfLocation(elfLoc: ElfLocation) {
        return elfLoc.x | elfLoc.y << 7 | elfLoc.minute << 14
    }   

    private scoreLocation(elfLoc: ElfLocation) {
        return elfLoc.minute + Math.abs(this.goalLocation.x - elfLoc.x) + Math.abs(this.goalLocation.y - elfLoc.y)
    }

    private findInsertionPoint(elfLoc: ElfLocation) {
        let low = 0, high = this.elfLocations.length;
        const elfScore = this.scoreLocation(elfLoc)
        while (low < high) {
           let mid = (low + high) >>> 1;
           if (this.scoreLocation(this.elfLocations[mid]) > elfScore) {
              low = mid + 1;
           } else {
              high = mid
           }
        };
        return low;
    }     
}

function generateNextGrid() {

    let nextGrid = new Array(gridHeight).fill(null).map(_ => new Array(gridWidth).fill(BlizzType.Empty))

    grids[grids.length-1].forEach((row, y) => row.forEach((loc, x) => {
        if (loc & BlizzType.Up)    nextGrid[y == 0 ? gridHeight - 1 : y - 1][x] |= BlizzType.Up
        if (loc & BlizzType.Down)  nextGrid[y == gridHeight - 1 ? 0 : y + 1][x] |= BlizzType.Down
        if (loc & BlizzType.Left)  nextGrid[y][x == 0 ? gridWidth - 1 : x - 1]  |= BlizzType.Left
        if (loc & BlizzType.Right) nextGrid[y][x == gridWidth - 1 ? 0 : x + 1]  |= BlizzType.Right
    }))

    grids.push(nextGrid)
}

let trips: [Point, Point][] = [[{x:0, y:0},{x: gridWidth-1, y: gridHeight-1}]]
if (!PART1) {
    trips.push([{x: gridWidth-1, y: gridHeight-1},{x:0, y:0}])
    trips.push([{x:0, y:0},{x: gridWidth-1, y: gridHeight-1}])
}

let totalTripLength = 0

trips.forEach(trip => {

    let startLocation = trip[0]
    let goalLocation = trip[1]

    let elfLocations = new ElfLocations(goalLocation)

    while(true) {

        if (elfLocations.length == 0) {
            generateNextGrid()
            if (grids[grids.length-1][startLocation.y][startLocation.x] == BlizzType.Empty) {
                elfLocations.addLocation({x:startLocation.x,y:startLocation.y,minute:grids.length-1})
            }       
        }
        else {
            const elfLoc = elfLocations.popLocation()

            if (elfLoc.x == goalLocation.x && elfLoc.y == goalLocation.y) {
                generateNextGrid()
                console.log(`Trip complete: ${elfLoc.minute + 1}`)
                totalTripLength += elfLoc.minute + 1
                break
            }

            if (elfLoc.minute + 1 == grids.length) {
                generateNextGrid()
                if (grids[grids.length-1][startLocation.y][startLocation.x] == BlizzType.Empty) {
                    elfLocations.addLocation({x:startLocation.x,y:startLocation.y,minute:grids.length-1})
                }       
               }
            
            const grid = grids[elfLoc.minute + 1]

            if (grid[elfLoc.y][elfLoc.x] == BlizzType.Empty) {
                elfLocations.addLocation({x: elfLoc.x, y: elfLoc.y, minute: elfLoc.minute+1})
            }
            if (elfLoc.x > 0 && grid[elfLoc.y][elfLoc.x-1] == BlizzType.Empty) {
                elfLocations.addLocation({x: elfLoc.x-1, y: elfLoc.y, minute: elfLoc.minute+1})
            }
            if (elfLoc.x < gridWidth-1 && grid[elfLoc.y][elfLoc.x+1] == BlizzType.Empty) {
                elfLocations.addLocation({x: elfLoc.x+1, y: elfLoc.y, minute: elfLoc.minute+1})
            }
            if (elfLoc.y > 0 && grid[elfLoc.y-1][elfLoc.x] == BlizzType.Empty) {
                elfLocations.addLocation({x: elfLoc.x, y: elfLoc.y-1, minute: elfLoc.minute+1})
            }
            if (elfLoc.y < gridHeight-1 && grid[elfLoc.y+1][elfLoc.x] == BlizzType.Empty) {
                elfLocations.addLocation({x: elfLoc.x, y: elfLoc.y+1, minute: elfLoc.minute+1})
            }
        }
    }

    grids = grids.slice(-1)
})

console.log(totalTripLength)