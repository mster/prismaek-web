import React from 'react';

import {
    OverlayTrigger,
    Tooltip,
    Button as BootstrapButton
} from 'react-bootstrap'

import './button.css'

function Button (props) {
    /* button props */
    const buttonProps = {
        onClick: props.onClick || (() => {}),
        variant: props.variant || 'primary',
    }

    if (props.tooltipText) {
        /* overlay trigger props */
        const overlayTriggerProps = {
            delay: props.delay || { show: 200, hide: 800 },
            placement: props.placement || "right",
            overlay: props.overlay || renderTooltip.apply(null, [props.tooltipText])
        }

        return <div>
            <OverlayTrigger {...overlayTriggerProps}>
                <BootstrapButton {...buttonProps} className="button">
                    <>{props.icon}</>
                    <>{props.text ? ` ${props.text}`: ''}</>
                </BootstrapButton>
            </OverlayTrigger>
        </div>

    }


    return <>
        no overlay
    </>
}

function renderTooltip (text) {
    return <Tooltip id="tooltip">{text}</Tooltip>
}

export default Button