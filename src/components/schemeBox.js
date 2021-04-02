import Scheme from './scheme'

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { PhotoshopPicker } from 'react-color';
import { Component } from 'react'

import axios from 'axios'

class SchemeBox extends Component {
    state = {
        base: '#31609B',
        schemes: [],
        harmonies: ['complementary', 'splitComplementary', 'triadic', 'tetradic', 'analagous', 'stepSixty', 'analagousTight']
    }

    constructor(props) {
        super(props)
    }

    handleChangeComplete = (color, event) => {
        this.setState({ base: color.hex });
    }

    handleChange = (color) => {
        this.setState({ base: color.hex })
    }

    handleBuildScheme = (event) => {
        const schemeType = event.target.id
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

    onClickHex = (event) => {
        navigator.clipboard.writeText(event.target.id)
        this.setState({ base: event.target.id })
    }

   render() {
       return <div>
           <Container fluid style={{ backgroundColor: this.state.base }}>
                <PhotoshopPicker color={this.state.base} onChangeComplete={this.handleChangeComplete}/>
           </Container>

            <Container>
                {this.state.harmonies.map((val, ind) => {
                    return <Button key={ind} onClick={this.handleBuildScheme} id={val} style={{ margin: 10 }}>{val}</Button>
                })}

                {this.state.schemes.map((val, ind) => {
                    return <Scheme key={ind} scheme={val} onClickHex={this.onClickHex}></Scheme>
                })}

            </Container>

       </div>
   }
}

export default SchemeBox