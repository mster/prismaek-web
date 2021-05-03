import React, { Component } from 'react';

import { Container, Row, Col, Badge } from 'react-bootstrap'
import { ArrowsFullscreen, Pin, PinFill, ArrowsExpand, ArrowsCollapse, Trash } from 'react-bootstrap-icons'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { getEmptyImage } from "react-dnd-html5-backend";

import { DragSource, DropTarget} from 'react-dnd'

import Modal from '../modal/modal'
import Button from '../button/button'

import { buildScheme, buildEffects } from '../../services/prismock-service'
import Shades from './effects/shades'
import Tints from './effects/tints'
import GradientBar from './effects/gradientBar'

import './scheme.css'

class Scheme extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor (props) {
        super(props);

        this.state = {
            pinned: props.pinned || false,
            show: false,
            expanded: false,
            base: props.base,
            type: props.type,
            index: props.index,
            uuid: props.uuid,
            scheme: buildScheme(props.base, props.type),
            tints: null,
            shades: null
        }

        this.handleClick = props.handleClick.bind(this);
    }

    componentDidUpdate(prev){
        if (prev.index !== this.props.index || prev.type !== this.props.type || prev.base !== this.props.base) {
            this.setState({
                index: this.props.index,
                base: this.props.base,
                type: this.props.type,
                scheme: buildScheme(this.props.base, this.props.type)
            })
        }

        if (prev.pinned !== this.props.pinned) {
            this.setState({ pinned: this.props.pinned })
        }
    }

    handleShow = () => {
        this.setState({ show: !this.state.show })
    }

    handleExpand = () => {
        if (!this.state.shades || Object.keys(this.state.shades) === 0) {
            const shades = buildEffects(this.state.scheme, "shade");
            this.setState({ shades })
        }

        if (!this.state.tints || Object.keys(this.state.tints) === 0) {
            const tints = buildEffects(this.state.scheme, "tint");
            this.setState({ tints })
        }

        this.setState({
            expanded: !this.state.expanded
        })
    }

    handlePin = () => {
        this.setState({
            pinned: !this.state.pinned
        })

        const { cookies } = this.props;
        const existing = cookies.get("pinned-schemes") || [];

        if (!this.state.pinned) {
            const schemeData = { type: this.state.type, base: this.state.base, pinned: true, uuid: this.state.uuid }
            cookies.set("pinned-schemes", [schemeData, ...existing ])
            
        }

        if (this.state.pinned) {
            console.log("removing pinned: ", this.state.index)

            let len = existing.length, i = 0;
            for(; i < len; i++) {
                if (
                    existing[i].type === this.state.type &&
                    existing[i].base === this.state.base
                ) {
                    existing.splice(i, 1);
                    break;
                }
            }

            if (existing.length !== len) cookies.set("pinned-schemes", existing)
        }
    }

    /* build scheme */
    scheme = () => {
        return this.state.scheme.map((value, index) => {
            const hex = `#${value}`
            const style = {
                backgroundColor: hex,
                height: this.state.expanded ? '100%' : 'auto'
            }

            const baseColumn = <Col key={index} style={style} onClick={this.handleClick} id={hex}>
                <p className="hex-text" id={hex}>{hex}</p>
                <br/><br/>
            </Col>

            return (this.state.expanded ? 
                <Col key={index}>
                    <Row className="align-items-center">
                        <Tints index={index} tints={this.state.tints} handleClick={this.handleClick}/>
                        {baseColumn}
                        <Shades index={index} shades={this.state.shades} handleClick={this.handleClick}/>
                    </Row>
                </Col> : 
                baseColumn
            )
        })
    }

    render () {
        const ref = React.createRef();
        const { connectDragSource, isDragging, connectDropTarget, connectDragPreview } = this.props;
        connectDragPreview(getEmptyImage());

        return connectDragSource(connectDropTarget(
            <div style={{ opacity: isDragging ? 0.45 : 1 }}>
                <Col
                    key={this.state.key}
                    xs={{ span: 12 }}
                >
                    {/* Scheme Modal */}
                    <Modal show={this.state.show} handleClose={this.handleShow} scheme={this.state.scheme}/>

                    {/* Scheme Container */}
                    <Container className="scheme dp01">
                        <Row key="main-scheme">
                            <Col lg={1} md={2} style={{ margin: '0.5vw'}} key="buttons">
                                <Button
                                    className="dp02"
                                    ref={ref}
                                    variant={"outline-light"}
                                    icon={<Trash/>}
                                    onClick={() => this.props.handleDelete(this.state.index)}
                                    key={`delete-${this.state.index}`}
                                />
                                <Button
                                    ref={ref}
                                    variant={"outline-light"}
                                    icon={<ArrowsFullscreen/>}
                                    onClick={this.handleShow}
                                    key={`details-${this.state.index}`}
                                />
                                <Button
                                    ref={ref}
                                    variant={this.state.pinned ? "success" : "outline-light"}
                                    icon={this.state.pinned ? <PinFill/> : <Pin/>}
                                    onClick={this.handlePin}
                                    key={`pin-${this.state.index}`}
                                />
                                <Button
                                    ref={ref}
                                    variant={"outline-light"}
                                    icon={this.state.expanded ? <ArrowsCollapse/> : <ArrowsExpand/>}
                                    onClick={this.handleExpand}
                                    key={`expand-${this.state.index}`}
                                />
                            </Col>
                            {this.scheme()}
                        </Row>
                        <GradientBar scheme={this.state.scheme}/>
                    </Container>
                </Col>
            </div>
        ))
    }
}

let dragIndex;
const elementSource = {
    beginDrag (props) {
        dragIndex = props.index
        return props
    }
}

const elementTarget = {
    drop (props) { 
        props.handleSchemeReorder(dragIndex, props.index)
    }
}

Scheme = DragSource("Scheme", elementSource , (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))(Scheme)

Scheme = DropTarget("Scheme", elementTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))(Scheme)

export default withCookies(Scheme)
