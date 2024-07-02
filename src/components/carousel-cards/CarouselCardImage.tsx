import Card from "../Card";
import React from "react";

export interface CarouselCardImageProps {
  src: string; 
  redirectUrl?: string;
}

const CarouselCardImage: React.FC<CarouselCardImageProps> = (props) => { 
  const { src,redirectUrl } = props; 
  return (
      <Card>
        <a href={redirectUrl}>
          <img src={src} alt="carousel-card"/>
        </a>
        
      </Card>
  );
};

export default CarouselCardImage;