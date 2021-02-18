import React, { Component } from 'react'
import Board from './Pathfinding/Board/Board'
import { Tab, TabPanel, Tabs, TabList } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Sorting from './Sorting/Sorting';
export default class Main extends Component {
    render() {
        return (
            <Tabs>
            <TabList>
                <Tab>Pathfinding </Tab>
                <Tab>Sorting </Tab>
            </TabList>
            <TabPanel>
            <Board></Board>
            </TabPanel>
            <TabPanel>
                <Sorting></Sorting>
            </TabPanel>
        </Tabs>

        )
    }
}
