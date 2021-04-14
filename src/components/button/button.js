import React from 'react';

import {
    OverlayTrigger,
    Tooltip,
    Button as BootstrapButton
} from 'react-bootstrap'

import './button.css'

const Button = React.forwardRef((props, ref) => {
    /* button props */
    const buttonProps = {
        id: props.id || null,
        onClick: props.onClick || (() => {}),
        variant: props.variant || 'primary',
        className: props.className || null
    }

    if (props.tooltipText) {
        /* overlay trigger props */
        const overlayTriggerProps = {
            delay: props.delay || { show: 200, hide: 600 },
            placement: props.placement || "right",
            overlay: props.overlay || (() => <Tooltip id="tooltip">{props.tooltipText}</Tooltip>).apply(this),
            animation: false
        }

        return <div className="button" ref={ref}>
            <OverlayTrigger {...overlayTriggerProps} transition={false}>
                    <BootstrapButton {...buttonProps} className="button">
                        {props.icon}{props.text ? ` ${props.text}`: ''}
                    </BootstrapButton>
            </OverlayTrigger>
        </div>


    }


    return <div className="button" ref={ref}>
        <BootstrapButton {...buttonProps} className="button dp02">
           {props.icon}{props.text ? ` ${props.text}`: ''}
        </BootstrapButton>
    </div>
})

export default Button