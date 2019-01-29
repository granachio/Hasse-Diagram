import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Punto from './Punto';
import Linea from './Linea';
export default class Hasse extends Component {
    state = {
        attivo:false
    }
    punti(duple) {
        let punti = [];
        let puntihtml = [];
        let puntiposition = [];
        duple.forEach((key) => {
            const from = key.split(',')[0];
            const to = key.split(',')[1];
            if (punti.indexOf(from) === -1)
                punti.push(from);
            if (punti.indexOf(to) === -1)
                punti.push(to);
        });
        punti.forEach((key) => {
            if (puntiposition.length > 0) {
                let aggiunto = false;
                for (let i = 0; i < puntiposition.length && !aggiunto; i++) {
                    let riga = puntiposition[i];
                    let elem = riga[0];
                    if (this.ordine(key, elem, duple) === 0) {
                        puntiposition[i].push(key);
                        aggiunto = true;
                    }
                    else if (this.ordine(key, elem, duple) === 1) {
                        puntiposition.splice(i, 0, [key]);
                        aggiunto = true;
                    }
                }
                if (!aggiunto)
                    puntiposition.push([key]);
            }
            else
                puntiposition.push([key]);
        });
        console.log(puntiposition);
        for (let i = 0; i < puntiposition.length; i++)
            for (let j = 0; j < puntiposition[i].length; j++) {
                puntihtml.push(<Punto className={puntiposition[i][j]} top={80 * i + 475 + "px"} left={80 * j + 180 + "px"}>{puntiposition[i][j]}</Punto >);
            }
        this.timerr = setTimeout(() => {
            this.setState({ attivo: true });
        }, 1);
        return <div>{puntihtml}</div>;
    }
    ordine(a, b, r) {
        let first = [];
        let second = [];
        r.forEach((m) => {

            let parts = m.split(",");
            if (parts[0] !== parts[1]) {
                first.push(parts[0]);
                second.push(parts[1]);
            }
        });
        for (let i = 0; i < first.length; i++) {
            let primo = first[i];
            let secondo = second[i];
            if (primo === a && secondo === b)
                return -1;
            if (primo === b && secondo === a)
                return 1;
        }
        return 0;
    }
    linee(duple) {
        let linee = [];
        let lineehtml = [];
        duple.forEach((key) => {
            const from = key.split(',')[0];
            const to = key.split(',')[1];
            if (from !== to)
                if (linee.indexOf(from + "," + to) === -1 && linee.indexOf(to + "," + from) === -1)
                    linee.push(from + "," + to);
        });
        linee.forEach((key) => {
            const from = key.split(',')[0];
            const to = key.split(',')[1];
            lineehtml.push(<Linea from={from} to={to} />);
        });
        return <div>{lineehtml}</div>;
    }
    render() {
        const { relation } = this.props;
        const duple = relation.slice(1, -1).split('>,<').sort();
        return (
            <div>
                {this.punti(duple)}
                {this.state.attivo?this.linee(duple):""}
            </div>
        );
    }
}
Hasse.propTypes = Object.assign({}, {
    relation: PropTypes.string.isRequired
});