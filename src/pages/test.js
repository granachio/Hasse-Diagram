import React, { Component } from 'react';
import Hasse from '../utils/Hasse';
export default class Test extends Component {

    render() {
        return (
            <div>
                <Hasse relation="<1,2>,<2,1>,<1,1>,<1,3>,<2,3>,<4,4>,<6,7>,<7,7>,<6,6>,<4,4>,<3,3>,<2,2>" />
            </div>
        );
    }
}