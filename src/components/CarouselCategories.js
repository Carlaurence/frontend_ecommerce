import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import './Styles.css';//PARA PONER TRANSPARENTE LOS SLICK-ARROWS

export default class CarouselFooter extends Component {

    render() {

        const settings = {
            dots: true,
            infinite: true,
            speed: 4000,
            autoplay: true,
            autoplaySpeed: 1000,
            pauseOnHover: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            cssEase: "linear",
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                  }
                },
                {
                  breakpoint: 820,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 1
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
        };

        //THIS PROPS IS AN OBJECT WITH ALL CATEGORIES AVAILABLES IN MONGODB WHICH COMING FROM <HOME> COMPONENT
        const categories = this.props.categories;
        //console.log(categories)

        //IMPORTANT:
        /**
         * Para la relación de aspecto predeterminada de 16:9, codifica en las siguientes resoluciones: 
         * 4320p (8K): 7680 × 4320. 
         * 2160p (4K): 3840 × 2160. 
         * 1440p (2K): 2560 × 1440.
         * REGULAR: 1920 x 1080.
         * REGULAR: 1280 x 720.
         * CONCLUSION: 16/9 = FACTOR 1.78 => POR CADA 1.78 DE ANCHO, REQUIERE 1 DE ALTO 
         */
        //lg:w-[1000px] lg:h-[562px] md:w-[820px] md:h-[460px] sm:w-[400px] sm:h-[225px]
        //

        return (
            <div className="">
                <Slider {...settings}>
                    {categories.map((category, index) => (
                        <div key={category._id}>
                            <Link to={`/products-by-category/${category._id}`}>
                                <img src={category.image.secure_url} alt="imagen#" className="w-[95%] shadow-md hover:scale-105"></img>
                                <h1 style={{ color: '#4267b2' }} className="flex justify-center font-semibold">{category.name}</h1>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
}
