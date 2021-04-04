import Container from 'react-bootstrap/Container'

import Scheme from '../scheme/scheme'

function SchemeBox (props) {
    return <Container id="schemeBox">
        {props.schemes.map((val, ind) => {
            return <Scheme index={ind} scheme={val.scheme} type={val.type} base={val.base} key={ind} onClick={props.onClick} onDelete={props.onDelete}/>
        })}
    </Container>
}

export default SchemeBox