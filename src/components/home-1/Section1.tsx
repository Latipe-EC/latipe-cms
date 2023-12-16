import Box from "../Box";
import CarouselCard1 from "../carousel-cards/CarouselCard1";
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
                totalSlides={5}
                visibleSlides={1}
                infinite={true}
                autoPlay={true}
                showDots={true}
                showArrow={false}
                spacing="0px"
            >
              <CarouselCard1/>
              <CarouselCard1/>
              <CarouselCard1/>
              <CarouselCard1/>
              <CarouselCard1/>
            </Carousel>
          </Container>
        </Box>
      </Fragment>
  );
};

export default Section1;
