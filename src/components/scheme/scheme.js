import { Container, Row, Col } from 'react-bootstrap'
import { ArrowsFullscreen, Pin, PinFill, ArrowsExpand, ArrowsCollapse, Trash } from 'react-bootstrap-icons'

import Modal from '../modal/modal'
import Button from '../button/button'

import Shades from './effects/shades'
import Tints from './effects/tints'
import GradientBar from './effects/gradientBar'

import './scheme.css'

function Scheme (props) {
    return <div style={{ opacity: props.isDragging ? 0.45 : 1 }}>
        <Col xs={{ span: 12 }}>
            {/* Scheme Modal */}
            <Modal show={props.show} handleClose={props.handleShow} scheme={props.scheme}/>

            {/* Scheme Container */}
            <Container className="scheme dp01">
                <Row key="main-scheme">
                    <Col lg={1} md={2} style={{ margin: '0.5vw'}} key="buttons">
                        <Button
                            variant={"outline-light"}
                            icon={<Trash/>}
                            onClick={props.handleDelete}
                            key={`delete-${props.index}`}
                        />
                        <Button
                            variant={"outline-light"}
                            icon={<ArrowsFullscreen/>}
                            onClick={props.handleShow}
                            key={`details-${props.index}`}
                        />
                        <Button
                            variant={props.pinned ? "success" : "outline-light"}
                            icon={props.pinned ? <PinFill/> : <Pin/>}
                            onClick={props.handlePin}
                            key={`pin-${props.index}`}
                        />
                        <Button
                            variant={"outline-light"}
                            icon={props.expanded ? <ArrowsCollapse/> : <ArrowsExpand/>}
                            onClick={props.handleExpand}
                            key={`expand-${props.index}`}
                        />
                    </Col>
                    {props.scheme.map((value, index) => {
                        const hex = `#${value}`
                        const style = {
                            backgroundColor: hex,
                            height: props.expanded ? '100%' : 'auto'
                        }

                        const baseColumn = <Col key={index} style={style} onClick={props.handleClick} id={hex}>
                            <p className="hex-text" id={hex}>{hex}</p>
                            <br/><br/>
                        </Col>

                        return (props.expanded ? 
                            <Col key={index}>
                                <Row className="align-items-center">
                                    <Tints index={index} tints={props.tints} handleClick={props.handleClick}/>
                                    {baseColumn}
                                    <Shades index={index} shades={props.shades} handleClick={props.handleClick}/>
                                </Row>
                            </Col> : 
                            baseColumn
                        )
                    })}
                </Row>
                <GradientBar scheme={props.scheme}/>
            </Container>
        </Col>
    </div>
}

export default Scheme