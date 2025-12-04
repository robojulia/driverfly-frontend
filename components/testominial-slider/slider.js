import React from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

export default function TestimonialSlider() {

    const { t } = useTranslation();

        return (
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={200}
                totalSlides={3}
                isPlaying
                touchEnabled
                dragEnabled
                infinite
                isIntrinsicHeight={true}
            >
                <div className='Slider-container-bg'>
                    <Slider className='Slider__container'>
                        <Slide index={0}> <div className="Slider_item d-flex justify-content-center align-items-center">
                            <div className="Slider_item d-flex justify-content-center align-items-center">
                                <div className="Slider_box">
                                    <Quote />
                                    <img src="img/Lydia-Driver2.jpg" alt="" className="" />
                                    <h3>{t("LYDIA_WRIGHT")}</h3>
                                    <span className="job text-theme">{t("TEAM_DRIVER_OTR")}</span>
                                    <div className="description">{t("THIS_SITE_IS_AMAZING")}</div>
                                </div>
                            </div>
                        </div>
                        </Slide>
                        <Slide index={1}> <div className="Slider_item d-flex justify-content-center align-items-center">
                            <div className="Slider_item d-flex justify-content-center align-items-center">
                                <div className="Slider_box">
                                    <Quote />
                                    <img src="img/Robert-Driver.jpg" alt="" />
                                    <h3>{t("ROBERT_RICHARDS")}</h3>
                                    <span className="job text-theme">{t("TANKER_HAULER")}</span>
                                    <div className="description">{t("THANKS_YOU_ARE_AWESOME")}</div>
                                </div>
                            </div>
                        </div>
                        </Slide>
                        <Slide index={2}> <div className="Slider_item d-flex justify-content-center align-items-center">
                            <div className="Slider_item d-flex justify-content-center align-items-center">
                                <div className="Slider_box">
                                    <Quote />
                                    <h3>{t("BILL_TOWNSON")}</h3>
                                    <span className="job text-theme">{t("OTR_DRIVER")}</span>
                                    <div className="description">{t("THIS_IS_BEST_JOB_BOARD")}</div>
                                </div>
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
