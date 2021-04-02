import { Component } from 'react'
import Container from 'react-bootstrap/Container'

import SchemeBox from './schemeBox'
import ColorPicker from './colorPicker'
import ButtonBox from './buttonBox'

import axios from 'axios'

class Page extends Component {
    state = {
        base: '#31609B',
        schemes: [],
        harmonies: ['complementary']
    }

    componentWillMount () {
        axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/harmonies`)
        .then(({ data }) => {
            this.setState({ harmonies: data })
        })
    }
    
    handleColorUpdate = ({ hex }) => {
        this.setState({ base: hex })
    }

    handleBuildScheme = ({ target }) => {
        const schemeType = target.id
        const hexCode = this.state.base.replace('#', '')
        const url = `${process.env.REACT_APP_API_BASE_URL}/scheme?base=${hexCode}&type=${schemeType}`

        axios.get(url)
        .then(response => {
            this.setState({ schemes: [...this.state.schemes, response.data.scheme]})
        })
        .catch(error => {
            console.error(error)
        })
    }

    render () {
        return <div id="page">
            <ColorPicker handler={this.handleColorUpdate} color={this.state.base} />
            <ButtonBox types={this.state.harmonies} handler={this.handleBuildScheme}/>
            <SchemeBox schemes={this.state.schemes} />
        </div>
    }
}

export default Page