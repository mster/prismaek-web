import { Col } from 'react-bootstrap'

function tints ({ tints, index, handleClick }) {
    if (!tints || Object.keys(tints) === 0) return null

    let tintMatrix = Object.values(tints);
    tintMatrix.splice(0, 1);
    tintMatrix = tintMatrix.reverse();

    return tintMatrix.map((tintArray, tintIndex) => {
        const hex = `#${tintArray[index]}`

        return <Col xs={12} key={`shade-${tintIndex}`} onClick={handleClick} className="col-effects" style={{ backgroundColor: hex }} id={hex}>
            <p className="shade-hex-text" id={hex}>{hex}</p>
        </Col>
    })
}

export default tints