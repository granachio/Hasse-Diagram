import React, { Component } from 'react';
import Hasse from "../utils/Hasse";
export default class Programma extends Component {
    state = {
        A: '',
        B: '',
        R: '',
        ok: false,
        riflessiva: false,
        simmetrica: false,
        transitiva: false,
        antisimmetrica: false,
        reticolo: false,
        equivalenza: false,
        poset: false,
        eleMax: [],
        eleMin: [],
        hasse: null
    };
    cambia = (name) => event => {
        this.setState({
            [name]: event.target.value
        });
    };
    controlla = () => {
        this.setState({ ok: false, hasse: null, riflessiva: false, simmetrica: false, transitiva: false, antisimmetrica: false, reticolo: false, equivalenza: false, poset: false, eleMax: [], eleMin: [] });
        const c = this.state.R;
        const insiemeA = this.state.A.split(',');
        const insiemeB = this.state.B.split(',');
        let pattern = new RegExp("<([a-zA-Z0-9]+,[a-zA-Z0-9]+)>", "ig");
        let first = [];
        let second = [];
        let match;
        while ((match = pattern.exec(c)) !== null) {
            let mat = match[1];
            let parts = mat.split(",");
            first.push(parts[0]);
            second.push(parts[1]);
        }
        if (!this.checkInsieme(insiemeA, first) || !this.checkInsieme(insiemeB, second)) {
            alert("Relazione incompatibile con Insiemi di partenza e arrivo.");
            return;
        }
        let riflessiva = this.isRiflessiva(first, second);
        let simmetrica = this.isSimmetrica(first, second);
        let transitiva = this.isTransitiva(first, second);
        let antisimmetrica = this.isAntisimmetrica(first, second);
        let reticolo = this.isReticolo(first, second);
        let equivalenza = riflessiva && simmetrica && transitiva;
        let poset = riflessiva && antisimmetrica && transitiva;
        let eleMax = [];
        let eleMin = [];
        let hasse = null;
        if (poset) {
            eleMax = this.elementiMassimali(first, second);
            eleMin = this.elementiMinimali(first, second);
            hasse = <Hasse relation={c} />;
        }
        this.setState({ ok: true, riflessiva, simmetrica, transitiva, antisimmetrica, reticolo, equivalenza, poset, eleMax, eleMin, hasse });
            this.forceUpdate();
    }
    isRiflessiva(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            let simmetrico = false;
            for (let j = 0; j < a.length; j++)
                if (a[j] === a[i])
                    if (a[j] === b[j])
                        simmetrico = true;
            if (!simmetrico)
                return false;
        }
        for (let i = 0; i < b.length; i++) {
            let simmetrico = false;
            for (let j = 0; j < b.length; j++)
                if (b[j] === b[i])
                    if (b[j] === a[j])
                        simmetrico = true;
            if (!simmetrico)
                return false;
        }
        return true;
    }
    isSimmetrica(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            let simmetrico = false;
            for (let j = 0; j < a.length; j++)
                if (a[j] === b[i] && b[j] === a[i])
                    simmetrico = true;
            if (!simmetrico)
                return false;
        }
        return true;
    }
    isTransitiva(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            let sx = a[i];
            let dx = b[i];
            let transitivo = false;
            for (let j = 0; j < a.length; j++) {
                let dx1 = "";
                transitivo = false;
                if (a[j] === dx) {
                    dx1 = b[j];
                    for (let k = 0; k < a.length; k++)
                        if (a[k] === sx && b[k] === dx1)
                            transitivo = true;
                    if (!transitivo)
                        return false;
                }
            }

        }
        return true;
    }
    isAntisimmetrica(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            let sx = a[i];
            let dx = b[i];
            for (let j = 0; j < a.length; j++)
                if (a[j] === dx && i !== j)
                    if (b[j] === sx)
                        return false;
        }
        return true;
    }
    elementiMassimali(a, b) {
        if (a.length !== b.length)
            return null;
        let array = [];
        let index = 0;
        for (let i = 0; i < a.length; i++) {
            let continua = true;
            if (a[i] !== b[i])
                continua = false;
            for (let j = 0; j < a.length && continua; j++)
                if (a[j] === a[i] && i !== j)
                    if (a[j] !== b[j])
                        continua = false;
            if (continua) {
                array.push(a[i]);
                index++;
            }
        }
        if (index === 0)
            return null;
        return array;
    }
    elementiMinimali(a, b) {
        if (a.length !== b.length)
            return null;
        let array = [];
        let index = 0;
        for (let i = 0; i < b.length; i++) {
            let continua = true;
            if (b[i] !== a[i])
                continua = false;
            for (let j = 0; j < b.length && continua; j++)
                if (b[j] === b[i] && i !== j)
                    if (b[j] !== a[j])
                        continua = false;
            if (continua) {
                array.push(b[i]);
                index++;
            }
        }
        if (index === 0)
            return null;
        return array;
    }
    isReticolo(a, b) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++)
            for (let j = i + 1; j < b.length; j++)
                if (!(this.checkJoin(a, b, a[i], b[j]) && this.checkMeet(a, b, a[i], b[j])))
                    return false;
        return true;
    }
    checkJoin(a, b, e1, e2) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] === e1) {
                let dx = b[i];
                for (let j = 0; j < a.length; j++)
                    if (a[j] === e2)
                        if (b[j] === dx)
                            return true;
            }
        }
        return false;
    }
    checkMeet(a, b, e1, e2) {
        for (let i = 0; i < b.length; i++) {
            if (b[i] === e1) {
                let sx = a[i];
                for (let j = 0; j < b.length; j++)
                    if (b[j] === e2)
                        if (a[j] === sx)
                            return true;
            }
        }
        return false;
    }
    checkInsieme(insieme, elementiRelazione) {
        for (let i = 0; i < elementiRelazione.length; i++) {
            let equal = false;
            for (let j = 0; j < insieme.length; j++)
                if (elementiRelazione[i] === insieme[j])
                    equal = true;
            if (!equal)
                return false;
        }
        return true;
    }
    render() {
        return (
            <div>
                <input type="text" style={{ width: '200px' }} placeholder="Insieme Partenza A (1,2,3)" onChange={this.cambia('A')} />
                <br />
                <input type="text" style={{ width: '200px' }} placeholder="Insieme Arrivo B (1,2)" onChange={this.cambia('B')} />
                <br />
                <input type="text" style={{ width: '200px' }} placeholder="Relazione AxB (<1,2>,<3,2>)" onChange={this.cambia('R')} />
                <br />
                <input type="button" value="Calcola" onClick={this.controlla} />
                {this.state.ok ?
                    <div>
                        <div style={{ display: 'flex' }}>
                            <p>Riflessiva:&nbsp;</p>
                            <p>{this.state.riflessiva ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Transitiva:&nbsp;</p>
                            <p>{this.state.transitiva ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Simmetrica:&nbsp;</p>
                            <p>{this.state.simmetrica ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Antisimmetrica:&nbsp;</p>
                            <p>{this.state.antisimmetrica ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Relazione di Equivalenza:&nbsp;</p>
                            <p>{this.state.equivalenza ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Insieme parzialmente ordinato (poset):&nbsp;</p>
                            <p>{this.state.poset ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Reticolo:&nbsp;</p>
                            <p>{this.state.reticolo ? "Sì" : "No"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Massimali:&nbsp;</p>
                            <p>{this.state.poset ? this.state.eleMax.join(',') : "N/A"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Minimali:&nbsp;</p>
                            <p>{this.state.poset ? this.state.eleMin.join(',') : "N/A"}</p>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <p>Diagramma di Hasse:</p>
                            <p>{this.state.hasse !== null ? this.state.hasse : "N/A"}</p>
                        </div>
                    </div>
                    : ''}
            </div>
        );
    }
}