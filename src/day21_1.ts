import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

type Equation = {
    monkey1: string
    monkey2: string
    operation: string
}

let UnsolvedMonkeys: Map<string,Equation> = new Map()
let SolvedMonkeys: Map<string,number> = new Map()

for (let line of lines) {
    let equationMatch = line.match(/(.*): (.*) (.*) (.*)/)
    if (equationMatch) {
        UnsolvedMonkeys.set(equationMatch[1], {monkey1: equationMatch[2], monkey2: equationMatch[4], operation: equationMatch[3]})
    }
    else {
        let numberMatch = line.match(/(.*): (.*)/)
        SolvedMonkeys.set(numberMatch[1], parseInt(numberMatch[2]))
    }
}

function solveMonkey(monkey) {
    let monkeySolution = SolvedMonkeys.get(monkey)
    if (monkeySolution === undefined)
    {
        const unsolvedMonkey = UnsolvedMonkeys.get(monkey)
        const solvedMonkey1 = solveMonkey(unsolvedMonkey.monkey1)
        const solvedMonkey2 = solveMonkey(unsolvedMonkey.monkey2)
        switch (unsolvedMonkey.operation) {
            case "+":
                monkeySolution = solvedMonkey1 + solvedMonkey2
                break
            case "-":
                monkeySolution = solvedMonkey1 - solvedMonkey2
                break
            case "*":
                monkeySolution = solvedMonkey1 * solvedMonkey2
                break
            case "/":
                monkeySolution = solvedMonkey1 / solvedMonkey2
                break
        }
    }
    
    return monkeySolution
}


console.log(solveMonkey("root"))
