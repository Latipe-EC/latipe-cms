import {Flex, Text, Tooltip} from "@chakra-ui/react";
import HoverBox from "../HoverBox";
import LazyImage from "../LazyImage";
import {H4} from "../Typography";
import React from "react";

export interface ProductCard2Props {
  id: string;
  images: string;
  name: string;
  price: number;
}

const ProductCard2: React.FC<ProductCard2Props> = ({
                                                     id,
                                                     images,
                                                     name,
                                                     price,
                                                   }) => {
  return (
      <a href={`products/${id}`}>
        <Flex direction="column" align="center" justify="space-between"
              sx={{
                transition: "all 250ms ease-in-out 0s",
                margin: "auto",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
          <HoverBox borderRadius={8} mb="0.5rem">
            <LazyImage
                src={images[0]}
                width="100%"
                height="auto"
                layout="responsive"
                alt={name}
            />
          </HoverBox>
          <div>
            <Tooltip label={name} placement="top">
              <Text isTruncated fontWeight="600" fontSize="14px" mb="0.25rem">
                {name}
              </Text>
            </Tooltip>
            <H4 fontWeight="600" fontSize="14px" color="primary.main">
              ₫{Math.ceil(price).toLocaleString('vi-VN')}
            </H4>
          </div>
        </Flex>

      </a>
  );
};

export default ProductCard2;
