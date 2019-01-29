import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Punto from './Punto';
import Linea from './Linea';
export default class Hasse extends Component {
    componentDidMount() {
        this.forceUpdate();
    }
    punti(duple) {
        let punti = [];
        let puntihtml = [];
        duple.forEach((key) => {
            const from = key.split(',')[0];
            const to = key.split(',')[1];
            if(punti.indexOf(from)===-1)
                punti.push(from);
            if (punti.indexOf(to)===-1)
                punti.push(to);
        });
        punti.forEach((key) => {
            puntihtml.push(<Punto className={key} top={80 * key+"px"} left="20px">{key}</Punto >);
        });
        return <div>{puntihtml}</div>;
    }
    linee(duple) {
        let linee = [];
        let lineehtml = [];
        duple.forEach((key) => {
            const from = key.split(',')[0];
            const to = key.split(',')[1];
            if (from !== to) 
                if (linee.indexOf(from + "," + to) === -1 && linee.indexOf(to + "," + from) === -1)
                    linee.push(from+","+to);
        });
        linee.forEach((key) => {
            const from = key.split(',')[0];
            const to = key.split(',')[1];
            lineehtml.push(<Linea from={from} to={to}/>);
        });
        return <div>{lineehtml}</div>;
    }
    render() {
        const { relation } = this.props;
        const duple = relation.slice(1, -1).split('>,<').sort();
        return (
            <div>
                {this.punti(duple)}
                {this.linee(duple)}
            </div>
        );
    }
}
Hasse.propTypes = Object.assign({}, {
    relation: PropTypes.string.isRequired
});