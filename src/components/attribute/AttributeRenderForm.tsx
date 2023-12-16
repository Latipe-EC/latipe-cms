import React from "react";
import {
  Box,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
} from "@chakra-ui/react";
import {Attribute} from "api/interface/product";


interface Props {
  attributes: Attribute[];
  onChange: (attributeValue: { index: number; value: string }) => void;
}

const AttributeRenderForm: React.FC<Props> = ({attributes, onChange}) => {
  const handleInputChange = (index: number, value: string) => {
    onChange({index, value});
  };
  return (
      <Flex flexWrap="wrap">
        {attributes.map((attribute, index) => {
          const {
            name,
            defaultValue,
            type,
            isRequired,
            prefixUnit,
            options,
            value = "",
          } = attribute;

          if (type === "selectbox" && options) {
            return (
                <Box key={name} width="45%" margin="0 10px 10px 0">
                  <FormLabel fontWeight={'bold'}>{name} {isRequired &&
                      <Text as="span" color="red.500">*</Text>}</FormLabel>
                  <InputGroup>
                    <Select
                        defaultValue={value || defaultValue}
                        isRequired={isRequired}
                        onChange={(event) =>
                            handleInputChange(index, event.target.value)
                        }
                    >
                      {options.split(',').map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                      ))}
                    </Select>
                  </InputGroup>
                </Box>
            );
          }

          return (
              <Box key={name} width="45%" margin="0 10px 10px 0">
                <FormLabel fontWeight={'bold'}>{name} {isRequired &&
                    <Text as="span" color="red.500">*</Text>}</FormLabel>
                <InputGroup>
                  <Input
                      defaultValue={value || defaultValue}
                      isRequired={isRequired}
                      type={type === "number" ? "number" : "text"}
                      onChange={(event) =>
                          handleInputChange(index, event.target.value)
                      }
                  />
                  {prefixUnit && <InputRightElement children={prefixUnit}/>}
                </InputGroup>
              </Box>
          );
        })}
      </Flex>
  );
};
export default AttributeRenderForm;