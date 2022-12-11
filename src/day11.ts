import * as fs from 'fs'

const PART1 = false

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

type Monkey = {
    items: number[]
    operation: string
    opAmount: number
    testAmount: number
    trueMonkey: number
    falseMonkey: number
    itemsInspected: number
}

let monkeys = []

function parseMonkey(monkeyLines) {

    const items = monkeyLines[0].slice(18).split(",").map(str => parseInt(str))
    const operation = monkeyLines[1][23]
    const opAmount = monkeyLines[1].slice(25)
    const testAmount = parseInt(monkeyLines[2].slice(21))
    const trueMonkey = parseInt(monkeyLines[3].slice(29))
    const falseMonkey = parseInt(monkeyLines[4].slice(30))

    monkeys.push({items,operation,opAmount,testAmount,trueMonkey,falseMonkey,itemsInspected: 0})
}

for (let i=0; i < lines.length; i+=7)
{
    parseMonkey(lines.slice(i+1,i+6))
}

const monkeyCommonModulo = monkeys.map(m => m.testAmount).reduce((a,b) => a * b, 1)

const ROUNDS = (PART1 ? 20 : 10000)
for (let round = 0; round < ROUNDS; ++round)
{
    for (let monkey of monkeys) {
        for (let item of monkey.items) {
            const amount = (monkey.opAmount === "old" ? item : parseInt(monkey.opAmount))
            if (monkey.operation === "*") {
                item *= amount
            }
            else {
                item += amount
            }
            if (PART1) {
                item = Math.floor(item / 3)
            }
            else {
                item %= monkeyCommonModulo
            }
            if (item % monkey.testAmount == 0) {
                monkeys[monkey.trueMonkey].items.push(item)
            }
            else {
                monkeys[monkey.falseMonkey].items.push(item)
            }
        }
        monkey.itemsInspected += monkey.items.length
        monkey.items.length = 0
    }
}

const itemsInspected = monkeys.map(m => m.itemsInspected).sort((a,b) => a - b)
console.log(itemsInspected[itemsInspected.length-1] * itemsInspected[itemsInspected.length-2])