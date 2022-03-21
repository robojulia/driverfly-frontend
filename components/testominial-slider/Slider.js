import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default class extends React.Component {
    render() {
        return (
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                totalSlides={5}
                isPlaying
                touchEnabled	
                dragEnabled	
                infinite
            >
                <Slider className='Slider__container'>
                    <Slide index={0}>
                        <div className="Slider_item">
                            <div className="Slider_box">
                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                <img src="img/Robert-Driver.jpg" alt="" className="" />
                                <h3>Robert Richards</h3>
                                <span className="job text-theme">Tanker Hauler</span>
                                <div className="description">Thanks guys you're awesome. Got a job and got moving in less than <br /> a week.</div>
                            </div>
                        </div>
                    </Slide>
                    <Slide index={1}> <div className="Slider_item">
                        <div className="Slider_box">
                            <i className="fa fa-quote-left" aria-hidden="true"></i>
                            <img src="img/Robert-Driver.jpg" alt="" className="" />
                            <h3>Tanker Hauler</h3>
                            <span className="job text-theme">ffffffffRobert Richards </span>
                            <div className="description">Browse profiles, reviews, and proposals then interview top driver <br />candidates.</div>
                        </div>
                    </div>
                    </Slide>
                    <Slide index={2}>
                        <div className="Slider_item">
                            <div className="Slider_box">
                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                <img src="img/Robert-Driver.jpg" alt="" className="" />
                                <h3>Robert Richards</h3>
                                <span className="job text-theme">Tanker Hauler</span>
                                <div className="description">Thanks guys you're awesome. Got a job and got moving in less than <br /> a week.</div>
                            </div>
                        </div>
                    </Slide>
                    
                    <Slide index={3}>
                        <div className="Slider_item">
                            <div className="Slider_box">
                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                <img src="img/Robert-Driver.jpg" alt="" className="" />
                                <h3>Robert Richards</h3>
                                <span className="job text-theme">Tanker Hauler</span>
                                <div className="description">Thanks guys you're awesome. Got a job and got moving in less than <br /> a week.</div>
                            </div>
                        </div>
                    </Slide>
                    
                    <Slide index={4}>
                        <div className="Slider_item">
                            <div className="Slider_box">
                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                <img src="img/Robert-Driver.jpg" alt="" className="" />
                                <h3>Robert Richards</h3>
                                <span className="job text-theme">Tanker Hauler</span>
                                <div className="description">Thanks guys you're awesome. Got a job and got moving in less than <br /> a week.</div>
                            </div>
                        </div>
                    </Slide>
                    
                    
                </Slider>
                <ButtonBack className='Slider_owl-prev'>Back</ButtonBack>
                <ButtonNext className='Slider_owl-next'>Next</ButtonNext>
            </CarouselProvider>
        );
    }
}