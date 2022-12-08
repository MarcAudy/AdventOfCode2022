import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const grid = lines.map(line => new Array(...line).map(ch => parseInt(ch)))

const rows = grid.length;
const cols = grid[0].length;

const scenicScores = grid.map((gridRow, row) => 
    gridRow.map((height, col) => {

        if (row == 0 || col == 0 || row == rows - 1 || col == cols - 1) { return -1 }

        const leftBlockingIndex = gridRow.slice(0,col).reverse().findIndex(val => val >= height)
        const leftScore = (leftBlockingIndex == -1 ? col : leftBlockingIndex + 1)
        
        const rightBlockingIndex = gridRow.slice(col+1).findIndex(val => val >= height)
        const rightScore = (rightBlockingIndex == -1 ? cols - col - 1 : rightBlockingIndex + 1)

        const columnVals = grid.map(gridRow => gridRow[col])

        const upBlockingIndex = columnVals.slice(0,row).reverse().findIndex(val => val >= height)
        const upScore = (upBlockingIndex == -1 ? row : upBlockingIndex + 1)

        const downBlockingIndex = columnVals.slice(row+1).findIndex(val => val >= height)
        const downScore = (downBlockingIndex == -1 ? rows - row - 1 : downBlockingIndex + 1)

        return upScore*downScore*leftScore*rightScore
    }))

console.log(Math.max(...scenicScores.map(scores => Math.max(...scores))))