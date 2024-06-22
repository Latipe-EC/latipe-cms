// ProductClassification.tsx
import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";

const ProductClassification = ({ onClassificationChange }) => {
  const [classification, setClassification] = useState('');

  const handleClassificationChange = (event) => {
    setClassification(event.target.value);
    onClassificationChange(event.target.value);
  };

  return (
      <Box>
        <FormControl>
          <FormLabel>Classification</FormLabel>
          <Input placeholder="Classification" value={classification} onChange={handleClassificationChange} />
        </FormControl>
      </Box>
  );
};

export default ProductClassification;