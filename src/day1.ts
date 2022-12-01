import * as fs from 'fs'

const PART1 = false
let calories: number[] = []

const lines = fs.readFileSync(process.argv[2],'utf8').split('\n').filter(Boolean)

let newElf = true
for (let i = 0; i < lines.length; ++i) {
  if (lines[i] !== "\r") {
    if (newElf) {
      calories.push(parseInt(lines[i]))
    }
    else {
      calories[calories.length-1] += parseInt(lines[i])
    }
    newElf = false
  }
  else {
    newElf = true
  }
}

if (PART1) {
  console.log(Math.max(...calories))
}
else {
  calories.sort((a,b) => b - a)
  console.log(calories[0]+calories[1]+calories[2])
}