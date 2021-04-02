import { Component } from 'react'
import { PhotoshopPicker } from 'react-color';

// going to build this out later (using react comp)
class ColorPicker extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return <div id="color-picker">
            <PhotoshopPicker color={this.props.color} onChangeComplete={this.props.handler}/>
        </div>
    }
}

export default ColorPicker