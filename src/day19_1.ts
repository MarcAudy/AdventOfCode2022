import { randomInt } from 'crypto'
import * as fs from 'fs'

const MAX_SET_SIZE = Math.pow(2, 24)
class BigSet<Element> {

    Sets: Set<Element>[]

    constructor(...parameters) {
        this.Sets = [new Set(...parameters)]
    }

    has(key: Element) {
        for (const m of this.Sets) {
            if (m.has(key)) {
                return true
            }
        }
        return false
    }

    add(element: Element) {
        if (this.Sets[this.Sets.length-1].size == MAX_SET_SIZE) {
            this.Sets.push(new Set())
        }
        this.Sets[this.Sets.length-1].add(element)
    }
}

const MAX_TIME = 24

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let startTime = new Date().getTime()

type Blueprint = {
    ID: number
    robotRecipes: Array<Array<number>>
}

let blueprints: Blueprint[] = []

for (const line of lines) {
    const match = line.match(/Blueprint (.*): Each ore robot costs (.*) ore. Each clay robot costs (.*) ore. Each obsidian robot costs (.*) ore and (.*) clay. Each geode robot costs (.*) ore and (.*) obsidian./)

    blueprints.push({
        ID: parseInt(match[1]),
        robotRecipes: [
                        [parseInt(match[2]), 0, 0],
                        [parseInt(match[3]), 0, 0],
                        [parseInt(match[4]), parseInt(match[5]), 0],
                        [parseInt(match[6]), 0, parseInt(match[7])]
        ]
    })
}

type Scenario = {
    resources: Array<number>
    robots: Array<number>
    minute: number
}

class Scenarios {

    private seenScenarios: BigSet<number> = new BigSet()
    private scenarios: Scenario[] = []

    private shift(num, bits) {
        return (bits < 28 ? num << bits : num * Math.pow(2, bits))
    }

    private hashScenario(scenario: Scenario) {
        let hash = 0
        for (let i=0; i<scenario.resources.length;++i) {
            hash += this.shift(scenario.resources[i],i*5)
        }
        for (let i=0; i<scenario.robots.length;++i) {
            hash += this.shift(scenario.robots[i], (20 + i*4))
        }
        hash += this.shift(scenario.minute,36)
        return hash
    }

    getNewScenarios(scenario: Scenario, blueprint: Blueprint) {

        // what will be produced
        let newRes = []
        for (let resIndex=0; resIndex<scenario.resources.length;++resIndex) {
            newRes[resIndex] = scenario.resources[resIndex] + scenario.robots[resIndex]
            if (newRes[resIndex] > 32) {
                newRes[resIndex] = 32
            }
        }
    
        // build nothing
        this.push({resources: newRes, robots:scenario.robots, minute:scenario.minute + 1})
    
        let canBuildRobot = (recipe) => {
            for (let i=0; i < recipe.length; ++i) {
                if (scenario.resources[i] < recipe[i]) {
                    return false
                }
            }
            return true
        }
    
        // build a robot
        for (let recipeIndex=0; recipeIndex < blueprint.robotRecipes.length; ++recipeIndex) {
            if (scenario.resources[recipeIndex] < 25) {
                let recipe = blueprint.robotRecipes[recipeIndex]
                if (canBuildRobot(recipe)) {
                    this.push({
                        resources: newRes.map((res, index) => res - (recipe[index] || 0)),
                        robots: scenario.robots.map((robots, robotIndex) => robots + (robotIndex == recipeIndex ? 1 : 0)),
                        minute: scenario.minute + 1
                    })
                }
            }
        }
    }    

    push(scenario: Scenario) {
        const hash = this.hashScenario(scenario)

        if (!this.seenScenarios.has(hash)) {
            this.seenScenarios.add(hash)
            this.scenarios.push(scenario)
        }
    }

    pop() {
        return this.scenarios.pop()
    }
}

let qualitySum = 0 

let startScenario: Scenario = {
    resources: [2,0,0,0],
    robots: [1,0,0,0],
    minute: 3
}

for (const bp of blueprints) {

    let bpStartTime = new Date().getTime()
    let maxGeodes = 0
    let maxScenario
    let scenarios = new Scenarios
    scenarios.push(startScenario)

    while (true) {
        let scenario = scenarios.pop()
        if (!scenario) {
            console.log(`${bp.ID} => ${maxGeodes} (${new Date().getTime() - bpStartTime})`)
            console.log(maxScenario)
            qualitySum += maxGeodes * bp.ID
            break
        }
        else if (scenario.minute == MAX_TIME) {
            let scenarioGeodes = scenario.resources[3] + scenario.robots[3]
            if (maxGeodes < scenarioGeodes) {
                maxGeodes = scenarioGeodes
                maxScenario = scenario
            }
        }
        else {
            scenarios.getNewScenarios(scenario, bp)
        }
    } 
}

console.log(qualitySum)