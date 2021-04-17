import { Container, Row } from 'react-bootstrap'
import React, { useCallback, useEffect, useReducer, useState } from 'react'

import Scheme from '../scheme/scheme'

const SchemeBox = ({ schemes, handleClick, handleDelete }) => {
    const [dragIndex, updateDrag] = useState();

    const handleDrag = (ev) => {
        updateDrag({ index: ev.target.id })
    }

    const handleDrop = ({ currentTarget }) => {
        console.log("drag", dragIndex)
        console.log("drop", currentTarget.id)
    }

    return <Row id="schemeBox" className="flex-column-reverse">
        {schemes.map((scheme, index) => {
            return <Scheme 
                {...scheme}
                key={index}
                index={index}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                handleDelete={handleDelete}
                handleClick={handleClick}
            />
        })}
    </Row>
}

export default SchemeBox;