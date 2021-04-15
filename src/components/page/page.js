import { Component } from 'react'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import SchemeBox from '../schemeBox/schemeBox'
import ColorPicker from '../colorPicker/colorPicker'
import ButtonBox from '../buttonBox/buttonBox'
import copyToClipboard from '../../utils/clipboard'

import axios from 'axios'

import './page.css'

class Page extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor (props) {
        super(props)

        const { cookies } = props;
        const pinnedSchemes = cookies.get('pinned-schemes') || []

        this.state = {
            base: '#289865',
            schemes: pinnedSchemes,
            harmonies: [],
            effects: [],
            error: false
        }
    }

    componentDidMount () {
        /* get available harmonies */
        axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/harmonies`)
        .then(({ data }) => {
            this.setState({ harmonies: data })
        })
        .catch(err => {
            if (err) this.setState({ error: true })
        })

        /* get available effects */
        axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/effects`)
        .then(({ data }) => {
            this.setState({ effects: data })
        })
        .catch(err => {
            if (err) this.setState({ error: true })
        })
    }
    
    handleColorUpdate = ({ hex }) => {
        this.setState({ base: hex })
    }

    handleSetSchemes = (schemes) => {
        this.setState({ schemes })
    }

    handleOnClickHex = ({ target }) => {
        const hex = target.id

        copyToClipboard(hex)
        console.log('copied hex:', hex)
        
        this.setState({ base: hex })
    }

    handleBuildScheme = ({ target }) => {
        const schemeType = target.id
        const hexCode = this.state.base.replace('#', '')
        const url = `${process.env.REACT_APP_API_BASE_URL}/scheme?base=${hexCode}&type=${schemeType}`

        axios
        .get(url)
        .then(response => {
            this.setState({ schemes: [...this.state.schemes, response.data ]})
        })
        .catch(error => {
            console.error(error)
        })
    }

    handleDeleteScheme = (index) => {
        console.log('delete scheme', index)

        if (this.state.schemes.length > 1) {
            const schemes = this.state.schemes.slice();
            schemes.splice(index, 1);
            this.setState({ schemes })
            return
        }

        this.setState({ schemes: [] })
    }

    handleBuildEffect = (index, effectName) => {
        console.log(effectName)
        if(!this.state.effects.includes(effectName)) return;

        console.log("building effect:", effectName);
        const baseColorQuery = this.state.schemes[index].scheme.join(',');

        axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/effects/${effectName}?base=${baseColorQuery}&step=0.18&count=5`)
        .then(({ data }) => {
            const schemes = this.state.schemes;
            schemes[index][effectName] = data;

            this.setState({ schemes });
        })
        .catch(error => {
            console.error(error);
        })
    }

    render () {
        if (this.state.error) return (
            <div id="error-page" className="page-error">
                <h3 style={{ margin: '25%' }}>Oops! Something went wrong.</h3>
            </div>
        )
        return (
            <div id="page" className="page">
                <ColorPicker 
                    color={this.state.base} 
                    handler={this.handleColorUpdate}
                />
                <ButtonBox 
                    types={this.state.harmonies} 
                    handler={this.handleBuildScheme}
                    variant={"outline-light"}
                />
                <SchemeBox
                    schemes={this.state.schemes} 
                    setSchemes={this.handleSetSchemes}
                    onClick={this.handleOnClickHex} 
                    onDelete={this.handleDeleteScheme}
                    handleBuildEffect={this.handleBuildEffect}
                />
            </div>
        )
    }
}

export default withCookies(Page)