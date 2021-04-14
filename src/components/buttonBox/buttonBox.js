import Container from 'react-bootstrap/Container'
import Button from '../button/button'

import React from 'react'

import './buttonBox.css'

function ButtonBox (props) {
    return <Container fluid className="box">
        {props.types.map((val, ind) => {
            const parts = val.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1)
            const text = parts.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')

            return <div key={ind} className={"button"}>
                <Button
                        id={val}
                        onClick={props.handler}
                        text={text}
                        variant={props.variant || "primary"}
                    />
            </div>

        })}
    </Container>
}

export default ButtonBox
