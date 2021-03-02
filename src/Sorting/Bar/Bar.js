
import React, { Component, useRef } from 'react'
import './Bar.scss'
import { mergeSort } from './Algorithms/topdownmergesort'
import ReactSlider from 'react-slider'
import styled from 'styled-components';
import SideOptions from '../../Sidebar/SideOptions.js'
export default class Bar extends Component {
    constructor(props) {
        super(props)
        this.state = { arraySize: 31, array: [], speed: 200 }
    }
    componentDidMount() {
        this.setState({ array: this.generateRandomArray() })
    }
    generateRandomArray(len = this.state.arraySize, min = 1, max = 100) {
        let array = []
        for (let x = 0; x < len; x++) {
            array.push(Math.floor(Math.random() * (max - min + 1)) + min)
        }
        console.log(array);
        return array
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    animateMergeSort(anims) {
        let speed = this.state.speed
        console.log("speed ", speed);
        anims.forEach((curAnim, index) => {
            setTimeout(() => {
                const bars = document.getElementById("barContainer")
                const info = document.getElementById("info")
                switch (curAnim.type) {

                    case "compare":
                        {

                            const [barOneIdx, barTwoIdx, chosenID] = curAnim.vals;
                            const higher = barTwoIdx == chosenID ? barOneIdx : barTwoIdx

                            info.innerText = `comparing ${bars.children[barOneIdx].style.height.split("%")[0]} and ${bars.children[barTwoIdx].style.height.split("%")[0]}`
                            info.innerText += `\n${bars.children[chosenID].style.height.split("%")[0]} is less than ${bars.children[higher].style.height.split("%")[0]}`


                            //console.log(bars);
                            bars.children[barOneIdx].classList = "bar compare"
                            bars.children[barTwoIdx].classList = "bar compare"
                            bars.children[chosenID].classList = "bar chosen"


                            break;
                        }
                    case "change":
                        const [barOneIdx, newHeight, cleanup] = curAnim.vals;
                        console.log(curAnim.vals);
                        const barOneStyle = bars.children[barOneIdx].style;
                        //bars.children[barOneIdx].innerText = newHeight
                        info.innerText = `setting value`
                        if (cleanup != undefined) {
                            info.innerText += `\none side is empty, adding larger elements at end`
                        }
                        barOneStyle.height = `${newHeight}%`;
                        bars.children[barOneIdx].classList = "bar sorted"

                        break;
                    case "split": {
                        const [leftStartID, leftEndID] = curAnim.left
                        const [rightStartID, rightEndID] = curAnim.right
                        const [middleLeft, middleRight] = curAnim.middle
                        info.innerText = `splitting`
                        console.log(curAnim.middle);

                        console.log(bars.children[middleLeft], bars.children[middleRight]);

                        for (let x = leftStartID; x <= leftEndID; x++) {
                            bars.children[x].classList = "bar left"
                        }
                        for (let x = rightStartID; x <= rightEndID; x++) {
                            bars.children[x].classList = "bar right"
                        }
                        bars.children[middleLeft].classList += " split-left"
                        bars.children[middleRight].classList += " split-right"
                    }
                        break;
                    case "merge": {
                        //anims.push({ type: "merge", start: start, end : end, last: (initialStart == start && initialEnd == end) })// TODO: add last merge checking

                    }
                }
                setTimeout(() => {
                    this.removeLastStep(curAnim)
                }, speed / 2);
            }, index * speed);

        })
    }
    removeLastStep(curAnim = this.lastStep) {
        const bars = document.getElementById("barContainer")
        switch (curAnim.type) {

            case "compare":
                {

                    const [barOneIdx, barTwoIdx, chosenID] = curAnim.vals;
                    const higher = barTwoIdx == chosenID ? barOneIdx : barTwoIdx
                    bars.children[barOneIdx].classList = "bar"
                    bars.children[barTwoIdx].classList.value = "bar"
                    bars.children[chosenID].classList = "bar"
                    break;
                }
            case "change":
                const [barOneIdx, newHeight] = curAnim.vals;

                bars.children[barOneIdx].classList = "bar"
                break;
            case "split": {
                const [leftStartID, leftEndID] = curAnim.left
                const [rightStartID, rightEndID] = curAnim.right
                const [middleLeft, middleRight] = curAnim.middle
                bars.children[middleLeft].classList = "bar"
                bars.children[middleRight].classList = "bar"

                for (let x = leftStartID; x < leftEndID; x++) {
                    bars.children[x].classList = "bar"
                }
                for (let x = rightStartID; x <= rightEndID; x++) {
                    bars.children[x].classList = "bar"
                }


            }

        }
    }
    stepAnimateMergeSort() {
        if (!this.animations || this.animations == null) {
            this.animations = this.mergeSortArray()
        }
        if (this.lastStep) {
            this.removeLastStep()
        }
        let curAnim = this.animations.shift()
        this.lastStep = curAnim
        const bars = document.getElementById("barContainer")
        const info = document.getElementById("info")
        switch (curAnim.type) {

            case "compare":
                {

                    const [barOneIdx, barTwoIdx, chosenID] = curAnim.vals;
                    const higher = barTwoIdx == chosenID ? barOneIdx : barTwoIdx

                    info.innerText = `comparing ${bars.children[barOneIdx].style.height.split("%")[0]} and ${bars.children[barTwoIdx].style.height.split("%")[0]}`
                    info.innerText += `\n${bars.children[chosenID].style.height.split("%")[0]} is less than ${bars.children[higher].style.height.split("%")[0]}`


                    //console.log(bars);
                    bars.children[barOneIdx].classList = "bar compare"
                    bars.children[barTwoIdx].classList = "bar compare"
                    bars.children[chosenID].classList = "bar chosen"


                    break;
                }
            case "change":
                const [barOneIdx, newHeight, cleanup] = curAnim.vals;
                console.log(curAnim.vals);
                const barOneStyle = bars.children[barOneIdx].style;
                //bars.children[barOneIdx].innerText = newHeight
                info.innerText = `setting value`
                if (cleanup != undefined) {
                    info.innerText += `\none side is empty, adding larger elements at end`
                }
                barOneStyle.height = `${newHeight}%`;
                bars.children[barOneIdx].classList = "bar sorted"

                break;
            case "split": {
                //anims.push({ type: "split", left: [startIdx, middleIdx], right: [middleIdx + 1, endIdx] })
                const [leftStartID, leftEndID] = curAnim.left
                const [rightStartID, rightEndID] = curAnim.right
                const [middleLeft, middleRight] = curAnim.middle
                info.innerText = `splitting`
                console.log(curAnim.middle);

                console.log(bars.children[middleLeft], bars.children[middleRight]);

                for (let x = leftStartID; x <= leftEndID; x++) {
                    bars.children[x].classList = "bar left"
                }
                for (let x = rightStartID; x <= rightEndID; x++) {
                    bars.children[x].classList = "bar right"
                }
                bars.children[middleLeft].classList += " split-left"
                bars.children[middleRight].classList += " split-right"
            }
                break;
            case "merge": {
                //anims.push({ type: "merge", start: start, end : end, last: (initialStart == start && initialEnd == end) })// TODO: add last merge checking

            }
        }
    }
    mergeSortArray(animate = false) {
        const anims = []
        let arrayCopy = this.state.array.slice()
        const auxArray = arrayCopy.slice()
        mergeSort(arrayCopy, 0, arrayCopy.length - 1, auxArray, anims)
        console.log(anims);
        console.log(arrayCopy);
        console.log(auxArray);
        if (animate) {
            this.animateMergeSort(anims)
        }
        return anims

    }

    genNewArray(val = 11) {
        this.setState({ array: this.generateRandomArray(val) }, () => this.setState({ arraySize: val }))
    }
    createStyledSliders() {
        const StyledSlider = styled(ReactSlider)`
        width: 25%;
        height: 25px;
    `;

        const StyledThumb = styled.div`
        height: 25px;
        line-height: 25px;
        width: 25px;
        text-align: center;
        background-color: #000;
        color: #fff;
        border-radius: 50%;
        cursor: grab;
    `;

        const Thumb = (props, state) => <StyledThumb {...props}>{props.label}</StyledThumb>;

        const StyledTrack = styled.div`
        top: 0;
        bottom: 0;
        background: ${props => props.index === 2 ? '' : props.index === 1 ? '#0f0' : '#f00'};
        border-radius: 999px;
    `;
        const Track = (props, state) => <StyledTrack {...props} index={state.index} />;
        return (
            <div>
                <StyledSlider
                    onAfterChange={(val) => this.setState({ speed: val })}
                    min={1}
                    max={500}
                    invert={true}
                    defaultValue={this.state.speed}
                    renderTrack={Track}
                    renderThumb={Thumb}
                />
                <StyledSlider
                    onAfterChange={(val) => this.genNewArray(val)}
                    min={1}
                    max={500}
                    defaultValue={this.state.arraySize}
                    renderTrack={Track}
                    renderThumb={Thumb}
                />
            </div>
        )
    }
    speedCallback(sp) {
        this.setState({ speed: sp })

    }
    render() {
        return (
            <div>
                {/* {this.createStyledSliders()} */}
                <div className="container">
                    <div className="container2">
                        <div className="grid-options">
                            <div class="select">
                                <select name="slct" id="slct">
                                    <option value="AStar">Top-Down Merge Sort</option>
                                </select>
                            </div>
                            <div className="header-button" onClick={() => this.mergeSortArray(true)}><span>Sort</span></div>
                            <div className="header-button" onClick={() => this.stepAnimateMergeSort()}> <span>Step</span></div>
                            <div className="header-button" onClick={() => this.genNewArray(this.state.arraySize)}><span>Random</span></div>
                            <div className="size-slider">
                                <div className="size-label">
                                    Size:  {this.state.arraySize}
                                </div>
                                <input className="size" defaultValue={this.state.arraySize} min={5} max={500} type="range" onChange={(e) => { this.genNewArray(e.target.value)}} />
                            </div>
                        </div>
                        <SideOptions solve={() => this.mergeSortArray(true)}
                            speed={(sp) => { this.speedCallback(sp) }}
                            speedValue={this.state.speed}
                            speedMax={200}
                            label ="Sort"
                        >
                        </SideOptions>
                    </div>
                </div>
                <div className="barContainer" id="barContainer">
                    {this.state.array.map((curEle) => { return <div ref={curEle.ref} className="bar" style={{ height: `${curEle}%`, width: `${99 / this.state.array.length}vw`, margin: `${(99 / this.state.array.length) / 50}vw` }}></div> })}
                </div>
                {/* <button onClick={() => this.mergeSortArray(true)}>
                    sort
            </button>
                <button onClick={() => this.genNewArray(this.state.arraySize)}>
                    random
            </button>
                <button onClick={() => this.stepAnimateMergeSort()}>
                    step
            </button>
                 */}
                <div id="info">
                    info
            </div>
            </div>
        )
    }
}
