
import React, { Component } from 'react'
import { render } from 'react-dom'
import ImagePicker from 'react-image-picker'
import './ImagePicker.css'
import img1 from '../../Assets/AddUser.png'
import img2 from '../../Assets/SocialPost-Logo.png'
import img3 from '../../Assets/AddUser.png'
import img4 from '../../Assets/SocialPost-Logo.png'
import img5 from '../../Assets/AddUser.png'
import img6 from '../../Assets/SocialPost-Logo.png'
const imageList = [img1, img2,img3,img4,img5,img6]

 export default class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: '',
      images: [],
      max_images: [],
      max_message: ''
    }
  }

  onPickImage(image) {
    this.setState({image})
  }

  onPickImages(images) {
    this.setState({images})
  }

  onPickImagesWithLimit(max_images) {
    this.setState({max_images})
  }

  onPickMaxImages(last_image) {
    let image = JSON.stringify(last_image)
    let max_message = `Max images reached. ${image}`

    this.setState({max_message})
  }

  render() {
    return (
      <div>
        <ImagePicker
          images={imageList.map((image, i) => ({src: image, value: i}))}
          onPick={this.onPickImagesWithLimit.bind(this)}
          maxPicks={2}
          onMaxPicks={this.onPickMaxImages.bind(this)}
          multiple 
        />
       {/* <textarea rows="4" cols="100" value={this.state.max_images && JSON.stringify(this.state.max_images)} disabled/>
        <textarea rows="4" cols="100" value={this.state.max_message && JSON.stringify(this.state.max_message)} disabled/>*/}
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#root'))