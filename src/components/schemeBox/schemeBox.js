import { Container, Row } from 'react-bootstrap'
import { useState } from 'react'

import Scheme from '../scheme/scheme'

function SchemeBox ({ schemes, setSchemes, onClick, onDelete, handleBuildEffect }) {
    let id;

    const handleDrag = (index, event) => {
        console.log(`Dragging scheme index: ${index}`)
        id = index;
    }

    const handleDrop = (index, event) => {
        console.log(`Dropping on scheme index: ${index}`)
        let newSchemeState = schemes.slice();

        const shifted = newSchemeState.splice(id, 1);
        newSchemeState.splice(index, 0, shifted[0]);

        console.log("post", newSchemeState);
        console.log("new length=", newSchemeState.length)
        setSchemes(newSchemeState);
    }

    const buildSchemes = () => {
        return schemes.map(({ scheme, shade, tint, type, base, pinned }, index) => {
            const schemeProps = {
                key: `scheme-${base}-${index}`,
                index,
                scheme,
                shade,
                tint,
                type,
                base,
                pinned,
                onClick,
                onDelete,
                handleDrop,
                handleDrag,
                handleBuildEffect
            }

            return <Scheme {...schemeProps} />
        })
    }

    return <Row id="schemeBox" className="flex-column-reverse">
        {buildSchemes()}
    </Row>
}

export default SchemeBox