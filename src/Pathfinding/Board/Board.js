import React, { Component } from 'react'
import pathfinder from '../pathfinding.js';
import Node from '../Node/Node';

import './board.scss'
import SideOptions from '../../Sidebar/SideOptions.js';
var BOARD_WIDTH = 41
var BOARD_HEIGHT = 15
var START_POS = { x: 2, y: Math.floor(BOARD_HEIGHT / 2) }
var END_POS = { x: BOARD_WIDTH - 3, y: Math.floor(BOARD_HEIGHT / 2) }

export default class Board extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            gridComp: [],
            mouseIsPressed: false,
            lastPressed: null,
            lastSwitched: null,

        }
        this.pathfinder = new pathfinder()
        this.speed = 10;
        this.buttons = true;
    }
    speedCallback(sp) {
        this.speed = sp;
    }
    nodeEquals(n1, n2) {
        if (n1.x === n2.x && n1.y === n2.y) {
            return true
        }
        return false
    }
    accessRef(ele) {
        return this.state.gridComp[ele.y][ele.x].ref.current
    }
    createRecursiveMaze() {
        let resettimeout = this.resetGrid()
        let grid = this.recursiveDivisionGrid()
        console.log(grid);
        setTimeout(() => {


            for (let x = 0; x < grid.length; x++) {
                setTimeout(() => {
                    if (this.state.grid[grid[x].y][grid[x].x].passage) {
                        console.log("p", this.accessRef(this.state.grid[grid[x].y][grid[x].x]));
                        if (this.state.grid[grid[x].y][grid[x].x].extra) {
                            console.log("e", this.accessRef(this.state.grid[grid[x].y][grid[x].x]));
                        }
                        console.log(this.state.grid[grid[x].y][grid[x].x].horizontal);
                    } else {

                    }
                    this.makeWall(grid[x].x, grid[x].y)


                }, x * this.speed);
            }
        }, resettimeout);
    }
    animateRecursiveGrid() {
        let grid = this.recursiveDivisionGrid()
        for (let x = 0; x < grid.length; x++) {
            setTimeout(() => {
                this.makeWall(grid[x].x, grid[x].y)
            }, x * (this.speed * 3));
        }
    }
    aStarSolve() {
        console.log(this.buttons);
        if(!this.buttons){
            return;
        }
        this.removePathOpenCurrent()
        var id = window.setTimeout(function () { }, 0);
        while (id--) {
            window.clearTimeout(id);
            // will do nothing if no timeout with id is present
        }
        let test = this.pathfinder.solveAstar(this.state.grid, START_POS, END_POS)

        this.animateastar(test[0], test[1], 5)

    }
    animateastar(path, open) {
        for (let x = 0; x < open.length; x++) {
            setTimeout(() => {
                this.accessRef(open[x]).className += " current"
                setTimeout(() => {

                    if (open[x - 1]) {
                        this.accessRef(open[x - 1]).className = this.accessRef(open[x - 1]).className.replace(" current", "")
                        this.accessRef(open[x - 1]).className += " open"
                    }
                    if (x === open.length - 1) {
                        this.accessRef(open[x]).className = this.accessRef(open[x]).className.replace(" current", "")
                        this.accessRef(open[x]).className += " open"
                    }
                }, 0);



            }, x * (this.speed * 5));
        }
        if (path.length == 0) {
            setTimeout(() => {

                for (let x = 0; x < open.length; x++) {
                    setTimeout(() => {
                        this.accessRef(open[x]).className += " noPath"
                    }, x * (this.speed * 1));

                }

            }, (open.length * (this.speed * 5)));
        }
        setTimeout(() => {
            for (let x = 0; x < path.length; x++) {
                setTimeout(() => {
                    console.log("test");
                    if (!path[x].start && !path[x].end) {
                        this.accessRef(path[x]).className = "node path"
                    }
                }, x * (this.speed * 7.5));

            }
        }, (open.length * (this.speed * 5)) + 100);






    }
    resetGrid(wipe = false) {
        this.buttons = false
        var id = window.setTimeout(function () { }, 0);
        while (id--) {
            window.clearTimeout(id);
            // will do nothing if no timeout with id is present
        }
        let firstNonNode = null
        let lastNonNode = null
        for (let y = 0; y < this.state.grid.length; y++) {
            for (let x = 0; x < this.state.grid[y].length; x++) {
                if (firstNonNode == null || x < firstNonNode) {
                    if (!["node start", "node end", "node"].includes(this.accessRef(this.state.grid[y][x]).className)) {
                        firstNonNode = x
                    }
                }
                if (lastNonNode == null || x > lastNonNode) {
                    if (!["node start", "node end", "node"].includes(this.accessRef(this.state.grid[y][x]).className)) {
                        lastNonNode = x
                    }
                }
                if (this.state.grid[y][x].wall) {
                    this.state.grid[y][x].wall = false
                }
                if (this.state.grid[y][x].start || this.state.grid[y][x].end) {
                    continue
                }
                if (!wipe) {
                    this.accessRef(this.state.grid[y][x]).className = "node"
                    this.buttons= true;
                }

            }
        }
        if (firstNonNode == null) {
            firstNonNode = 0
        }
        if (lastNonNode == null) {
            lastNonNode = this.state.grid[0].length - 1
        }
        if (wipe) {
            for (let x = firstNonNode; x <= lastNonNode; x++) {

                // console.log(x);
                setTimeout(() => {
                    for (let y = 0; y < this.state.grid.length; y++) {

                        if (this.state.grid[y][x].start || this.state.grid[y][x].end) {
                            this.accessRef(this.state.grid[y][x]).className += " wipe"

                        } else {
                            this.accessRef(this.state.grid[y][x]).className = "node wipe"
                        }
                        setTimeout(() => {
                            this.accessRef(this.state.grid[y][x]).className = this.accessRef(this.state.grid[y][x]).className.replace(" wipe", "")
                        }, 300);
                    }
                }, 45 * x);
            }

            return (45 * this.state.grid[0].length) + 300
        }
        return 0

    }
    removePathOpenCurrent() {
        for (let y = 0; y < this.state.grid.length; y++) {
            for (let x = 0; x < this.state.grid[y].length; x++) {
                if (this.accessRef(this.state.grid[y][x]).className.includes("path") || this.accessRef(this.state.grid[y][x]).className.includes("open") || this.accessRef(this.state.grid[y][x]).className.includes("current")) {
                    this.accessRef(this.state.grid[y][x]).className = "node"
                }
            }
        }
    }
    resetStartEnd(reset) {

        // START_POS.x = this.randomNumber(1, BOARD_WIDTH - 2)
        // START_POS.y = this.randomNumber(1, BOARD_HEIGHT - 2)

        // END_POS.x = this.randomNumber(1, BOARD_WIDTH - 2)
        // END_POS.y = this.randomNumber(1, BOARD_HEIGHT - 2)
        // while (END_POS.x == START_POS.x && START_POS.y == END_POS.y) {
        //     END_POS.x = this.randomNumber(1, BOARD_WIDTH - 2)
        //     END_POS.y = this.randomNumber(1, BOARD_HEIGHT - 2)
        // }
        if (reset) {
            this.state.grid[START_POS.y][START_POS.x].start = true
            this.state.grid[END_POS.y][END_POS.x].end = true
            this.accessRef(START_POS).className = "node start"
            this.accessRef(END_POS).className = "node end"
        }
        console.log(START_POS);
        console.log(END_POS);
    }
    componentDidMount() {
        console.log(new pathfinder().astar);
        this.resetStartEnd()
        let grids = this.createBlankGrid()
        console.log(grids[0]);
        this.setState({ grid: grids[0], gridComp: grids[1] })
    }
    componentWillUnmount(){
        var id = window.setTimeout(function () { }, 0);
        while (id--) {
            window.clearTimeout(id);
            // will do nothing if no timeout with id is present
        }
    }
    render() {
        return (
            <div className="container pathfinding">
                <div className="container2 pathfinding">
                    <div className="grid-options pathfinding">
                        <div class="select">
                            <select name="slct" id="slct">
                                <option value="AStar">A* Search</option>
                            </select>
                        </div>
                        <div className="header-button" onClick={() => this.aStarSolve()}><span>Solve</span></div>
                        <div class="select">
                            <select name="slct" id="slct">
                                <option value="RecDiv">Recursive Division</option>
                            </select>
                        </div>
                        <div className="header-button" onClick={() => this.createRecursiveMaze()}><span>Create</span></div>
                        <div className="header-button" onClick={() => {
                            setTimeout(() => {
                                this.buttons = true;
                                console.log(this.buttons);
                            }, this.resetGrid(true));
                        }}><span>RESET GRID</span></div>

                    </div>
                    <SideOptions solve={() => this.aStarSolve()}
                        speed={(sp) => { this.speedCallback(sp) }}
                        speedValue={this.speed}
                        speedMax = {30}
                        label="Solve"
                    >
                    </SideOptions>
                </div>



                <div className="grid">
                    {this.state.gridComp.map((row, rowid) =>
                        // <div id={rowid} className="row"> {row.map((item) => (item.node))} </div>
                        row.map((item) => (item.node))
                    )
                    } </div>
            </div>
        )
    }
    handleGridItemChange(ref, x, y) {
        if (this.state.grid[y][x].start || this.state.grid[y][x].end) {
            return
        }
        let className = ref.current.className
        switch (className) {
            case "node wall":
                this.makeNode(x, y)
                break;
            default:
                this.makeWall(x, y)
                break;
        }


    }
    isStartOrEnd(x, y) {
        //console.log(x, y);
        return this.state.grid[y][x].start || this.state.grid[y][x].end
    }
    makeWall(x, y) {
        if (this.isStartOrEnd(x, y)) {
            return
        }
        this.state.grid[y][x].wall = true
        this.accessRef(this.state.grid[y][x]).className = "node wall"
    }
    makeNode(x, y) {
        if (this.isStartOrEnd(x, y)) {
            return
        }
        this.state.grid[y][x].wall = false
        this.accessRef(this.state.grid[y][x]).className = "node"
    }
    handleMouseDown(ref, x, y) {
        if (this.nodeEquals({ x, y }, START_POS)) {
            console.log("start");
            this.state.lastPressed = "start"
            this.state.lastSwitched = { x, y }
            return
        }
        if (this.nodeEquals({ x, y }, END_POS)) {
            console.log("end");
            this.state.lastPressed = "end"
            this.state.lastSwitched = { x, y }
            return
        }
        this.setState({ mouseIsPressed: true })

        this.handleGridItemChange(ref, x, y, true)
        // ref.current.className.includes("wall") ? this.state.grid[y][x].wall = true : this.state.grid[y][x].wall = false
    }
    setStartEnd(x, y) {
        switch (this.state.lastPressed) {
            case "start":
                this.state.grid[START_POS.y][START_POS.x].start = false
                START_POS = { x, y }
                this.state.grid[START_POS.y][START_POS.x].start = true
                break;

            case "end":
                this.state.grid[END_POS.y][END_POS.x].end = false
                END_POS = { x, y }
                this.state.grid[END_POS.y][END_POS.x].end = true
                break;
        }
        switch (this.accessRef(this.state.lastSwitched).className) {
            case "node start":
                this.state.grid[START_POS.y][START_POS.x].start = false
                START_POS = this.state.lastSwitched
                this.state.grid[START_POS.y][START_POS.x].start = true
                break;

            case "node end":
                this.state.grid[END_POS.y][END_POS.x].end = false
                END_POS = this.state.lastSwitched
                this.state.grid[END_POS.y][END_POS.x].end = true
                break;
        }
    }
    handleMouseEnter(ref, x, y) {
        if (this.state.lastPressed != null) {
            console.log(x, y);
            console.log(this.state.lastSwitched);
            this.accessRef(this.state.lastSwitched).className = this.accessRef({ x, y }).className
            ref.current.className = "node " + this.state.lastPressed

            this.setStartEnd(x, y)
            this.state.lastSwitched = { x, y }
        }
        if (!this.state.mouseIsPressed) {
            return
        }
        this.handleGridItemChange(ref, x, y)
        // ref.current.className.includes("wall") ? ref.current.className = "node" : ref.current.className = "node wall"
        // ref.current.className.includes("wall") ? this.state.grid[y][x].wall = true : this.state.grid[y][x].wall = false
    }
    handleMouseUp(ref, x, y) {
        if (this.state.lastPressed != null) {
            //ref.current.className = "node " + this.state.lastPressed

            this.setStartEnd(x, y)
            this.state.lastPressed = null
            this.state.lastSwitched = null
        }
        this.setState({ mouseIsPressed: false })
        console.log("mouse up");

    }
    createBlankGrid() {
        let grid = [];
        let gridcomp = []
        for (let y = 0; y < Math.floor(BOARD_HEIGHT); y++) {
            let row = [];
            let rowcomp = []
            for (let x = 0; x < BOARD_WIDTH; x++) {
                let curref = React.createRef()
                let type = this.nodeEquals({ x: x, y: y }, START_POS) ? " start" : this.nodeEquals({ x: x, y: y }, END_POS) ? " end" : ""
                let curnode = (< Node x={x}
                    y={y}
                    mouseIsPressed={this.state.mouseIsPressed}
                    onMouseDown={
                        (ref) => this.handleMouseDown(ref, x, y)}
                    onMouseEnter={
                        (ref) => this.handleMouseEnter(ref, x, y)}
                    onMouseUp={
                        (ref) => this.handleMouseUp(ref, x, y)}
                    refpass={curref}
                    type={"node" + type}
                >
                </Node>)
                let curitem = {
                    x: x,
                    y: y,
                    f: Infinity,
                    h: 0,
                    g: 0,
                    start: type == " start",
                    end: type == " end",
                    wall: false
                }
                row.push(curitem)
                let curcomp = {
                    x: x,
                    y: y,
                    node: curnode,
                    ref: curref
                }
                rowcomp.push(curcomp)
            }
            grid.push(row)
            gridcomp.push(rowcomp)
        }
        let test = []
        test.push(grid)
        test.push(gridcomp)
        return test
    }
    recursiveDivisionGrid() {

        let width = this.state.grid[0].length
        let height = this.state.grid.length
        let cells = []
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (y == 0 || y == height - 1) {
                    cells.push({ x, y })
                    //this.makeWall(x, y)
                }
            }

            //this.makeWall(0, y)
            cells.push({ x: 0, y })
            //this.makeWall(width - 1, y)
            cells.push({ x: width - 1, y })

        }
        return cells.concat(this.divide(true, 2, width - 3, 2, height - 3, [], true))

    }
    divide(h, minX, maxX, minY, maxY, animationCells = [], initial = false) {
        console.log(initial);
        console.log("haha");
        if (initial) {
            h = true
        }
        if (maxY - minY > maxX - minX || (maxY - minY == maxX - minX) && Math.floor(Math.random() * 2) == 1) {
            // if (h) {
            if (maxX - minX < 1) {
                return animationCells
            }

            var y = Math.floor(this.randomNumber(minY, maxY) / 2) * 2
            if (initial) {
                console.log("apples");
                y = minY + Math.floor((maxY - minX) / 2)
            }
            animationCells = animationCells.concat(this.addHWall(minX, maxX, y))

            animationCells = animationCells.concat(this.divide(!h, minX, maxX, minY, y - 2))
            animationCells = animationCells.concat(this.divide(!h, minX, maxX, y + 2, maxY))
        } else {
            if (maxY - minY < 1) {
                return animationCells
            }

            var x = Math.floor(this.randomNumber(minX, maxX) / 2) * 2
            animationCells = animationCells.concat(this.addVWall(minY, maxY, x))

            animationCells = animationCells.concat(this.divide(!h, minX, x - 2, minY, maxY))
            animationCells = animationCells.concat(this.divide(!h, x + 2, maxX, minY, maxY))
        }
        return animationCells

    }
    addHWall(minX, maxX, y) {
        let cells = []
        var hole = Math.floor(this.randomNumber(minX, maxX) / 2) * 2 + 1
        var hole2 = Math.floor(this.randomNumber(minX, maxX) / 2) * 2 + 1
        console.log(minX, maxX, hole);
        hole2 = 999
        for (var i = minX - 1; i <= maxX + 1; i++) {
            if (i === hole || i === hole2) {
                this.makeNode(i, y)
                continue
            }
            cells.push({ x: i, y: y })
        }
        return cells
    }

    addVWall(minY, maxY, x) {
        let cells = []
        var hole = Math.floor(this.randomNumber(minY, maxY) / 2) * 2 + 1

        var hole2 = Math.floor(this.randomNumber(minY, maxY) / 2) * 2 + 1;
        console.log(minY, maxY, hole);
        hole2 = 999
        for (var i = minY - 1; i <= maxY + 1; i++) {
            if (i === hole || i === hole2) {
                this.makeNode(x, i)
                continue
            }
            cells.push({ x: x, y: i })
        }
        return cells
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}