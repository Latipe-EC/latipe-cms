import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Center, Divider, Flex, FormControl, FormLabel, HStack, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from "@chakra-ui/react";
import Card from "../../../components/Card";
import DropZone from "../../../components/DropZone";
import Grid from "../../../components/grid/Grid";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import './index.css'
import * as yup from "yup";
import { useEffect, useState } from "react";
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

type ProductClassification = {
  name: string;
  values: string[];
};

const AddProduct = () => {

  const [data, setData] = useState([]);
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [productClassifications, setProductClassifications] = useState<ProductClassification[]>([]);

  const handleDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    setImages((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleRemove = (index) => {
    setImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };
  const maxLength = 210;
  const isInvalid = name.length > maxLength;

  const tempdata = [
    {
      order: 1,
      categories: [
        { id: 13, name: 'Category 1' },
        { id: 2323, name: 'Category 2' },
        { id: 323, name: 'Category 3' },
      ],
    },
    {
      order: 2,
      categories: [
        { id: 49, name: 'Category 4' },
        { id: 59, name: 'Category 5' },
        { id: 69, name: 'Category 6' },
      ],
    },
    {
      order: 3,
      categories: [
        { id: 76, name: 'Category 7' },
        { id: 86, name: 'Category 8' },
        { id: 96, name: 'Category 9' },
      ],
    },
    {
      order: 4,
      categories: [
        { id: 763, name: 'Category 7' },
        { id: 863, name: 'Category 8' },
        { id: 963, name: 'Category 9' },
      ],
    },
  ];

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories(searchText);
    }
  }, [isModalOpen, searchText]);
  function fetchCategories(searchText: string) {
    setData(tempdata);
  }

  const handleCategorySelect = (category, order) => {
    setSelectedCategory([category]);
    setData((prevData) => {
      const newData = prevData.map((item) => {
        if (item.order > order) {
          console.log(item);
          return { ...item, categories: [] };
        }
        return item;
      });
      return newData;
    });
  }



  const handleAddProductClassification = () => {
    if (productClassifications.length >= 2) {
      return;
    }

    setProductClassifications([...productClassifications, { name: '', values: [''] }]);
  };

  const handleProductClassificationNameChange = (index: number, name: string) => {
    const newProductClassifications = [...productClassifications];
    newProductClassifications[index].name = name;
    setProductClassifications(newProductClassifications);
  };

  const handleProductClassificationValueChange = (index: number, valueIndex: number, value: string) => {
    const newProductClassifications = [...productClassifications];
    newProductClassifications[index].values[valueIndex] = value;
    if (valueIndex === newProductClassifications[index].values.length - 1) {
      newProductClassifications[index].values.push('');
    }
    setProductClassifications(newProductClassifications);

  };

  const handleRemoveProductClassification = (index: number) => {
    const newProductClassifications = [...productClassifications];
    newProductClassifications.splice(index, 1);
    setProductClassifications(newProductClassifications);
  };

  const handleRemoveProductClassificationValue = (index: number, valueIndex: number) => {
    const newProductClassifications = [...productClassifications];
    const productClassification = newProductClassifications[index];
    if (productClassification.values.length === 1) {
      return;
    }
    productClassification.values.splice(valueIndex, 1);
    setProductClassifications(newProductClassifications);
  };

  return (
    <div>
      <DashboardPageHeader
        title="Add Product"
        iconName="delivery-box"
        button={
          <a href="/vendor/products">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Product List
            </Button>
          </a>
        }
      />
      <Box mt={8} mb={8}>
        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                Basic information
              </Box>
            </AccordionButton>
            <AccordionPanel ml={2}>
              <FormControl isInvalid={isInvalid}>
                <FormLabel fontWeight="bold" fontSize="sm" mt={2}>Name</FormLabel>
                <InputGroup>
                  <Input
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={handleChangeName}
                    maxLength={maxLength}
                    pr="4rem"
                    overflow="hidden"
                  />
                  <InputRightElement width="50px" textAlign="center" mr={2}>
                    <Text fontSize="sm" color={isInvalid ? 'red.500' : 'gray.500'}>
                      {name.length}/{maxLength}
                    </Text>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isInvalid={isInvalid}>
                <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Description</FormLabel>
                <InputGroup>
                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={name}
                    maxLength={maxLength}
                    pr="4rem"
                    minH="100px"
                    resize="none"
                    onChange={handleChangeDescription}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isInvalid={isInvalid}>
                <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Category</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="category"
                    value={selectedCategory.map((cate) => cate.name).join('->')}
                    onChange={handleChangeName}
                    onClick={() => setIsModalOpen(true)}
                    maxLength={maxLength}
                    pr="4rem"
                    readOnly
                  />
                </InputGroup>
              </FormControl>

              <FormControl isInvalid={isInvalid}>
                <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Images</FormLabel>

                <DropZone onChange={handleDrop} />

                {images.length > 0 && (
                  <div>
                    <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Image Preview</FormLabel>
                    <div className="image-preview-container">
                      {images.map((previewImage, index) => (
                        <div key={index} className="image-preview">
                          <img src={URL.createObjectURL(previewImage)} alt="Preview" width="200" height="200" />
                          <button className="remove-image-button" type="button" onClick={() => handleRemove(index)}>
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormControl>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                Details information
              </Box>
            </AccordionButton>
            <AccordionPanel ml={2} >
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                Product Classsification
              </Box>
            </AccordionButton>
            <AccordionPanel ml={2} >
              <div>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="red"
                  variant="solid"
                  onClick={handleAddProductClassification}
                  isDisabled={productClassifications.length >= 2}
                  _disabled={{ bg: 'gray.500', cursor: 'not-allowed' }}

                >
                  Add Classification
                </Button>
                {productClassifications.length === 0 && (
                  <>
                    <FormControl mt={4} w="40%">
                      <FormLabel fontSize="sm" mb={2}>
                        Price
                      </FormLabel>
                      <Input
                        placeholder="Price"
                        type="number"
                        value={price}
                        onChange={(event) => setPrice(parseInt(event.target.value))}
                      />
                    </FormControl>

                    <FormControl mt={4} w="40%">
                      <FormLabel fontSize="sm" mb={2}>
                        Inventory
                      </FormLabel>
                      <Input
                        placeholder="Storage"
                        type="number"
                        value={inventory}
                        onChange={(event) => setInventory(parseInt(event.target.value))}
                      />
                    </FormControl>
                  </>
                )}
                {productClassifications.length > 0 && productClassifications.map((productClassification, index) => (
                  <Box key={index} mt={4} bg="gray.100" p={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <FormLabel fontWeight="bold" fontSize="xl" mb={0}>
                        Classification group {index + 1}
                      </FormLabel>
                      <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleRemoveProductClassification(index)}>
                        <CloseIcon />
                      </Button>
                    </Box>
                    <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap">
                      <FormControl w="50%" mb={4}>
                        <FormLabel fontSize="md" mb={0}>
                          Name
                        </FormLabel>
                        <Input
                          borderColor='gray.600'
                          placeholder="Product Classification Name"
                          value={productClassification.name}
                          onChange={(event) => handleProductClassificationNameChange(index, event.target.value)}
                        />
                      </FormControl>

                      <FormControl w="100%" >
                        <FormLabel fontSize="md" mb={0}>
                          Values
                        </FormLabel>
                        <Box mt={2} >
                          <Flex w="100%" alignItems="center" mb={2} flexWrap="wrap">
                            {productClassification.values.map((value, valueIndex) => (
                              <Flex key={valueIndex} w="50%" alignItems="center" mb={2}>
                                <InputGroup>
                                  <Input
                                    borderColor='gray.600'
                                    placeholder="Product Classification Value"
                                    value={value}
                                    onChange={(event) => handleProductClassificationValueChange(index, valueIndex, event.target.value)}
                                    mr={2}
                                  />
                                  <InputRightElement>
                                    <Button mr={4} size="sm" variant="ghost" colorScheme="red" onClick={() => handleRemoveProductClassificationValue(index, valueIndex)}>
                                      <CloseIcon />
                                    </Button>
                                  </InputRightElement>
                                </InputGroup>
                              </Flex>
                            ))}
                          </Flex>
                        </Box>
                      </FormControl>
                    </Box>
                  </Box>
                ))}
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box >
    </div >
  );
};





AddProduct.layout = VendorDashboardLayout;

export default AddProduct;
