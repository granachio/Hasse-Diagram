import React, { Component } from 'react';
import Hasse from "../utils/Hasse";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { InvertColors, Language } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import '../css/index.css';
import { withStyles } from '@material-ui/core/styles';
const styles = {
    header: {
        flex: '0 1 auto',
        position: 'relative',
        'z-index': 1,
        'box-shadow': 'unset'
    },
    toolbar: {
        alignItems: 'center',
        justifyContent: 'space-between',
        textOverflow: 'ellipsis',
        whiteSpace: 'noWrap',
        overflow: 'hidden'
    }
};
const lingue = [
    'Italiano', 'English'
];
const traduzioni = {
    Italiano: {
        titolo: "Hasse-Diagram",
        insA: "Insieme Partenza A: 1,2,3",
        insB: "Insieme Arrivo B: 1,2,3",
        R: "Relazione AxB (<1,2>,<3,2>)",
        calcola: "Calcola",
        riflessiva: "Riflessiva",
        transitiva: "Transitiva",
        simmetrica: "Simmetrica",
        antisimmetrica: "Antisimmetrica",
        equivalenza: "Relazione di Equivalenza",
        poset: "Insieme parzialmente ordinato (poset)",
        tordinato: "Insieme totalmente ordinato",
        reticolo: "Reticolo",
        massimali: "Massimali",
        minimali: "Minimali",
        hasse: "Diagramma di Hasse",
        si: "Sì",
        no: "No",
        incomp: "Relazione incompatibile con insiemi di partenza e arrivo!",
        invalid: "Insiemi di partenza non validi!",
        errore: "Errore nell'input",
        chiudi: "Chiudi",
        proprieta: "Proprietà"
    },
    English: {
        titolo: "Hasse-Diagram",
        insA: "Departure Set A: 1,2,3",
        insB: "Arrival Set B: 1,2,3",
        R: "Relation AxB (<1,2>,<3,2>)",
        calcola: "Execute",
        riflessiva: "Reflexive",
        transitiva: "Transitive",
        simmetrica: "Symmetric",
        antisimmetrica: "Antisymmetric",
        equivalenza: "Equivalence Relation",
        poset: "Partially Ordered Set (poset)",
        tordinato: "Totally Ordered Set",
        reticolo: "Grid",
        massimali: "Maximal",
        minimali: "Minimal",
        hasse: "Hasse Diagram",
        si: "Yes",
        no: "No",
        incomp: "Incompatible relation with sets of departure and arrival!",
        invalid: "Invalid Departure and Arrival Sets!",
        errore: "Input Error",
        chiudi: "Close",
        proprieta: "Properties"
    }
};
const ITEM_HEIGHT = 48;
class Programma extends Component {
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
        insiemeTotalmenteOrdinato: false,
        equivalenza: false,
        poset: false,
        eleMax: [],
        eleMin: [],
        hasse: null,
        aperto: null,
        daperto: false,
        dialogo: '',
        lingua: "Italiano"
    };
    cambia = (name) => event => {
        this.setState({
            [name]: event.target.value
        });
    };
    chiudiLingue = () => {
        this.setState({ aperto: null });
    };
    cambiaLingua = (lingua) => {
        this.setState({ aperto: null, lingua });
    }
    apriLingue = event => {
        this.setState({ aperto: event.currentTarget });
    };
    apriDialogo = testo => {
        this.setState({ daperto: true, dialogo: testo });
    };
    chiudiDialogo = () => {
        this.setState({ daperto: false });
    };
    controlla = () => {
        this.setState({ ok: false, hasse: null, riflessiva: false, simmetrica: false, transitiva: false, antisimmetrica: false, reticolo: false, insiemeTotalmenteOrdinato: false, equivalenza: false, poset: false, eleMax: [], eleMin: [] });
        const c = this.state.R;
        if (this.state.A.length === 0 || this.state.B.length === 0) {
            this.apriDialogo(traduzioni[this.state.lingua].invalid);
            return;
        }
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
            this.apriDialogo(traduzioni[this.state.lingua].incomp);
            return;
        }
        let riflessiva = this.isRiflessiva(first, second);
        let simmetrica = this.isSimmetrica(first, second);
        let transitiva = this.isTransitiva(first, second);
        let antisimmetrica = this.isAntisimmetrica(first, second);
        let reticolo = this.isReticolo(first, second);
        let insiemeTotalmenteOrdinato = false;
        let equivalenza = riflessiva && simmetrica && transitiva;
        let poset = riflessiva && antisimmetrica && transitiva;
        let eleMax = [];
        let eleMin = [];
        let hasse = null;
        if (poset) {
            eleMax = this.elementiMassimali(first, second);
            eleMin = this.elementiMinimali(first, second);
            hasse = <Hasse relation={c} />;
            insiemeTotalmenteOrdinato = this.isInsiemeTotalmenteOrdinato(first, second);
        }
        this.setState({ ok: true, riflessiva, simmetrica, transitiva, antisimmetrica, reticolo, insiemeTotalmenteOrdinato, equivalenza, poset, eleMax, eleMin, hasse });
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
    // Funzione da richiamare solo su POSET.
    isInsiemeTotalmenteOrdinato(a, b) {
        var a1 = [], b1 = [];
        let index = 0;
        for (let i = 0; i < a.length; i++) {
            if (!a1.includes(a[i])) {
                a1[index] = a[i];
                b1[index] = b[i];
                index++;
            }
        }
        for (let i = 0; i < a1.length; i++) {
            for (let j = 0; j < b1.length; j++) {
                let sx = a1[i];
                let dx = b1[j];
                let match = false;
                if (sx !== dx) {
                    for (let k = 0; k < a.length; k++) {
                        if ((a[k] === sx && b[k] === dx) || (a[k] === dx && b[k] === sx)) {
                            match = true;
                            break;
                        }
                    }
                    if (!match)
                        return false;
                }
            }
        }
        return true;
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.state.daperto}
                    onClose={this.chiudiDialogo}
                >
                    <DialogTitle>{traduzioni[this.state.lingua].errore}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.dialogo}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.chiudiDialogo} color="primary">
                            {traduzioni[this.state.lingua].chiudi}
                        </Button>
                    </DialogActions>
                </Dialog>
                <AppBar position="static" color="default" className="header">
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            {traduzioni[this.state.lingua].titolo}
                        </Typography>
                        <div>
                            <IconButton
                                aria-label="Lingua"
                                aria-owns={this.state.aperto ? 'long-menu' : undefined}
                                aria-haspopup="true"
                                onClick={this.apriLingue}
                                className={classes.lingua}
                            >
                            <Language/>
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={this.state.aperto}
                                open={this.state.aperto}
                                onClose={this.chiudiLingue}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: 200,
                                    },
                                }}
                            >
                                {lingue.map(lingua => (
                                    <MenuItem key={lingua} selected={lingua === this.state.lingua} onClick={() => this.cambiaLingua(lingua)}>
                                        {lingua}
                                    </MenuItem>
                                ))}
                            </Menu>
                            <IconButton className={classes.colore} aria-label="Chiaro/Scuro" onClick={this.props.tema}>
                                <InvertColors />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

                <center>
                    <Card>
                        <table className="tabla">
                            <tr>
                                <td>
                                    <TextField
                                        label={traduzioni[this.state.lingua].insA}
                                        margin="normal"
                                        variant="outlined"
                                        onChange={this.cambia('A')}
                                        className="textfield"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        label={traduzioni[this.state.lingua].insB}
                                        margin="normal"
                                        variant="outlined"
                                        onChange={this.cambia('B')}
                                        className="textfield"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        label={traduzioni[this.state.lingua].R}
                                        margin="normal"
                                        variant="outlined"
                                        onChange={this.cambia('R')}
                                        className="textfield"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <center>
                                    <td>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            color="primary"
                                            style={{ backgroundColor: '#448aff' }}
                                            onClick={this.controlla}
                                        >
                                            {traduzioni[this.state.lingua].calcola}
                                        </Button>
                                    </td>
                                </center>
                            </tr>
                        </table>
                    </Card>
                </center>
                <Card className="card">
                    {this.state.ok ?
                        <div>
                            <center>
                            <Table className="tabla">
                                <TableHead>
                                <TableRow>
                                    <TableCell className="tableHead" align="left">{traduzioni[this.state.lingua].proprieta}</TableCell>
                                    <TableCell className="tableHead" align="center">...</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].riflessiva}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.riflessiva ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].transitiva}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.transitiva ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].simmetrica}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.simmetrica ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].antisimmetrica}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.antisimmetrica ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].equivalenza}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.equivalenza ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].poset}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.poset ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].tordinato}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.insiemeTotalmenteOrdinato ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].reticolo}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.reticolo ? traduzioni[this.state.lingua].si : traduzioni[this.state.lingua].no}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].massimali}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.poset ? this.state.eleMax.join(',') : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].minimali}:&nbsp;
                                        </TableCell>
                                        <TableCell align="center">
                                            {this.state.poset ? this.state.eleMin.join(',') : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row" align="left">
                                            {traduzioni[this.state.lingua].hasse}:
                                        </TableCell>
                                        <TableCell align="center">
                                            
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </center>
                            <Card className="hasseCard">
                                {this.state.hasse !== null ? this.state.hasse : "N/A"}
                            </Card>
                        </div>
                        : ''}</Card>
            </div>
        );
    }
}
export default withStyles(styles)(Programma);