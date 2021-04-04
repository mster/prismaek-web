import { Component } from 'react'

import SchemeBox from '../schemeBox/schemeBox'
import ColorPicker from '../colorPicker/colorPicker'
import ButtonBox from '../buttonBox/buttonBox'

import axios from 'axios'

import './page.css'

class Page extends Component {
    state = {
        base: '#31609B',
        schemes: [],
        harmonies: [],
        error: false
    }

    componentDidMount () {
        axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/harmonies`)
        .then(({ data }) => {
            this.setState({ harmonies: data })
        })
        .catch(err => {
            if (err) this.setState({ error: true })
        })
    }
    
    handleColorUpdate = ({ hex }) => {
        this.setState({ base: hex })
    }

    handleOnClickHex = ({ target }) => {
        console.log(target)
        this.setState({ base: target.id })
        navigator.clipboard.writeText(target.id)
    }

    handleBuildScheme = ({ target }) => {
        const schemeType = target.id
        const hexCode = this.state.base.replace('#', '')
        const url = `${process.env.REACT_APP_API_BASE_URL}/scheme?base=${hexCode}&type=${schemeType}`

        axios.get(url)
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
            const updatedSchemes = this.state.schemes
            updatedSchemes.splice(index, 1)

            this.setState({ schemes: updatedSchemes })
            
            return
        }

        this.setState({ schemes: [] })
    }

    render () {
        if (this.state.error) return (
            <div id="error-page" className="page-error">
                <h3 style={{ margin: '25%' }}>Oops! Something went wrong.</h3>
            </div>
        )
        return (
            <div id="page" className="page">
                <ColorPicker color={this.state.base} handler={this.handleColorUpdate}/>
                <ButtonBox types={this.state.harmonies} handler={this.handleBuildScheme}/>
                <SchemeBox schemes={this.state.schemes} onClick={this.handleOnClickHex} onDelete={this.handleDeleteScheme}/>
            </div>
        )
    }
}

export default Page