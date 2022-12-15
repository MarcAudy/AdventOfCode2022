import * as fs from 'fs'

type Point = {
    x: number
    y: number
}

type Sensor = {
    P: Point
    distToBeacon: number
}

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

function calcDistance(sensor, beacon) {
    return Math.abs(sensor.x-beacon.x) + Math.abs(sensor.y-beacon.y)
}

let sensors = []
let beacons: Set<string> = new Set()

for (const line of lines) {
    const match = line.match(/Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/)

    const sensorPoint = {x: parseInt(match[1]), y: parseInt(match[2])}
    const beaconPoint = {x: parseInt(match[3]), y: parseInt(match[4])}
    sensors.push({P: sensorPoint, distToBeacon:calcDistance(sensorPoint,beaconPoint)})
    beacons.add(`${beaconPoint.x},${beaconPoint.y}`)
}

const SAMPLE = process.argv[2].endsWith("sample.txt")
const RANGE = SAMPLE ? 20 : 4000000

let possiblePoints = []

for (const sensor of sensors) {

    const possiblePointDist = sensor.distToBeacon + 1
    for (let xOffset = -possiblePointDist;xOffset <= possiblePointDist; ++xOffset) {
        const x = sensor.P.x + xOffset
        if (x >= 0 && x <= RANGE) {
            let yOffset = possiblePointDist-Math.abs(xOffset)

            const y1 = sensor.P.y + yOffset
            if (y1 >= 0 && y1 <= RANGE) {       
                possiblePoints.push({x,y:y1})
            }

            const y2 = sensor.P.y - yOffset
            if (y2 >= 0 && y2 <= RANGE) {
                possiblePoints.push({x,y:y2})
            }
        }
    }
}

for (let curPoint of possiblePoints) {
    let notBeacon = false
    for (const sensor of sensors) {
        const dist = calcDistance(curPoint, sensor.P)
        if (dist <= sensor.distToBeacon) {
            notBeacon = true
            break
        }
    }
    if (!notBeacon) {
        console.log(curPoint)
        console.log(curPoint.x*4000000 + curPoint.y)
        break
    }
}

