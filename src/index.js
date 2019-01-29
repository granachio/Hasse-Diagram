import React, { Component } from 'react';
import { render } from 'react-dom';
import Programma from './pages/programma';
class Main extends Component {

    render() {
        return (
          <Programma />
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
    <Main />,
    getRootElement()
);