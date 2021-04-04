import React, { useState } from 'react';

import { Container, Row, Col } from 'react-bootstrap'
import { ArrowsFullscreen, Pin, PinFill, ArrowsExpand, ArrowsCollapse, Trash } from 'react-bootstrap-icons'

import Modal from '../modal/modal'
import Button from '../button/button'
import copyToClipboard from '../../utils/clipboard'

import './scheme.css'


function Scheme (props) {
    /* showing modal */
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    /* pinning */
    const [pinned, setPinned] = useState(false)
    const handlePin = () => {
        setPinned(!pinned)

        if (pinned) {
            // set cookies via service
        }
    }

    /* expanding scheme */
    const [expanded, setExpanded] = useState(false)
    const handleExpand = () => setExpanded(!expanded)

    /* build scheme */
    const scheme = () => {
        return props.scheme.map((value, index) => {
            value = `#${value}`
            const style = {
                backgroundColor: value,
                height: expanded ? '40vh' : 'auto'
            }

            return <>
                <Col key={index} style={style} onClick={props.onClick} id={value}>
                    <p className="hex-text" id={value}>{value}</p>
                </Col>
            </>
        })

    }

    /* build gradient */
    const gradient = () => {
        const colors = props.scheme.map(s => `#${s}`).join(', ')
        const dynamicGradient = {
            background: `linear-gradient(to right, ${colors})`
        }

        return <>
            <Row 
                style={dynamicGradient} 
                onClick={copyGradient.bind(null, dynamicGradient)}
            >
                <br/>
            </Row>
        </>
    }

    /* copies gradient css styling to clipboard */
    const copyGradient = (gradient) => {
        try {
            const stringified = JSON.stringify(gradient)
            const css = stringified.replace(/(")/gm, '')
            copyToClipboard(css)
        } catch (error) {
            console.error(error)
        }
    }


    return <div 
        id={props.index}
        draggable={true}
        onDragOver={(event) => event.preventDefault()}
        onDragStart={props.handleDrag}
        onDrop={props.handleDrop}
        >
        {/* Scheme Modal */}
        <Modal show={show} handleClose={handleClose} scheme={props.scheme}></Modal>

        {/* Scheme Container */}
        <Container className="scheme dp01">
            <Row>
                <Col lg={1} md={2} style={{ margin: '0.5vw'}}>
                    <Button
                        variant={"outline-light"}
                        tooltipText={'Delete scheme'}
                        icon={<Trash/>}
                        onClick={props.onDelete.bind(null, props.index)}
                    />
                    <Button
                        variant={"outline-light"}
                        tooltipText={'More details'}
                        icon={<ArrowsFullscreen/>}
                        onClick={handleShow}
                    />
                    <Button
                        variant={pinned ? "success" : "outline-light"}
                        tooltipText={'Pin me!'}
                        icon={pinned ? <PinFill/> : <Pin/>}
                        onClick={handlePin}
                    />
                    <Button
                        variant={"outline-light"}
                        tooltipText={'Expand'}
                        icon={expanded ? <ArrowsExpand/> : <ArrowsCollapse/>}
                        onClick={handleExpand}
                    />
                </Col>
                {scheme()}
            </Row>
            {gradient()}
        </Container>
        <div style={{ width: '100%', position: "relative", top: '10%', height: '100%' }}>
            {props.type}
        </div>

    </div>
}

export default Scheme
