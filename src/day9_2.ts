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

let rope: Point[] = new Array(10).fill(null).map(_ => new Point)

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
        rope[0].add(headAdjustment)

        for (let knot = 1; knot < rope.length; ++knot) {
            if (rope[knot-1].y == rope[knot].y) {
                if (rope[knot-1].x - rope[knot].x > 1) { rope[knot].x++ }
                else if (rope[knot].x - rope[knot-1].x > 1) { rope[knot].x-- }
            }
            else if (rope[knot-1].x == rope[knot].x) {
                if (rope[knot-1].y - rope[knot].y > 1) { rope[knot].y++ }
                else if (rope[knot].y - rope[knot-1].y > 1) { rope[knot].y-- }
            }
            else if ((Math.abs(rope[knot-1].x - rope[knot].x) > 1) || (Math.abs(rope[knot-1].y - rope[knot].y) > 1)) {
                let knotAdjustment = {x: (rope[knot-1].x > rope[knot].x ? 1 : -1), y: (rope[knot-1].y > rope[knot].y ? 1 : -1)}
                rope[knot].add(knotAdjustment)
            }
        }

        visited.add(`${rope[rope.length-1].x},${rope[rope.length-1].y}`)
    }
}

console.log(visited.size)