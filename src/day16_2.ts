import * as fs from 'fs'

const PART1 = false
const NUM_WORKERS = (PART1 ? 1 : 2)
const MAX_TIME = (PART1 ? 30 : 26)

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let ValveIDs = new Map()
let ValveNames = new Map()

let getValveID = (ValveName) => {
    let ValveID = ValveIDs.get(ValveName)
    if (ValveID === undefined) {
        ValveID = ValveIDs.size
        ValveIDs.set(ValveName, ValveID)
        ValveNames.set(ValveID, ValveName)
    }
    return ValveID
};

getValveID("AA")

let ParsedValves = []
for (const line of lines) {
    const match = line.match(/Valve (.*) has flow rate=(.*); tunnel.? lead.? to valve.? (.*)/)
    const Rate = parseInt(match[2])
    ParsedValves.push({Name: match[1], ID: -1, Rate, NextValveNames: match[3].split(",").map(s => s.trim())})
}

ParsedValves.sort((a, b) => b.Rate - a.Rate)
ParsedValves.forEach(pv => { if (pv.Rate > 0) { pv.ID = getValveID(pv.Name) }})

const ValveCount = ValveIDs.size

ParsedValves.forEach(pv => { if (pv.ID == -1) { pv.ID = getValveID(pv.Name)}})

const Valves = ParsedValves.sort((a, b) => a.ID - b.ID).map(pv => ({Rate:pv.Rate, NextValves: pv.NextValveNames.map(nvn => getValveID(nvn))}))

let shortestDistanceToValves = new Array(ValveCount).fill(null).map(_ => new Array(ValveCount).fill(10000))

shortestDistanceToValves.forEach((sd, index) => sd[index] = 0)

let setShortestDistance = (source, target, cost) => {
    shortestDistanceToValves[source][target] = cost
    shortestDistanceToValves[target][source] = cost

    for (let v = 0; v < ValveCount; ++v) {
        if (v != source && v != target) {
            const passThroughCost = shortestDistanceToValves[target][v] + cost
            if (shortestDistanceToValves[source][v] > passThroughCost) {
                shortestDistanceToValves[source][v] = passThroughCost
                shortestDistanceToValves[v][source] = passThroughCost
            }
        }
    }
}

for (let v = 0; v < ValveCount; ++v) {

    let nextSteps = Valves[v].NextValves.map(nv => [nv, 1])
    let distSet = new Set([v,...Valves[v].NextValves])

    while (nextSteps.length > 0) {
        const nextStep = nextSteps[0]
        nextSteps = nextSteps.slice(1)

        let doAdd = true
        if (nextStep[0] < ValveCount) {
            if (nextStep[1] <= shortestDistanceToValves[v][nextStep[0]]) {
                setShortestDistance(v, nextStep[0], nextStep[1])
            }
            else {
                doAdd = false
            }
        }
        
        if (doAdd) {
            for (const nv of Valves[nextStep[0]].NextValves) {
                if (!distSet.has(nv)) {
                    nextSteps.push([nv,nextStep[1]+1])
                    distSet.add(nv)
                }
            }
        }
    }
}

type Worker = {
    curLoc: number,
    dest: number,
    timeRemainingToDest: number
    ValveOpenOrder: number[]
}

type Scenario = {
    Workers: Worker[]
    UnopenedValves: Set<number>
    minute: number
    totalPressureReleased: number
    pressureReleasedPerMinute: number
}

function getNewScenarios(scenarios: Scenario[], workerIndex: number) {
    let newScenarios: Scenario[] = []
    for (const scenario of scenarios) {
        let worker = scenario.Workers[workerIndex]
        for (const uv of scenario.UnopenedValves) {
            if (MAX_TIME - scenario.minute >= shortestDistanceToValves[worker.curLoc][uv] + 1) {
                let newScenario = structuredClone(scenario)
                newScenario.Workers[workerIndex].dest = uv
                newScenario.Workers[workerIndex].timeRemainingToDest = shortestDistanceToValves[worker.curLoc][uv]
                newScenario.Workers[workerIndex].ValveOpenOrder.push(uv)
                newScenario.UnopenedValves.delete(uv)
                newScenarios.push(newScenario)
            }
        }
        if (NUM_WORKERS > 1 && newScenarios.length > 0) {
            newScenarios.push(structuredClone(scenario))
        }
    }
    return newScenarios.length > 0 ? newScenarios : undefined
}

let maxScore = 0

function evaluateScenario(scenario: Scenario) {

    let newScenarios
    while (scenario.minute < MAX_TIME) {

        scenario.totalPressureReleased += scenario.pressureReleasedPerMinute
        scenario.minute++

        for (let workerIndex=0; workerIndex < scenario.Workers.length; ++workerIndex) {
            const worker = scenario.Workers[workerIndex]
            worker.timeRemainingToDest--
            if (worker.timeRemainingToDest == 0) {
                scenario.pressureReleasedPerMinute += Valves[worker.dest].Rate
                worker.curLoc = worker.dest
            }
        }

        for (let workerIndex=0; workerIndex < scenario.Workers.length; ++workerIndex) {
            const worker = scenario.Workers[workerIndex]
            if (worker.timeRemainingToDest == -1) {
                newScenarios = getNewScenarios(newScenarios || [scenario], workerIndex)
            }
        }

        if (newScenarios) {
            return Math.max(...newScenarios.map(ns => evaluateScenario(ns)))
        }
    }

    if (scenario.totalPressureReleased > maxScore) {
        maxScore = scenario.totalPressureReleased
        console.log(`New max ${maxScore}`)
        console.log(scenario.Workers.map(w => w.ValveOpenOrder.map(voo => ValveNames.get(voo)).join(",")))
    }

    return scenario.totalPressureReleased
}

let startScenario: Scenario = { Workers: [], 
                           UnopenedValves: new Set(new Array(ValveCount-1).fill(0).map((_, index) => index+1)),
                           minute: 1,
                           totalPressureReleased: 0,
                           pressureReleasedPerMinute: 0
                        }
for (let w=0; w < NUM_WORKERS; ++w) {
    startScenario.Workers.push({curLoc: 0, dest: 0, timeRemainingToDest: 0, ValveOpenOrder: []})
}

let startScenarios = [startScenario]
for (let workerIndex=0; workerIndex < NUM_WORKERS; ++workerIndex) {
    startScenarios = getNewScenarios(startScenarios, workerIndex)
}
if (NUM_WORKERS > 1) {
    startScenarios = startScenarios.filter(ss => {
                                        for (let w of ss.Workers) {
                                            if (w.ValveOpenOrder.length != 1)
                                                return false
                                        }
                                        for (let i=1; i < NUM_WORKERS; ++i) { 
                                            if (ss.Workers[i].ValveOpenOrder[0] < ss.Workers[i-1].ValveOpenOrder[0]) {
                                                return false
                                            }
                                        }
                                        return true
                                    })
}

console.log(Math.max(...startScenarios.map(ss => evaluateScenario(ss))))
