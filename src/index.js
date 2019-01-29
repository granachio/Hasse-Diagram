import React, { Component } from 'react';
import { render } from 'react-dom';
import Hasse from './utils/Hasse';
class Test extends Component {

    render() {
        return (
            <div>
               <Hasse relation="<1,2>,<2,1>,<1,1>,<1,3>,<2,3>,<4,4>,<6,7>,<7,7>,<6,6>,<4,4>,<3,3>,<2,2>"/>
            </div>
        );
    }
}
function createRootElement() {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
    return root;
}
function getRootElement() {
    return document.getElementById('root') ||
        createRootElement();
}
render(
    <Test />,
    getRootElement()
);