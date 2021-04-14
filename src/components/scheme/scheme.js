import React, { Component } from 'react';

import { Container, Row, Col, Badge } from 'react-bootstrap'
import { ArrowsFullscreen, Pin, PinFill, ArrowsExpand, ArrowsCollapse, Trash } from 'react-bootstrap-icons'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Modal from '../modal/modal'
import Button from '../button/button'
import copyToClipboard from '../../utils/clipboard'

import './scheme.css'


class Scheme extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor (props) {
        super(props);

        this.state = {
            pinned: props.pinned == null ? false : props.pinned,
            show: false,
            expanded: false,
            scheme: props.scheme,
            shades: props.shades,
            index: props.index,
            type: props.type,
            base: props.base,
            id: `${props.base}-${Math.round(Math.random() * 1000)}`
        }

        console.log(`constructed id=${this.state.id}`);

        this.handleDrag = props.handleDrag.bind(this);
        this.handleDrop = props.handleDrop.bind(this);
        this.onClick = props.onClick.bind(this);
        this.onDelete = props.onDelete.bind(this, this.state.index);
        this.handleBuildShades = props.handleBuildShades.bind(this, this.state.index);
    }

    componentDidUpdate(prev){
        if (prev.scheme !== this.props.scheme || prev.shades !== this.props.shades) {
            this.setState({
                scheme: this.props.scheme,
                shades: this.props.shades
            })
        }

        if (prev.type !== this.props.type || prev.base !== this.props.base) {
            this.setState({
                type: this.props.type,
                base: this.props.base
            })
        }

        if (prev.pinned !== this.props.pinned){
            this.setState({
                pinned: this.props.pinned || false
            })
        }

        if (prev.index !== this.props.index || prev.expanded !== this.props.expanded){
            this.setState({
                index: this.props.index,
                expanded: this.props.expanded
            })
        }
    }

    handleShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    handleExpand = () => {
        if (!this.state.shades || Object.keys(this.state.shades) === 0) {
            this.handleBuildShades();
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
                    { 
                        scheme: this.state.scheme,
                        type: this.state.type,
                        base: this.state.base,
                        pinned: true
                    },
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
            value = `#${value}`
            const style = {
                backgroundColor: value,
                height: this.state.expanded ? '100%' : 'auto'
            }

            return (this.state.expanded ? 
                <Col key={index}>
                    <Row className="align-items-center">
                        <Col key={index} style={style} onClick={this.onClick} id={value}>
                            <p className="hex-text" id={value}>{value}</p>
                            <br/><br/>
                        </Col>
                        {this.shades(index)}
                    </Row>
                </Col> : 
                <Col key={index} style={style} onClick={this.onClick} id={value}>
                    <p className="hex-text" id={value}>{value}</p>
                </Col>
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
            return <Col xs={12} key={`shade-${shadeIndex}`} onClick={this.onClick} style={{ backgroundColor: hex }} id={hex}>
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
            const css = stringified.replace(/(")/gm, '')
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
                            onClick={this.onDelete.bind(null, this.state.index)}
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
