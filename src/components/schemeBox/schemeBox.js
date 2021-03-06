import { Row } from 'react-bootstrap'

import SchemeController from '../scheme/schemeController'

const SchemeBox = ({ schemes, handleClick, handleDelete, handleSchemeReorder }) => {
    return <Row id="schemeBox" className="flex-column-reverse">
        {schemes.map((scheme, index) => {
            return <SchemeController
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