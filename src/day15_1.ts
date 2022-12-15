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

const maxDist = Math.max(...sensors.map(s => s.distToBeacon))
const maxX = Math.max(...sensors.map(s => s.P.x))
const minX = Math.min(...sensors.map(s => s.P.x))

const yRow = 2000000

let notBeacon = 0

const beaconsOnRow = [...beacons].map(b => ({x: parseInt(b.split(",")[0]), y: parseInt(b.split(",")[1])})).filter(b => b.y == yRow)

for (let curPoint = {x: minX - maxDist, y: yRow}; curPoint.x <= maxX + maxDist; ++curPoint.x) {

    if (beaconsOnRow.filter(b => b.x == curPoint.x).length > 0) {
        continue
    }

    for (const sensor of sensors) {
        const dist = calcDistance(curPoint, sensor.P)
        if (dist <= sensor.distToBeacon) {
            notBeacon++
            break
        }
    }

}

console.log(notBeacon)

