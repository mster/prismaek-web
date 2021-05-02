import { Component } from 'react'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Row } from 'react-bootstrap'

import SchemeBox from '../schemeBox/schemeBox'
import ColorPicker from '../colorPicker/colorPicker'
import ButtonBox from '../buttonBox/buttonBox'
import copyToClipboard from '../../utils/clipboard'
import Scheme from '../scheme/scheme'

import { loadPrismockFX, buildScheme, buildEffects } from '../../services/prismock-service'

import './page.css'

class Page extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor (props) {
        super(props)

        const { cookies } = props;
        const pinnedSchemes = cookies.get('pinned-schemes') || []

        this.state = {
            base: '#289865',
            schemes: pinnedSchemes,
            harmonies: [],
            effects: [],
            error: false
        }
    }

    componentDidMount () {
        const [ harmonies, effects ] = loadPrismockFX();
        this.setState({ harmonies, effects })
    }
    
    handleColorUpdate = ({ hex }) => {
        this.setState({ base: hex })
    }

    handleSetSchemes = (schemes) => {
        this.setState({ schemes })
    }

    handleOnClickHex = ({ target }) => {
        const hex = target.id

        copyToClipboard(hex)
        console.log('copied hex:', hex)
        
        this.setState({ base: hex })
    }

    handleBuildScheme = ({ target }) => {
        const newScheme = {
            base: this.state.base,
            type: target.id,
            pinned: false
        }

        this.setState({ schemes: [...this.state.schemes, newScheme ]})
    }

    handleDeleteScheme = (index) => {
        console.log('delete scheme', index)

        console.log("prev", this.state.schemes.slice())

        if (this.state.schemes.length > 1) {
            const schemes = this.state.schemes
            schemes.splice(index, 1);

            console.log("post", schemes)

            this.setState({ schemes })
            return
        }

        this.setState({ schemes: [] })
    }

    handleBuildEffect = (index, type) => {
        if(!this.state.effects.includes(type)) return;

        const effects = buildEffects(this.state.schemes[index].scheme, type);

        const schemes = this.state.schemes.slice();
        schemes[index][type] = effects;

        this.setState({ schemes })
    }

    handleSchemeReorder (dragIndex, dropIndex) {
        if (dragIndex === dropIndex) return

        if (isNaN(dragIndex) || isNaN(dropIndex)) {
            console.error(`Drag or drop index is NaN: dragIndex=${dragIndex} drop=${dropIndex}`)
            return
        }

        const schemes = this.state.schemes.slice();
        const removed = schemes.splice(dragIndex, 1);
        schemes.splice(dropIndex, 0, removed[0])

        this.setState({ schemes })
    }

    render () {
        if (this.state.error) return (
            <div id="error-page" className="page-error">
                <h3 style={{ margin: '25%' }}>Oops! Something went wrong.</h3>
            </div>
        )
        return (
            <div id="page" className="page">
                <ColorPicker 
                    color={this.state.base} 
                    handler={this.handleColorUpdate}
                />
                <ButtonBox 
                    types={this.state.harmonies} 
                    handler={this.handleBuildScheme}
                    variant={"outline-light"}
                />
                <SchemeBox
                    schemes={this.state.schemes} 
                    handleSchemeUpdate={this.handleSetSchemes}
                    handleClick={this.handleOnClickHex} 
                    handleDelete={this.handleDeleteScheme}
                    handleBuildEffect={this.handleBuildEffect}
                    handleSchemeReorder={this.handleSchemeReorder.bind(this)}
                />
            </div>
        )
    }
}

export default withCookies(Page)