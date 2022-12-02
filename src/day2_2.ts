import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

type action =
    'rock' |
    'paper' |
    'scissors'

type result = 
    'win' |
    'lose' |
    'draw'

function resultScore(theirs: action, yours: result)
{
    let score = 0
    let yourAction: action

    if (yours == 'win') {
        score = 6
        yourAction = (theirs == 'rock' ? 'paper' : (theirs == 'paper' ? 'scissors' : 'rock'))
    }
    else if (yours == 'lose') {
        yourAction = (theirs == 'rock' ? 'scissors' : (theirs == 'paper' ? 'rock' : 'paper'))
    }
    else {
        score = 3
        yourAction = theirs
    }

    switch(yourAction) {
        case 'rock': { score += 1; break; }
        case 'paper': { score += 2; break; }
        case 'scissors': { score += 3; break; }
    }

    return score
}

let score = 0
for (let line of lines) {

    let theirs: action = (line[0] == 'A' ? 'rock' : (line[0] == 'B' ? 'paper' : 'scissors'))
    let yours: result = (line[2] == 'X' ? 'lose' : (line[2] == 'Y' ? 'draw' : 'win'))

    score += resultScore(theirs, yours)
}

console.log(score)
