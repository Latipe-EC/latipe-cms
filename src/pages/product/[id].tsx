import Box from "../../../src/components/Box";
import FlexBox from "../../../src/components/FlexBox";
import NavbarLayout from "../../../src/components/layout/NavbarLayout";
import AvailableShops from "../../../src/components/products/AvailableShops";
import FrequentlyBought from "../../../src/components/products/FrequentlyBought";
import ProductDescription from "../../../src/components/products/ProductDescription";
import ProductIntro from "../../../src/components/products/ProductIntro";
import ProductReview from "../../../src/components/products/ProductReview";
import RelatedProducts from "../../../src/components/products/RelatedProducts";
import { H5 } from "../../../src/components/Typography";
import  { useState } from "react";

const ProductDetails = () => {
  const state = {
    title: "Mi Note 11 Pro",
    price: 1135,
  };

  const [selectedOption, setSelectedOption] = useState("description");

  const handleOptionClick = (opt) => () => {
    setSelectedOption(opt);
  };

  return (
    <div>
      <ProductIntro {...state} />

      <FlexBox
        borderBottom="1px solid"
        borderColor="gray.400"
        mt="80px"
        mb="26px"
      >
        <H5
          className="cursor-pointer"
          mr="25px"
          p="4px 10px"
          color={
            selectedOption === "description" ? "primary.main" : "text.muted"
          }
          borderBottom={selectedOption === "description" && "2px solid"}
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
        >
          Description
        </H5>
        <H5
          className="cursor-pointer"
          p="4px 10px"
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" && "2px solid"}
          borderColor="primary.main"
        >
          Review (3)
        </H5>
      </FlexBox>

      <Box mb="50px">
        {selectedOption === "description" && <ProductDescription />}
        {selectedOption === "review" && <ProductReview />}
      </Box>

      <FrequentlyBought />

      <AvailableShops />

      <RelatedProducts />
    </div>
  );
};

ProductDetails.layout = NavbarLayout;

export default ProductDetails;
