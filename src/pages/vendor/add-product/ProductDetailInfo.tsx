// ProductDetailInfo.tsx
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

const ProductDetailInfo = ({ onDetailInfoChange }) => {
  const [detail, setDetail] = useState('');

  const handleDetailChange = (event) => {
    setDetail(event.target.value);
    onDetailInfoChange(event.target.value);
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Detail</FormLabel>
        <Input placeholder="Detail" value={detail} onChange={handleDetailChange} />
      </FormControl>
    </Box>
  );
};

export default ProductDetailInfo;