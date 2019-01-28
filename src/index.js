import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { render } from 'react-dom';
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
        let x0 = box0.left + box0.width/2 + offsetX;
        let x1 = box1.left + box1.width/2 + offsetX;
        let y0 = box0.top + box0.height/2 + offsetY;
        let y1 = box1.top + box1.height/2 + offsetY;
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
        return punti ? (
            <Riga {...punti} {...this.props} />
        ) : null;
    }
}
Linea.propTypes = Object.assign({}, {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
});
export class Riga extends Component {
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
        };
        const style = {
            borderTopColor: 'black',
            borderTopStyle: 'solid',
            borderTopWidth: 4,
        };
        const props = {
            className: this.props.className,
            style: Object.assign({}, style, linea),
        }
        return (
            <div
                ref={(el) => { this.el = el; }}
                {...props}
            />
        );
    }
}
Riga.propTypes = Object.assign({}, {
    x0: PropTypes.number.isRequired,
    y0: PropTypes.number.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
});
class Punto extends Component {
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
    children: PropTypes.any,
    top: PropTypes.string,
    left: PropTypes.string,
    className: PropTypes.string,
};

class Test extends Component {
    componentDidMount() {
        this.forceUpdate();
    }
    render() {
        return (
            <div>
                <Punto
                    className="A"
                    top="80px"
                    left="20px"
                >A</Punto>
                <Punto
                    className="B"
                    top="80px"
                    left="200px"
                >B</Punto>
                <Punto
                    className="C"
                    top="200px"
                    left="200px"
                >C</Punto>
                <Punto
                    className="D"
                    top="200px"
                    left="20px"
                >D</Punto>
                <Linea
                    from="A"
                    to="B"
                />
                <Linea
                    from="B"
                    to="C"
                />
                <Linea
                    from="C"
                    to="D"
                />
                <Linea
                    from="D"
                    to="A"
                />
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