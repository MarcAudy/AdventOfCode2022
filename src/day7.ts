import * as fs from 'fs'

const lines = fs.readFileSync(process.argv[2],'utf8').split('\r\n')

class file {
    name: string
    size: number
}

class dir {
    files: file[] = []
    size: number = 0
}

const ROOTDIR = "/"

let dirStack = [ROOTDIR]
let dirs: Map<string, dir> = new Map()
let curDir = ""
dirs.set(ROOTDIR, new dir())

for (let i = 0; i < lines.length; ++i) {

    if (lines[i] === "$ ls") {
        while (i+1 < lines.length && lines[i+1][0] !== "$") {
            ++i
            if (lines[i].startsWith("dir")) {
                const dirName = lines[i].slice(4)
                const dirFullPath = `${curDir}/${dirName}`
                if (!dirs.has(dirFullPath)) {
                    dirs.set(dirFullPath, new dir())
                }
            }
            else {
                const match = lines[i].match(/(.*) (.*)/)
                const size = parseInt(match[1])
                dirs.get(curDir.length==0?ROOTDIR:curDir).files.push({name: match[2], size})
                for (const ds of dirStack)
                {
                    dirs.get(ds).size += size
                }
            }
        }
    }
    else {
        const match = lines[i].match(/\$ cd (.*)/)
        if (match)
        {
            if (match[1] === ROOTDIR) {            
                curDir = ""
                dirStack.length = 1
            }
            else if (match[1] === "..") {
                curDir = curDir.slice(0,curDir.lastIndexOf("/"))
                dirStack.pop()
            }
            else {
                curDir += `/${match[1]}`
                dirStack.push(curDir)

            }
        }
    }
}

const PART1 = false

// PART1
let smallDirSizeSum = 0

// PART2
const totalSize = dirs.get(ROOTDIR).size
const needed = 30000000 - (70000000 - totalSize)
let curBest = totalSize

for (const [_,dirSize] of dirs) {

    // PART1
    if (dirSize.size <= 100000) {
        smallDirSizeSum += dirSize.size
    }

    // PART2
    if (dirSize.size >= needed && dirSize.size < curBest) {
        curBest = dirSize.size
    }
}

if (PART1) {
    console.log(smallDirSizeSum)
}
else {
    console.log(curBest)
}