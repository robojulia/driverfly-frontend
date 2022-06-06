import React from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'react-bootstrap-icons';

import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default class extends React.Component {
    render() {
        return (
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                totalSlides={3}
                isPlaying
                touchEnabled
                dragEnabled
                infinite
            >
                <div className='Slider-container-bg'>
                    <Slider className='Slider__container'>
                        <Slide index={0}>
                            <div className="Slider_item d-flex justify-content-center align-items-center">
                                <div className="Slider_box">
                                    <Quote />
                                    <img src="img/Lydia-Driver2.jpg" alt="" className="" />
                                    <h3>Lydia Wright</h3>
                                    <span className="job text-theme">Team Driver - OTR</span>
                                    <div className="description">This site is amazing. I found my team driver through here as well as my
                                    first job out of CDL school.</div>
                                </div>
                            </div>
                        </Slide>
                        <Slide index={1}> <div className="Slider_item d-flex justify-content-center align-items-center">
                        <div className="Slider_item d-flex justify-content-center align-items-center">
                            <div className="Slider_box">
                                <Quote/>
                                <img src="img/Robert-Driver.jpg" alt=""/>
                                <h3>Robert Richards</h3>
                                <span className="job text-theme">Tanker Hauler</span>
                                <div className="description">Thanks guys you're awesome. Got a job and got moving in less than a week.</div>
                            </div>
                        </div>
                        </div>
                        </Slide>
                        <Slide index={2}>
                            <div className="Slider_item d-flex justify-content-center align-items-center">
                                <div className="Slider_box">
                                    <Quote />
                                    <h3>Bill Townson</h3>
                                    <span className="job text-theme">OTR Driver</span>
                                    <div className="description">This is the best job board I've used so far. It was easy to use and I
                                    was able to get a job in just days. Love that it's specific to the trucking industry.</div>
                                </div>
                            </div>
                        </Slide>
                    </Slider>
                </div>

                <ButtonBack className='Slider_owl-prev rounded'><ArrowLeft /></ButtonBack>
                <ButtonNext className='Slider_owl-next rounded'><ArrowRight /></ButtonNext>
            </CarouselProvider >

        );
    }
}
