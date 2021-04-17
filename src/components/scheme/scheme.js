import React, { Component } from 'react';

import { Container, Row, Col, Badge } from 'react-bootstrap'
import { ArrowsFullscreen, Pin, PinFill, ArrowsExpand, ArrowsCollapse, Trash } from 'react-bootstrap-icons'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Modal from '../modal/modal'
import Button from '../button/button'
import copyToClipboard from '../../utils/clipboard'

import { buildScheme, buildEffects } from '../../services/prismock-service'

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
            id: props.index,
            scheme: null,
            tints: null,
            shades: null
        }

        this.state.scheme = buildScheme(this.state.base, this.state.type)

        this.handleClick = props.handleClick.bind(this);
        // this.handleSchemeUpdate = props.handleSchemeUpdate.bind(this);

        this.handleDelete = props.handleDelete.bind(this, this.state.index);
        this.handleDrag = props.handleDrag
        this.handleDrop = props.handleDrop
    }

    componentDidUpdate(prev){
        if (prev.index !== this.props.index || prev.type !== this.props.type || prev.base !== this.props.base) {
            this.setState({
                id: this.props.index,
                index: this.props.index,
                base: this.props.base,
                type: this.props.type,
                scheme: buildScheme(this.props.base, this.props.type)
            })
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
            cookies.set(
                "pinned-schemes",
                [
                    { type: this.state.type, base: this.state.base, pinned: true },
                    ...existing
                ]
            )
            
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

            const baseColumn = <Col key={index} style={style} onClick={this.onClick} id={hex}>
                <p className="hex-text" id={hex}>{hex}</p>
                <br/><br/>
            </Col>

            return (this.state.expanded ? 
                <Col key={index}>
                    <Row className="align-items-center">
                        {this.tints(index)}
                        {baseColumn}
                        {this.shades(index)}
                    </Row>
                </Col> : 
                baseColumn
            )
        })
    }

    /* build shades */
    shades = (index) => {
        if (!this.state.shades || Object.keys(this.state.shades) === 0) return

        let shadeArrs = Object.values(this.state.shades);
        shadeArrs.splice(0, 1);

        return shadeArrs.map((shadeArr, shadeIndex) => {
            const hex = `#${shadeArr[index]}`
            return <Col xs={12} key={`shade-${shadeIndex}`} onClick={this.onClick} className="col-effects" style={{ backgroundColor: hex }}  id={hex}>
                <p className="shade-hex-text" id={hex}>{hex}</p>
            </Col>
        })
    }

    /* build tints */
    tints = (index) => {
        if (!this.state.tints || Object.keys(this.state.tints) === 0) return

        let tintArrs = Object.values(this.state.tints);
        tintArrs.splice(0, 1);
        tintArrs = tintArrs.reverse();

        return tintArrs.map((tintArr, tintIndex) => {
            const hex = `#${tintArr[index]}`
            return <Col xs={12} key={`shade-${tintIndex}`} onClick={this.onClick} className="col-effects" style={{ backgroundColor: hex }} id={hex}>
                <p className="shade-hex-text" id={hex}>{hex}</p>
            </Col>
        })
    }

    /* build gradient */
    gradient = () => {
        const colors = this.state.scheme.map(s => `#${s}`).join(', ')
        const dynamicGradient = {
            background: `linear-gradient(to right, ${colors})`,
        }

        return <>
            <Row 
                key="gradient-bar"
                style={dynamicGradient} 
                onClick={this.copyGradient.bind(null, dynamicGradient)}
            >
                <br/>
            </Row>
        </>
    }

    /* copies gradient css styling to clipboard */
    copyGradient = (gradient) => {
        try {
            const stringified = JSON.stringify(gradient)
            const css = stringified.replace(/["{}]*/gm, '')
            copyToClipboard(css)
        } catch (error) {
            console.error(error)
        }
    }

    render () {
        const ref = React.createRef();

        return <Col
            id={this.state.id}
            key={this.state.index}
            draggable={true}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={this.handleDrag}
            onDrop={this.handleDrop}
            xs={{ span: 12 }}
        >
            {/* Scheme Modal */}
            <Modal show={this.state.show} handleClose={this.handleShow} scheme={this.state.scheme}></Modal>

            {/* Scheme Container */}
            <Container className="scheme dp01">
                <Row key="main-scheme">
                    <Col lg={1} md={2} style={{ margin: '0.5vw'}} key="buttons">
                        <Button
                            className="dp02"
                            ref={ref}
                            variant={"outline-light"}
                            icon={<Trash/>}
                            onClick={this.handleDelete}
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
                {this.gradient()}
            </Container>
        </Col>
    }
}

export default withCookies(Scheme)
