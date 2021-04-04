'use strict'

import { Modal, Row, Col, Button } from 'react-bootstrap' 

import './modal.css'

function ModalView (props) {


    return <Modal size="xl" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>
                {props.type}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                {
                    props.scheme.map((val, ind) => {
                        return (
                            <Col sm={true} id={`#${val}`} key={ind} style={{ backgroundColor: `#${val}`, height: '20vh' }}>
                                <p id={`#${val}`} >{`#${val}`}</p>
                            </Col>
                        )
                    })
                }
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
}

export default ModalView 