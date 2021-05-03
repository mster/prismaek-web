import { Row } from 'react-bootstrap'

import Scheme from '../scheme/scheme'

const SchemeBox = ({ schemes, handleClick, handleDelete, handleSchemeReorder }) => {
    return <Row id="schemeBox" className="flex-column-reverse">
        {schemes.map((scheme, index) => {
            return <Scheme
                {...scheme}
                key={scheme.uuid}
                index={index}
                handleDelete={handleDelete}
                handleClick={handleClick}
                handleSchemeReorder={handleSchemeReorder}
            />
        })}
    </Row>
}

export default SchemeBox;