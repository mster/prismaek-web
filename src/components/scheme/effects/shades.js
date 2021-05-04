import { Col } from 'react-bootstrap'

function shades ({ shades, index, handleClick }) {
    if (!shades || Object.keys(shades) === 0) return null

    let shadeMatrix = Object.values(shades)
    shadeMatrix.splice(0, 1)

    return shadeMatrix.map((shadeArray, shadeIndex) => {
        const hex = `#${shadeArray[index]}`

        return <Col xs={12} key={`shade-${shadeIndex}`} onClick={handleClick} className="col-effects" style={{ backgroundColor: hex }}  id={hex}>
            <p className="shade-hex-text" id={hex}>{hex}</p>
        </Col>
    })
}

export default shades