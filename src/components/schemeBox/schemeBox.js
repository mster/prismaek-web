import { Container, Row } from 'react-bootstrap'

import Scheme from '../scheme/scheme'

function SchemeBox ({ schemes, setSchemes, onClick, onDelete, handleBuildEffect }) {
    let id;

    const handleDrag = (event) => {
        id = Number(event.target.id);

        console.log(id);
    }

    const handleDrop = (event) => {
        const dropIndex = event.currentTarget.id;
        const dragIndex = id
        console.log("dropIndex=",dropIndex)

        const newState = schemes
        const removed = newState.splice(dragIndex, 1)

        console.log('removed=',removed)
        newState.splice(dropIndex, 0, removed[0])

        setSchemes(newState)
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