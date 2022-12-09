import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

class Point {
    x = 0;
    y = 0;

    add(P) {
        if (P.x) { this.x += P.x }
        if (P.y) { this.y += P.y }
    }
};

let head = new Point()
let tail = new Point()

let visited: Set<string> = new Set()
visited.add("0,0")

for (const line of lines) {

    let headAdjustment: Partial<Point>
    switch(line[0]) {
        case "U":
            headAdjustment = {y:-1}
            break
        case "D":
            headAdjustment = {y:1}
            break
        case "R":
            headAdjustment = {x:1}
            break
        case "L":
            headAdjustment = {x:-1}
            break
    }

    const moveDist = parseInt(line.slice(2))
    for (let i=0; i < moveDist; ++i) {
        head.add(headAdjustment)

        if (head.y == tail.y) {
            if (head.x - tail.x > 1) { tail.x++ }
            else if (tail.x - head.x > 1) { tail.x-- }
        }
        else if (head.x == tail.x) {
            if (head.y - tail.y > 1) { tail.y++ }
            else if (tail.y - head.y > 1) { tail.y-- }
        }
        else if ((Math.abs(head.x - tail.x) > 1) || (Math.abs(head.y - tail.y) > 1)) {
            let tailAdjustment = {x: (head.x > tail.x ? 1 : -1), y: (head.y > tail.y ? 1 : -1)}
            tail.add(tailAdjustment)
        }

        visited.add(`${tail.x},${tail.y}`)
    }
}

console.log(visited.size)