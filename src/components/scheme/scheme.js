import React, { useState } from 'react';

import { Container, Row, Col } from 'react-bootstrap'
import { ArrowsFullscreen, Pin, PinFill, ArrowsExpand, ArrowsCollapse, Trash } from 'react-bootstrap-icons'
import { useCookies } from 'react-cookie';

import Modal from '../modal/modal'
import Button from '../button/button'
import copyToClipboard from '../../utils/clipboard'

import './scheme.css'


function Scheme (props) {
    /* cookies */
    const [cookies, setCookie] = useCookies(['pinned-schemes'])

    /* showing modal */
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    /* pinning */
    const [pinned, setPinned] = useState(props.pinned || false)
    console.log(pinned, props.pinned)
    const handlePin = () => {
        console.log('CALLED~!')

        if (!pinned) {
            const existing = cookies['pinned-schemes'] || []
            console.log('cookies set', existing)
            setCookie('pinned-schemes', [...existing, { scheme: props.scheme, type: props.type, base: props.base, pinned: true }])
        }

        if (pinned) {
            const existing = cookies['pinned-schemes'] || []

            let i = 0;
            for (; i < existing.length; i++) {
                if (existing[i].type === props.type && existing[i].base === props.base) {
                    existing.splice(i, 1)
                    break;
                }
            }

            setCookie('pinned-schemes', existing)
        }

        setPinned(!pinned)
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

            return <Col key={index} style={style} onClick={props.onClick} id={value}>
                <p className="hex-text" id={value}>{value}</p>
            </Col>
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
                key="gradient-bar"
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
        key={props.index}
        >
        {/* Scheme Modal */}
        <Modal show={show} handleClose={handleClose} scheme={props.scheme}></Modal>

        {/* Scheme Container */}
        <Container className="scheme dp01">
            <Row key="main-scheme">
                <Col lg={1} md={2} style={{ margin: '0.5vw'}} key="buttons">
                    <Button
                        variant={"outline-light"}
                        tooltipText={'Delete scheme'}
                        icon={<Trash/>}
                        onClick={props.onDelete.bind(null, props.index)}
                        key={`delete-${props.index}`}
                    />
                    <Button
                        variant={"outline-light"}
                        tooltipText={'More details'}
                        icon={<ArrowsFullscreen/>}
                        onClick={handleShow}
                        key={`details-${props.index}`}
                    />
                    <Button
                        variant={pinned ? "success" : "outline-light"}
                        tooltipText={'Pin me!'}
                        icon={pinned ? <PinFill/> : <Pin/>}
                        onClick={handlePin}
                        key={`pin-${props.index}`}
                    />
                    <Button
                        variant={"outline-light"}
                        tooltipText={'Expand'}
                        icon={expanded ? <ArrowsExpand/> : <ArrowsCollapse/>}
                        onClick={handleExpand}
                        key={`expand-${props.index}`}
                    />
                </Col>
                {scheme()}
            </Row>
            {gradient()}
        </Container>
    </div>
}

export default Scheme
