import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

type action =
    'rock' |
    'paper' |
    'scissors'

function resultScore(theirs: action, yours: action)
{
    let score = 0
    switch(yours) {
        case 'rock': { score = 1; break; }
        case 'paper': { score = 2; break; }
        case 'scissors': { score = 3; break; }
    }

    if (theirs == yours) { score += 3 }
    else if (theirs == 'rock') {
        if (yours == 'paper') {
            score += 6
        }
    }
    else if (theirs == 'paper') {
        if (yours == 'scissors') {
            score += 6
        }
       
    }
    else if (theirs == 'scissors') {
        if (yours == 'rock') {
            score += 6
        }
       
    }

    return score
}

let score = 0
for (let line of lines) {

    let theirs: action = (line[0] == 'A' ? 'rock' : (line[0] == 'B' ? 'paper' : 'scissors'))
    let yours: action = (line[2] == 'X' ? 'rock' : (line[2] == 'Y' ? 'paper' : 'scissors'))

    score += resultScore(theirs, yours)
}

console.log(score)
