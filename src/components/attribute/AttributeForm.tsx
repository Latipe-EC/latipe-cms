import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import {Attribute} from "api/interface/product";
import {AddIcon, SmallCloseIcon} from "@chakra-ui/icons";


interface Props {
  attributes: Attribute[];
  onChange: (index: number, name: string, value: string) => void;
  handleAddClose: () => void;
  showAddModal: boolean;
  removeAttribute: (index: number) => void;
  handleAddAttributes: () => void;
}

const AttributeForm: React.FC<Props> = ({
                                          attributes,
                                          onChange,
                                          showAddModal,
                                          handleAddClose,
                                          removeAttribute,
                                          handleAddAttributes
                                        }) => {
  const handleInputChange = (index: number, name: string, value: string) => {
    onChange(index, name, value);
  };
  return (
      <Modal isOpen={showAddModal} onClose={handleAddClose} isCentered size="xl">
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader style={{
            fontWeight: 'bold',
            fontSize: '20px',
            color: 'gray.800',
            textAlign: "center",
            marginTop: '20px'
          }}>
            Add Attribute
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <FormControl>
              <FormLabel style={{fontWeight: 'bold'}}>Add attributes</FormLabel>
              <Flex flexWrap="wrap">
                {attributes.map((attribute, index) =>
                    <>
                      <Flex alignItems="center" mb={2} mt={2}>
                        <FormLabel alignItems="center" fontWeight="bold" mr={2}
                                   mt={2}
                                   mb={2}>
                          Attribute {index + 1}
                        </FormLabel>
                        <IconButton icon={<SmallCloseIcon/>} size="sm" colorScheme="red"
                                    onClick={() => removeAttribute(index)} aria-label={""}/>
                      </Flex>
                      <Box>
                        <Flex alignItems="center" mb="2">
                          <FormLabel htmlFor="name" mr="2">
                            Name
                          </FormLabel>
                          <Input
                              id="name"
                              value={attribute.name}
                              onChange={(e) => handleInputChange(index, "name", e.target.value)}
                              isRequired
                              w="100%"
                              mr="2"
                          />
                        </Flex>
                        <Flex alignItems="center" mb="2">
                          <Select id="type" value={attribute.type} w="50%" mr="2"
                                  onChange={(e) => handleInputChange(index, "type", e.target.value)}
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="selectbox">Selectbox</option>
                          </Select>
                          <FormLabel htmlFor="type" mr="2">
                            Type
                          </FormLabel>
                          <FormLabel htmlFor="prefixUnit" mr="2">
                            Prefix Unit
                          </FormLabel>
                          <Input
                              id="prefixUnit"
                              value={attribute.prefixUnit}
                              onChange={(e) => handleInputChange(index, "prefixUnit", e.target.value)}
                              isRequired
                              w="50%"
                          />
                        </Flex>

                        {attribute.type === "selectbox" && (
                            <>
                              <Flex alignItems="center" mb="2">
                                <FormLabel htmlFor="options" mr="2">
                                  Options
                                </FormLabel>
                                <Input
                                    id="options"
                                    value={attribute.options}
                                    onChange={(e) => handleInputChange(index, "options", e.target.value)}
                                    isRequired
                                    w="100%"
                                    mr="2"
                                />
                              </Flex>
                              <Flex alignItems="center" mb="2">
                                <FormLabel htmlFor="defaultValue" mr="2">
                                  Default Value
                                </FormLabel>
                                <Select id="defaultValue" value={attribute.defaultValue} w="100%"
                                        mr="2" onChange={
                                  (e) => handleInputChange(index, "defaultValue", e.target.value)
                                }>
                                  {attribute.options.split(',').map((option) => (
                                      <option value={option}>{option}</option>
                                  ))}
                                </Select>
                              </Flex>
                            </>
                        )}

                      </Box>
                    </>
                )}
              </Flex>
              <IconButton icon={<AddIcon/>} onClick={handleAddAttributes}
                          aria-label={""}></IconButton>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' color="red" mr={3} onClick={handleAddClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

  );
};
export default AttributeForm;