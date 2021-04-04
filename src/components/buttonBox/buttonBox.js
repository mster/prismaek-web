import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

import './buttonBox.css'

function ButtonBox (props) {
    return <Container fluid className="box">
        {props.types.map((val, ind) => {
            return <Button onClick={props.handler} id={val} key={`$button-${ind}`}>{val}</Button>
        })}
    </Container>
}

export default ButtonBox