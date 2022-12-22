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
        if (equationMatch[1] === "root") {
            UnsolvedMonkeys.set("root", {monkey1: equationMatch[2], monkey2: equationMatch[4], operation: "="})
        }
        else {
            UnsolvedMonkeys.set(equationMatch[1], {monkey1: equationMatch[2], monkey2: equationMatch[4], operation: equationMatch[3]})
        }
    }
    else {
        let numberMatch = line.match(/(.*): (.*)/)
        if (numberMatch[1] !== "humn") {
            SolvedMonkeys.set(numberMatch[1], parseInt(numberMatch[2]))
        }
    }
}

while (true) {
    
    let newlySolvedMonkeys = []

    for (const [monkeyName,unsolvedMonkey] of UnsolvedMonkeys) {
        let solvedMonkey1 = SolvedMonkeys.get(unsolvedMonkey.monkey1)
        let solvedMonkey2 = SolvedMonkeys.get(unsolvedMonkey.monkey2)
        if (solvedMonkey1 && solvedMonkey2) {
            let monkeySolution
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
            SolvedMonkeys.set(monkeyName, monkeySolution)
            newlySolvedMonkeys.push(monkeyName)
        }
    }

    if (newlySolvedMonkeys.length == 0)
    {
        break
    }
    else {
        for (const nsm of newlySolvedMonkeys) {
            UnsolvedMonkeys.delete(nsm)
        }
    }
}

let monkeyToSolveName = "root"
let monkeyToSolveResult = 0

while (monkeyToSolveName !== "humn") {

    let unsolvedMonkey = UnsolvedMonkeys.get(monkeyToSolveName)    

    let solvedMonkeySolution = SolvedMonkeys.get(unsolvedMonkey.monkey1)
    let toSolveIsSecond = (solvedMonkeySolution !== undefined)
    if (solvedMonkeySolution) {
        monkeyToSolveName = unsolvedMonkey.monkey2
    }
    else {
        solvedMonkeySolution = SolvedMonkeys.get(unsolvedMonkey.monkey2)
        monkeyToSolveName = unsolvedMonkey.monkey1
    }   

    switch(unsolvedMonkey.operation) {
        case '=':
            monkeyToSolveResult = solvedMonkeySolution
            break
        
        case '+':
            monkeyToSolveResult -= solvedMonkeySolution
            break

        case '-':
            if (toSolveIsSecond) {
                monkeyToSolveResult = solvedMonkeySolution - monkeyToSolveResult
            }
            else {
                monkeyToSolveResult += solvedMonkeySolution
            }
            break

        case '*':
            monkeyToSolveResult /= solvedMonkeySolution
            break

        case '/':
            if (toSolveIsSecond) {
                monkeyToSolveResult = solvedMonkeySolution / monkeyToSolveResult
            }
            else {
                monkeyToSolveResult *= solvedMonkeySolution
            }
            break
    }

    SolvedMonkeys.set(monkeyToSolveName, monkeyToSolveResult)
}

console.log(SolvedMonkeys.get("humn"))