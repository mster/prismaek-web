import { Row } from 'react-bootstrap'

import copyToClipboard from '../../../utils/clipboard'

/* copies gradient css styling to clipboard */
const copyGradient = (gradient) => {
    try {
        const stringified = JSON.stringify(gradient)
        const css = stringified.replace(/["{}]*/gm, '')
        copyToClipboard(css)
    } catch (error) {
        console.error(error)
    }
}

function gradientBar ({ scheme }) {
    const colors = scheme.map(s => `#${s}`).join(', ')
    const dynamicGradient = {
        background: `linear-gradient(to right, ${colors})`,
    }

    return <>
        <Row 
            key="gradient-bar"
            style={dynamicGradient} 
            onClick={copyGradient.bind(null, dynamicGradient)}
        >
            <br/>
        </Row>
    </>
}

export default gradientBar