import Box from "../Box";
import FlexBox from "../FlexBox";
import LazyImage from "../LazyImage";
import Rating from "../rating/Rating";
import { H6, SemiSpan, Small } from "../Typography";
import React from "react";
import styled from "styled-components";

export interface ProductCard11Props {
  imgUrl?: string;
  title?: string;
  productUrl?: string;
  price?: number;
  oldPrice?: number;
  rating?: number;
}

const StyledProductCard = styled.div`
  .image-holder {
    position: relative;
    :after {
      content: " ";
      position: absolute;
      transition: all 250ms ease-in-out;
    }
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :hover {
    .image-holder:after {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.07);
    }
  }
`;

const ProductCard11: React.FC<ProductCard11Props> = ({
  imgUrl,
  title,
  productUrl,
  price,
  oldPrice,
  rating,
}) => {
  return (
      <a  href={productUrl}>
        <StyledProductCard>
          <Box className="image-holder">
            <LazyImage
              src={imgUrl}
              width="100%"
              height="auto"
              layout="responsive"
              objectFit="cover"
              mb="1rem"
            />
          </Box>

          <Box mb="0.5rem">
            <Rating value={rating} outof={5} color="warn" readonly />
          </Box>

          <H6 className="ellipsis" mb="6px" title={title}>
            {title}
          </H6>

          <FlexBox alignItems="center">
            <SemiSpan pr="0.25rem" fontWeight="600" color="primary.main">
              ${price?.toLocaleString()}
            </SemiSpan>

            {oldPrice && (
              <Small color="text.muted" lineHeight="1.3">
                {oldPrice}
              </Small>
            )}
          </FlexBox>
        </StyledProductCard>
      </a>
  );
};

ProductCard11.defaultProps = {
  rating: 5,
  price: 1300,
  oldPrice: 1500,
  imgUrl: "/assets/images/products/mask.png",
  title: "Blutooth Speaker",
  productUrl: "/product/324523",
};

export default ProductCard11;
