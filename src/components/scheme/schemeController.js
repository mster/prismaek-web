import React, { Component } from 'react';

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { getEmptyImage } from "react-dnd-html5-backend";
import { DragSource, DropTarget} from 'react-dnd'

import { buildScheme, buildEffects } from '../../services/prismock-service'
import Scheme from './scheme'

class SchemeController extends Component {
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

    render () {
        const { connectDragSource, isDragging, connectDropTarget, connectDragPreview } = this.props;
        connectDragPreview(getEmptyImage());

        return connectDragSource(connectDropTarget(
            <div>
                <Scheme
                    handleDelete={() => this.props.handleDelete(this.state.index)}
                    scheme={this.state.scheme}
                    isDragging={isDragging}
                    show={this.state.show}
                    handleShow={this.handleShow}
                    index={this.state.index}
                    expanded={this.state.expanded}
                    handleExpand={this.handleExpand}
                    pinned={this.state.pinned}
                    handlePin={this.handlePin}
                    handleClick={this.handleClick}
                    tints={this.state.tints}
                    shades={this.state.shades}
                />
            </div>

        ))
    }
}

let dragIndex;
const schemeSource = {
    beginDrag (props) {
        dragIndex = props.index
        return props
    }
}

const schemeTarget = {
    drop (props) { 
        props.handleSchemeReorder(dragIndex, props.index)
    }
}

SchemeController = DragSource("Scheme", schemeSource , (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))(SchemeController)

SchemeController = DropTarget("Scheme", schemeTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))(SchemeController)

export default withCookies(SchemeController)
