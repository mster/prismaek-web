import { useState } from 'react'
import Container from 'react-bootstrap/Container'

import Scheme from '../scheme/scheme'

function SchemeBox (props) {
    const [dragId, setDragId] = useState()

    const handleDrag = (event) => {
        setDragId(event.currentTarget.id)
    }

    const handleDrop = (event) => {
        const dropIndex = event.currentTarget.id
        const dragIndex = dragId

        const newState = props.schemes
        const removed = newState.splice(dragIndex, 1)
        newState.splice(dropIndex, 0, removed[0])

        props.setSchemes(newState)
    }

    const schemes = () => {
        return props.schemes.map((val, ind) => {
            return <Scheme 
                index={ind}
                scheme={val.scheme}
                type={val.type}
                base={val.base}
                key={ind}
                onClick={props.onClick}
                onDelete={props.onDelete}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
            />
        })
    }

    return <Container id="schemeBox">
        {
            schemes()
        }
    </Container>
}

export default SchemeBox