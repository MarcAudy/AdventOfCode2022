import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const grid = lines.map(line => new Array(...line).map(ch => parseInt(ch)))

const rows = grid.length;
const cols = grid[0].length;

let visibility = grid.map((row, rowIndex) => row.map((_, colIndex) => (rowIndex == 0 || rowIndex == rows-1 || colIndex == 0 || colIndex == cols-1)))
let visible = rows * 2 + (cols - 2) * 2

let maxFromTop = [...grid[0]]
for (let row = 1; row < rows-1; ++row)
{
    for (let col = 1; col < cols-1; ++col)
    {
        if (grid[row][col] > maxFromTop[col]) {
            maxFromTop[col] = grid[row][col]
            if (!visibility[row][col]) {
                visibility[row][col] = true
                ++visible
            }
        }
    }
}

let maxFromBottom = [...grid[grid.length-1]]
for (let row = rows - 2; row > 0; --row)
{
    for (let col = 1; col < cols-1; ++col)
    {
        if (grid[row][col] > maxFromBottom[col]) {
            maxFromBottom[col] = grid[row][col]
            if (!visibility[row][col]) {
                visibility[row][col] = true
                ++visible
            }
        }
    }
}

let maxFromLeft = grid.map(row => row[0])
for (let col = 1; col < cols-1; ++col)
{
    for (let row = 1; row < rows-1; ++row)
    {
        if (grid[row][col] > maxFromLeft[row]) {
            maxFromLeft[row] = grid[row][col]
            if (!visibility[row][col]) {
                visibility[row][col] = true
                ++visible
            }
        }
    }
}

let maxFromRight = grid.map(row => row[row.length-1])
for (let col = cols-2; col > 0; --col)
{
    for (let row = 1; row < rows-1; ++row)
    {
        if (grid[row][col] > maxFromRight[row]) {
            maxFromRight[row] = grid[row][col]
            if (!visibility[row][col]) {
                visibility[row][col] = true
                ++visible
            }
        }
    }
}

console.log(visible)