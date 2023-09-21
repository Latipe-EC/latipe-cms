import Box from "../Box";
import HoverBox from "../HoverBox";
import LazyImage from "../LazyImage";
import { H4 } from "../Typography";
import React from "react";

export interface ProductCard5Props {
  imgUrl: string;
  title: string;
}

const ProductCard5: React.FC<ProductCard5Props> = ({ imgUrl, title }) => {
  return (
    <Box>
      <HoverBox borderRadius={5} mb="0.5rem">
        <LazyImage
          src={imgUrl}
          width={260}
          height={175}
          layout="responsive"
          objectFit="cover"
          alt={title}
        />
      </HoverBox>
      <H4 fontSize="14px" fontWeight="600">
        {title}
      </H4>
    </Box>
  );
};

export default ProductCard5;
