import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Riga from './Riga';
export default class Linea extends Component {
    linea() {
        const { from, to } = this.props;
        const a = document.getElementsByClassName(from)[0];
        const b = document.getElementsByClassName(to)[0];
        if (!a || !b) {
            return false;
        }
        const box0 = a.getBoundingClientRect();
        const box1 = b.getBoundingClientRect();
        let offsetX = window.pageXOffset;
        let offsetY = window.pageYOffset;
        let x0 = box0.left + box0.width / 2 + offsetX;
        let x1 = box1.left + box1.width / 2 + offsetX;
        let y0 = box0.top + box0.height / 2 + offsetY;
        let y1 = box1.top + box1.height / 2 + offsetY;
        if (x0 >= x1) {
            y0 += 2;
            y1 += 2;
        }
        else {
            y0 -= 2;
            y1 -= 2;
        }
        if (y0 <= y1) {
            x0 += 2;
            x1 += 2;
        }
        else {
            x0 -= 2;
            x1 -= 2;
        }
        return { x0, y0, x1, y1 };
    }
    render() {
        const punti = this.linea();
        return punti ? <Riga {...punti} {...this.props} /> : null;
    }
}
Linea.propTypes = Object.assign({}, {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
});