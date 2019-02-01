import React, { Component } from 'react';
import { render } from 'react-dom';
import Programma from './pages/programma';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
const themel = createMuiTheme({
    palette: {
        type: 'light'
    }
});
const themed = createMuiTheme({
    palette: {
        type: 'dark'
    }
});
class Main extends Component {
    state = {
        light: true
    };
    tema = () => {
        this.setState({ light: !this.state.light });
    };
    render() {
        return (
            <MuiThemeProvider theme={this.state.light ? themel : themed}>
                <CssBaseline />
                <Programma tema={this.tema}  />
            </MuiThemeProvider>
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