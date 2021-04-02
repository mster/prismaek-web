import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

function ButtonBox (props) {
    return <Container fluid>
        {props.types.map((val, ind) => {
            return <Button onClick={props.handler} id={val} key={ind}>{val}</Button>
        })}
    </Container>
}

export default ButtonBox