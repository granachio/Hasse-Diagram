import PropTypes from 'prop-types';
import React, { Component } from 'react';
export default class Riga extends Component {
    
    render() {
        const { x0, y0, x1, y1 } = this.props;
        const dy = y1 - y0;
        const dx = x1 - x0;
        const angolo = Math.atan2(dy, dx) * 180 / Math.PI;
        const length = Math.sqrt(dx * dx + dy * dy);
        const linea = {
            position: 'absolute',
            top: `${y0}px`,
            left: `${x0}px`,
            width: `${length}px`,
            transform: `rotate(${angolo}deg)`,
            transformOrigin: '0 0',
            borderTopColor: 'black',
            borderTopStyle: 'solid',
            borderTopWidth: 4
        };
       
        return (
            <div
                style={linea}

            />
        );
    }
}
Riga.propTypes = Object.assign({}, {
    x0: PropTypes.number.isRequired,
    y0: PropTypes.number.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired
});