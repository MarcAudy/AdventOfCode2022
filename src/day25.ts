import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

const snafuChars = ["2","1","0","-","="]
const symbolValues = new Map([["0",0],["1",1],["2",2],["-",-1],["=",-2]])

function snafuToDecimal(snafu) {
    let value = 0
    for (let c=snafu.length-1, multiplier=1; c >= 0; c--, multiplier *= 5) {
        value += symbolValues.get(snafu[c]) * multiplier
    }
    return value
}

let decimalSum = 0
lines.forEach(line => decimalSum += snafuToDecimal(line))

let snafuResult = ["2"]
while (snafuToDecimal(snafuResult) < decimalSum) {
    snafuResult.push("2")
}

for (let index=0; index < snafuResult.length; ++index) {
    for (let snafuChar=1; snafuChar < snafuChars.length; ++snafuChar) {
        snafuResult[index] = snafuChars[snafuChar]
        if (snafuToDecimal(snafuResult) < decimalSum) {
            snafuResult[index] = snafuChars[snafuChar-1]
            break
        }
    }
}

console.log(snafuResult.join(""))
