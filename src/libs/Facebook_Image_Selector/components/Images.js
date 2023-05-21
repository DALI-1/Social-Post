import React, { Component } from 'react';
import { Image, Row, Col,Container } from 'react-bootstrap';
import PropTypes from 'prop-types';

class Images extends Component {
  static defaultProps = {
    images: [],
    hideOverlay: false,
    overlayBackgroundColor: '#222222',
    onClickEach: null,
    countFrom: 5
  }

  constructor(props) {
    super(props)

    this.state = {
      modal: false,
      countFrom: props.countFrom > 0 && props.countFrom < 5 ? props.countFrom : 5,
      conditionalRender: false
    };

    this.openModal = this.openModal.bind(this);
    this.onClose = this.onClose.bind(this);

    if(props.countFrom <= 0 || props.countFrom > 5) {
      console.warn('countFrom is limited to 5!')
    }
  }

  openModal(index) {
    const {onClickEach, images} = this.props;

    if(onClickEach) {
      return onClickEach({src: images[index], index})
    }

    this.setState({modal: true, url: images[index], index})
  }

  onClose() {
    this.setState({modal: false})
  }

  renderOne() {
    const {images} = this.props;
    const {countFrom} = this.state;
    

    return  <Container>
      <Row>
        <Col xs={12} md={12} className={`border height-one background`}  style={{background: `url(${images[0]})`}}>
        </Col>
      </Row>
    </Container>;
  }

  renderTwo() {
    const {images} = this.props;
    const {countFrom} = this.state;
    const conditionalRender = [3, 4].includes(images.length) || images.length > +countFrom && [3, 4].includes(+countFrom);

    return <Container>
      <Row>
        <Col xs={6} md={6} className="border height-two background"  style={{background: `url(${conditionalRender ? images[1] : images[0]})`}}>
        </Col>
        <Col xs={6} md={6} className="border height-two background"  style={{background: `url(${conditionalRender ? images[2] : images[1]})`}}>
        </Col>
      </Row>
    </Container>;
  }

  renderThree(more) {
    const {images} = this.props;
    const {countFrom} = this.state;
    const conditionalRender = images.length == 4 || images.length > +countFrom && +countFrom == 4;

    return <Container>
      <Row>
        <Col xs={6} md={4} className="border height-three background"  style={{background: `url(${conditionalRender ? images[1] : images[2]})`}}>
        </Col>
        <Col xs={6} md={4} className="border height-three background"  style={{background: `url(${conditionalRender ? images[2] : images[3]})`}}>
        </Col>
        {images.length>5 ? <Col xs={6} md={4} className="border height-three " style={{backgroundColor:"rgba(0, 0, 0, 0.7)"}}>    
        
        <div key="count-sub" className="cover-text" style={{fontSize: '200%', position:"relative"}}><p>+{images.length-countFrom}</p></div>
        </Col>
         : <Col xs={6} md={4} className="border height-three background" style={{background: `url(${conditionalRender ? images[3] : images[4]})`}}>
        </Col>}
        
      </Row>
    </Container>;
  }
  renderCountOverlay(more) {
    const {images} = this.props;
    const {countFrom} = this.state;
    const extra = images.length - (countFrom && countFrom > 5 ? 5 : countFrom);

    if(more)
    {
      return (<><div className="Custom_cover">
        <div key="count-sub" className="cover-text" style={{fontSize: '200%'}}><p>+{extra}</p></div>
        </div></>)
    }
    else
    {return(<></>)}
   
  }

  render(){
    const {modal, index, countFrom} = this.state;
    const {images} = this.props;
    const imagesToShow = [...images];

    if(countFrom && images.length > countFrom) {
      imagesToShow.length = countFrom;
    }

    return(
        <div className="grid-container">
          {[1, 3, 4].includes(imagesToShow.length)  && this.renderOne()}
          {imagesToShow.length >= 2 && imagesToShow.length != 4 && this.renderTwo()}
          {imagesToShow.length >= 4 && this.renderThree()}
        </div>
    )
  }

}

Images.propTypes = {
  images: PropTypes.array.isRequired,
  hideOverlay: PropTypes.bool,
  overlayBackgroundColor: PropTypes.string,
  onClickEach: PropTypes.func,
  countFrom: PropTypes.number,
};

export default Images;