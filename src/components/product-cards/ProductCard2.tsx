import HoverBox from "../HoverBox";
import LazyImage from "../LazyImage";
import { H4 } from "../Typography";
import React from "react";

export interface ProductCard2Props {
  imgUrl: string;
  title: string;
  price: number;
  productUrl: string;
}

const ProductCard2: React.FC<ProductCard2Props> = ({
  imgUrl,
  title,
  price,
  productUrl,
}) => {
  return (
      <a  href={productUrl}>
        <HoverBox borderRadius={8} mb="0.5rem">
          <LazyImage
            src={imgUrl}
            width="100%"
            height="auto"
            layout="responsive"
            alt={title}
          />
        </HoverBox>
        <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
          {title}
        </H4>
        <H4 fontWeight="600" fontSize="14px" color="primary.main">
          ${Math.ceil(price).toLocaleString()}
        </H4>
      </a>
  );
};

export default ProductCard2;
