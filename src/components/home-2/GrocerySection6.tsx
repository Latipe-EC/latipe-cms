import Box from "../Box";
import Button from "../buttons/Button";
import Card from "../Card";
import Carousel from "../carousel/Carousel";
import FlexBox from "../FlexBox";
import LazyImage from "../LazyImage";
import {H3, H5} from "../Typography";
import React from "react";
import {GrocerySection6Wrapper} from "./GrocerySectionStyle";

const GrocerySection6: React.FC = () => {
  return (
      <GrocerySection6Wrapper>
        <Box m="-0.25rem">
          <Carousel
              totalSlides={3}
              visibleSlides={1}
              showDots={true}
              autoPlay={true}
              spacing="0px"
              arrowButtonColor="inherit"
              showArrowOnHover={true}
          >
            {cardList.map((item) => (
                <Box p="0.25rem">
                  <Card className="carousel-card" bg={item.bgColor}>
                    <FlexBox alignItems="center" flexWrap="wrap">
                      <Box flex="1 1 0">
                        <H5 fontWeight="600" fontSize="18px" mb="0.5rem">
                          {item.subtitle}
                        </H5>
                        <H3 mb="2rem" fontSize="35px" lineHeight="1.37">
                          {item.title}
                        </H3>

                        <a href={item.shopUrl}>
                          <Button variant="contained" color="primary">
                            Shop Now
                          </Button>
                        </a>
                      </Box>
                      <LazyImage
                          src={item.imgUrl}
                          width="320px"
                          height="auto"
                          objectFit="contain"
                      />
                    </FlexBox>
                  </Card>
                </Box>
            ))}
          </Carousel>
        </Box>
      </GrocerySection6Wrapper>
  );
};

const cardList = [
  {
    title: "25% Special Off Today Only for Vegetables",
    subtitle: "Till 10 Sept, 2021",
    imgUrl:
        "/assets/images/products/kisspng-organic-food-leaf-vegetable-fruit-rich-vegetables-5aa9f4d026ae09 1.png",
    shopUrl: "/",
    bgColor: "#F6FFE5",
  },
  {
    title: "15% Off for All Product Only Need to Subscribe",
    subtitle: "Subscribe Us",
    imgUrl:
        "/assets/images/products/kisspng-organic-food-milk-food-gift-baskets-grocery-5abeaffc1e5b25 1.png",
    shopUrl: "/",
    bgColor: "#FFF8E5",
  },
  {
    title: "25% Special Off Today Only for Vegetables",
    subtitle: "Till 10 Sept, 2021",
    imgUrl:
        "/assets/images/products/kisspng-organic-food-leaf-vegetable-fruit-rich-vegetables-5aa9f4d026ae09 1.png",
    shopUrl: "/",
    bgColor: "#F6FFE5",
  },
];
export default GrocerySection6;
