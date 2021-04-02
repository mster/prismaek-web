import Container from 'react-bootstrap/Container'

import Scheme from './scheme'

function SchemeBox (props) {
    return <Container id="schemeBox">
        {props.schemes.map((val, ind) => {
            return <Scheme scheme={val} key={ind}/>
        })}
    </Container>
}

export default SchemeBox