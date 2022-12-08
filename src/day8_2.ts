import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const grid = lines.map(line => new Array(...line).map(ch => parseInt(ch)))

const rows = grid.length;
const cols = grid[0].length;

let maxScenicScore = 0

for (let row = 1; row < rows-1; ++row)
{
    for (let col = 1; col < cols-1; ++col)
    {
        const curHeight = grid[row][col]

        let leftScore = 0
        for (let left = col-1; left >= 0; --left) {
            ++leftScore
            if (grid[row][left] >= curHeight) {
                break
            }
        }

        let rightScore = 0
        for (let right = col+1; right < cols; ++right) {
            ++rightScore
            if (grid[row][right] >= curHeight) {
                break
            }
        }

        let upScore = 0
        for (let up = row-1; up >= 0; --up) {
            ++upScore
            if (grid[up][col] >= curHeight) {
                break
            }
        }        

        let downScore = 0
        for (let down = row+1; down < rows; ++down) {
            ++downScore
            if (grid[down][col] >= curHeight) {
                break
            }
        }        

        maxScenicScore = Math.max(maxScenicScore, upScore*downScore*leftScore*rightScore)
    }
}

console.log(maxScenicScore)