import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

let Valves = new Map()

for (const line of lines) {

    const match = line.match(/Valve (.*) has flow rate=(.*); tunnel.? lead.? to valve.? (.*)/)

    Valves.set(match[1], {Rate: parseInt(match[2]), NextValves: match[3].split(",").map(s => s.trim())})

}

function stringifyRoute(route) {
    return `${route.Node}:${route.PressureRelieved}:${Array.from(route.Opened).join()}`
}

let possibleRoutes = [{
                        Node: "AA", 
                        Route: ["AA"],
                        Opened: new Map(Array.from(Valves).map(([key,value]) => [key,false])), 
                        TimeUsed: 0, 
                        PressureRelieved: 0, 
                        Score: 0
                    }]

let visited = new Map()
visited.set(stringifyRoute(possibleRoutes[0]), {TimeUsed:0, PressureRelieved: 0})

let maxFinalScore = 0
let bestRoute

while (possibleRoutes.length)
{
    const curRoute = possibleRoutes[0]
    possibleRoutes = possibleRoutes.slice(1)
    const curValve = Valves.get(curRoute.Node)

    const relievedPressure = curValve.Rate
    const canOpen = relievedPressure > 0 && !curRoute.Opened.get(curRoute.Node)

    let newOpened 
    if (canOpen) {
        newOpened = new Map(curRoute.Opened)
        newOpened.set(curRoute.Node, true)
    }

    let routeAdded = false

    if (curRoute.TimeUsed < 28) {
        for (const nextValve of curValve.NextValves) {
            if (canOpen) {
                possibleRoutes.push({
                    Node: nextValve,
                    Route: [...curRoute.Route,nextValve],
                    Opened: newOpened, 
                    TimeUsed: curRoute.TimeUsed + 2, 
                    PressureRelieved: curRoute.PressureRelieved + relievedPressure,
                    Score: curRoute.Score + curRoute.PressureRelieved * 2 + relievedPressure
                })
                routeAdded = true
            }

            const possibleRoute = {
                Node: nextValve,
                Route: [...curRoute.Route,nextValve],
                Opened: curRoute.Opened, 
                TimeUsed: curRoute.TimeUsed + 1, 
                PressureRelieved: curRoute.PressureRelieved,
                Score: curRoute.Score + curRoute.PressureRelieved
            }
            const routeKey = stringifyRoute(possibleRoute)
            const visitedInfo = visited.get(routeKey)
            if (!visitedInfo || (visitedInfo.TimeUsed >= possibleRoute.TimeUsed && visitedInfo.PressureRelieved <= possibleRoute.PressureRelieved)) {
                possibleRoutes.push(possibleRoute)
                visited.set(routeKey, {TimeUsed:possibleRoute.TimeUsed, PressureRelieved:possibleRoute.PressureRelieved})
                routeAdded = true
            }
        }
    }

    if (!routeAdded) {
        if (canOpen) {
            const finalScore = curRoute.Score + (30 - curRoute.TimeUsed) * curRoute.PressureRelieved + (29 - curRoute.TimeUsed) * relievedPressure
            if (finalScore > maxFinalScore) {
                maxFinalScore = finalScore
                bestRoute = curRoute
            }
        }
        else {
            const finalScore = curRoute.Score + (30 - curRoute.TimeUsed) * curRoute.PressureRelieved
            if (finalScore > maxFinalScore) {
                maxFinalScore = finalScore
                bestRoute = curRoute
            }
        }
    }
    else {
        possibleRoutes.sort((a,b) => b.Score - a.Score)
    }
}

console.log(bestRoute)
console.log(maxFinalScore)
