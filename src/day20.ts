import { randomInt } from 'crypto'
import * as fs from 'fs'

const PART1 = false
const MIX_ITERATIONS = (PART1 ? 1 : 10)

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const numberOrder = lines.map(v => parseInt(v) * (PART1 ? 1 : 811589153))
const zeroIndex = numberOrder.findIndex(v => v == 0)

let mixed = new Array(numberOrder.length).fill(0).map((_, index) => index)

for (let mixCount = 0; mixCount < MIX_ITERATIONS; ++mixCount) {
    for (let index = 0; index < numberOrder.length; ++index) {

        let no = numberOrder[index]
        if (no == 0) continue

        let startPoint = mixed.findIndex(v => v == index)
        let toMove = no

        if (toMove > numberOrder.length) {
            toMove %= numberOrder.length - 1
        }
        else if (toMove < -numberOrder.length) {
            toMove %= numberOrder.length - 1
        }

        let newIndex = startPoint + toMove
        if (no > 0 && newIndex > numberOrder.length - 1) {
            newIndex = (newIndex+1) % numberOrder.length
        }
        else if (no < 0 && newIndex <= 0) {
            newIndex += numberOrder.length - 1
        }

        if (no < 0 && newIndex == 0) {
            newIndex = numberOrder.length - 1
        }
        else if (no > 0 && newIndex == numberOrder.length - 1)
        {
            newIndex = 0
        }

        if (newIndex < startPoint) {
            for (let i=startPoint;i>newIndex;--i) {
                mixed[i] = mixed[i-1]
            }
            mixed[newIndex] = index
        }
        else if (newIndex > startPoint) {
            for (let i=startPoint;i<newIndex;++i) {
                mixed[i] = mixed[i+1]
            }
            mixed[newIndex] = index
        }
    }
}

const mixedZeroIndex = mixed.findIndex(v => v == zeroIndex)
console.log( numberOrder[mixed[(mixedZeroIndex+1000)%mixed.length]]
            +numberOrder[mixed[(mixedZeroIndex+2000)%mixed.length]]
            +numberOrder[mixed[(mixedZeroIndex+3000)%mixed.length]])