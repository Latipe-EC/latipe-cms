import Box from "../Box";
import CarouselCardImage from "../carousel-cards/CarouselCardImage";
import CarouselCardTextImage from "../carousel-cards/CarouselCardTextImage";
import Carousel from "../carousel/Carousel";
import Container from "../Container";
import Navbar from "../navbar/Navbar";
import React, {Fragment} from "react";

const Section1: React.FC = () => {
  return (
      <Fragment>
        <Navbar navListOpen={true}/>
        <Box bg="gray.white" mb="3.75rem">
          <Container pb="2rem">
            <Carousel
                totalSlides={4}
                visibleSlides={1}
                infinite={true}
                autoPlay={true}
                showDots={true}
                showArrow={false}
                spacing="0px"
            >
              <CarouselCardTextImage/>
             
              <CarouselCardImage src={"https://img.lazcdn.com/us/domino/603f6cfd579ac06a6da687582678d385.jpg_2200x2200q80.jpg_.webp"} redirectUrl="#"/>
              <CarouselCardImage src={"https://img.lazcdn.com/us/domino/07504f73046932e695992f5a4c81fa93.jpg_2200x2200q80.jpg_.webp"} redirectUrl="#"/>  
              <CarouselCardImage src={"https://img.lazcdn.com/us/domino/ad363ca8b48d1b9e74db623b9ff1ae99.jpg_2200x2200q80.jpg_.webp"} redirectUrl="#"/>            
            </Carousel>
          </Container>
        </Box>
      </Fragment>
  );
};

export default Section1;
