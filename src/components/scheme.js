import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Component } from 'react'


class Scheme extends Component {
    state = {
        scheme: [],
        label: ''
    }

    constructor(props) {
        super(props)
        
        this.state.label = props.label
        this.state.scheme = props.scheme
    }

    componentDidMount() {
        
    }

    render () {
        return <div style={{ margin: 10 }}>
            <Container fluid style={{ borderRadius: 20, overflow: 'hidden', overflowX: 'hidden' }}>
                <Row>
                    <label>{this.state.label}</label>
                    {
                        this.state.scheme.map((val, ind) => {
                            return <Col key={ind} style={{ backgroundColor: `#${val}`, height: '10vh' }}>
                                <h3 onClick={this.props.onClickHex} id={'#' + val} >{'#' + val}</h3>
                            </Col>
                        })
                    }
                </Row>
            </Container>
        </div>
    }
}

export default Scheme