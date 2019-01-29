import PropTypes from 'prop-types';
import React, { Component } from 'react';
export default class Punto extends Component {
    render() {
        const { top, left, className } = this.props;
        const style = { top, left, backgroundColor: 'black', borderRadius: '100%', height: '25px', width: '25px', zIndex: 9, position: 'absolute', textAlign: 'center', color: 'white' };
        return (
            <div
                className={className}
                style={style}
            >
                <p style={{ fontSize: '10px', margin: 0, lineHeight: '25px' }}>
                    {this.props.children}
                </p>
            </div>
        );
    }
}
Punto.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    left: PropTypes.string,
    top: PropTypes.string
};