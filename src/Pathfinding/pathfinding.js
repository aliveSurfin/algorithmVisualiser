export default class pathfinder {
    constructor() {
        this.astar = null
    }
    solveAstar(grid, start, end) {
        this.astar = new astar(start, end, grid)
        return this.astar.solve()
    }


}

class astar {
    constructor(start, end, grid) {
        this.START_POS = start
        this.END_POS = end
        this.grid = grid;
        console.log(start);
    }
    nodeEquals(n1, n2) {
        if (n1.x === n2.x && n1.y === n2.y) {
            return true
        }
    }
    solve() {
        let open = []
        let openAnimationCells = []
        let closed = []
        console.log(this.START_POS);
        let start = this.grid[this.START_POS.y][this.START_POS.x]
        let end = this.grid[this.END_POS.y][this.END_POS.x]
        console.log(this.grid);
        start.f = 0
        start.g = 0
        start.start = true
        end.end = true
        start.parent = null
        open.push(start)
        while (open.length > 0) {
            open.sort((a, b) => (a.f > b.f) ? 1 : -1)

            if (open.length > 5) {
                //return
            }
            let cur = open[0]
            open = open.slice(1)
            let neighbours = this.getNeighbours(cur)
            for (let i = 0; i < neighbours.length; i++) {
                let cn = neighbours[i]
                let clone = JSON.parse(JSON.stringify(cur))
                cn.parent = clone
                if (cn.wall) {
                    continue
                }
                // fin conditon
                if (cn.end) {
                    console.log("finished");
                    let cc = cn
                    let path = []
                    while (cc != null && !(cc.start)) {
                        path.push(cc)
                        cc = cc.parent
                    }
                    path.reverse()

                    return [path, openAnimationCells]


                }
                let g = cur.g
                cn.g = cn.diagonal ? g + 2 : g + 1
                cn.h = this.heuristic(cn, end)
                cn.f = cn.g + cn.h

                let obj2 = null
                let indexclosed = null
                for (let x = 0; x < closed.length; x++) {

                    if (this.nodeEquals(closed[x], cn)) {
                        obj2 = closed[x]
                        indexclosed = x
                        break
                    }
                }
                if (obj2 != null) {
                    if (cn.g < obj2.g) {
                        open.push(cn.g)
                    }
                    continue
                }
                let obj = null
                let openindex = null
                for (let x = 0; x < open.length; x++) {

                    if (this.nodeEquals(open[x], cn)) {
                        obj = open[x]
                        openindex = x
                        break
                    }
                }
                if (obj != null) {
                    //console.log("switched", this.accessRef(open[openindex]));
                    if (cn.g < obj.g) {
                        openAnimationCells.push(cn)
                        open[openindex] = cn
                    }
                    continue
                }
                open.push(cn)
                openAnimationCells.push(cn)




            }
            closed.push(cur)
        }
        return [[], openAnimationCells]
    }
    heuristic(pos0, pos1) {
        var a = pos0.x - pos1.x
        var b = pos0.y - pos1.y

        return Math.sqrt(a * a + b * b)
    }
    getNeighbours(node, diagonal = false) {
        let grid = this.grid
        var ret = [];
        var x = node.y
        var y = node.x

        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }
        if (grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
        if (grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }
        let ret2 = []
        if (diagonal) {

            if (grid[x + 1] && grid[x + 1][y + 1]) {
                ret2.push(grid[x + 1][y + 1]);
            }
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                ret2.push(grid[x + 1][y - 1]);
            }
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                ret2.push(grid[x - 1][y + 1]);
            }
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                ret2.push(grid[x - 1][y - 1]);
            }
            for (let i = 0; i < ret2.length; i++) {
                ret2[i].diagonal = true;
            }
        }
        // for (let x = 0; x < ret.length; x++) {
        //     ret[x].parent = null
        // }
        return ret.concat(ret2);
    }

}