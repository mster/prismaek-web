import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Scheme (props) {
    return <div id="scheme" style={{ margin: 10 }}>
        <Container fluid style={{ borderRadius: 20, overflow: 'hidden', overflowX: 'hidden' }}>
            <Row>
                {
                    props.scheme.map((val, ind) => {
                        return <Col key={ind} style={{ backgroundColor: `#${val}`, height: '10vh' }}>
                            <h3 onClick={props.onClickHex} id={'#' + val} >{'#' + val}</h3>
                        </Col>
                    })
                }
            </Row>
        </Container>
    </div>
}

export default Scheme