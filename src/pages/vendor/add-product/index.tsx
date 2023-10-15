import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr } from "@chakra-ui/react";
import DropZone from "../../../components/DropZone";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import './index.css'
import { useEffect, useState } from "react";
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { ProductClassification, ProductVariant } from "api/interface/product";



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
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productClassification, setProductClassification] = useState<ProductClassification[]>([]);
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



  const handleAddProductVariant = () => {
    if (productVariants.length >= 2) {
      return;
    }
    if (productVariants.length === 0) {
      setProductClassification([{ name: '0', quantity: 0, price: 0, sku: '' }]);
    }
    else {
      const newProductClassification = [...productClassification];
      newProductClassification.flatMap((item, index) => [item, {
        name:
          (index + 2).toString(),
        quantity: 0, price: 0, sku: ''
      }])
      setProductClassification(newProductClassification);

    }
    setProductVariants([...productVariants, { name: '', options: [''] }]);
  }


  const handleProductVariantNameChange = (index: number, name: string) => {
    const newProductVariants = [...productVariants];
    newProductVariants[index].name = name;
    setProductVariants(newProductVariants);
  };

  const handleProductVariantValueDefault = (index, value) => {
    const newProductVariants = [...productVariants];
    newProductVariants[index].options.push(value);
    setProductVariants(newProductVariants);

  }
  const handleProductVariantValueChange = (index: number, valueIndex: number, value: string) => {
    const newProductVariants = [...productVariants];
    const newProductClassification = [...productClassification];

    newProductVariants[index].options[valueIndex] = value;
    if (valueIndex === newProductVariants[index].options.length - 1) {
      newProductVariants[index].options.push('');

      // add new product classification in 2
      if (index === 0) {
        if (newProductVariants.length === 1) {
          newProductClassification.push({
            name:
              (index * newProductVariants[index].options.length + valueIndex + 1).toString(),
            quantity: 0, price: 0, sku: ''
          });
        } else {
          const newClassification = newProductVariants[1]
            .options.map((_, i) => {
              return {
                name: (index * newProductVariants[index].options.length + i).toString(),
                quantity: 0, price: 0, sku: ''
              }
            });
          newProductClassification.push(...newClassification);
        }
      }
      // add new product classification in 1
      if (index === 1) {
        newProductClassification.splice(valueIndex, 0, {
          name:
            (valueIndex).toString(),
          quantity: 0, price: 0, sku: ''
        });
        newProductClassification.splice(valueIndex + newProductVariants[index].options.length - 1, 0, {
          name:
            (index * newProductVariants[index].options.length + valueIndex).toString(),
          quantity: 0, price: 0, sku: ''
        });
      }
    }
    setProductClassification(newProductClassification);
    setProductVariants(newProductVariants);
  };

  const handleRemoveProductVariant = (index: number) => {
    const newProductVariants = [...productVariants];
    newProductVariants.splice(index, 1);

    const newProductClassification = [...productClassification];
    newProductClassification.splice(index * productVariants[index].options.length, productVariants[index].options.length);

    setProductClassification(newProductClassification);
    setProductVariants(newProductVariants);
  };

  const handleRemoveProductVariantValue = (index: number, valueIndex: number) => {
    const newProductVariants = [...productVariants];
    const productVariant = newProductVariants[index];
    if (productVariant.options.length === 1) {
      return;
    }

    const newProductClassification = [...productClassification];
    newProductClassification.splice(valueIndex, 1);
    if (productVariant.options.length === 2) {
      newProductClassification.splice(valueIndex + productVariants[index].options.length - 1, 1);
    }
    setProductClassification(newProductClassification);

    productVariant.options.splice(valueIndex, 1);
    setProductVariants(newProductVariants);
  };

  const handleProductClassificationChange = (
    index: number,
    key: keyof ProductClassification,
    value: number | string
  ) => {
    const newProductClassification = [...productClassification];
    switch (key) {
      case 'price':
        newProductClassification[index][key as 'price'] = value as number;
        break;
      case 'quantity':
        newProductClassification[index][key as 'quantity'] = value as number;
        break;
      case 'sku':
        newProductClassification[index][key as 'sku'] = value as string;
        break;
    }
    setProductClassification(newProductClassification);
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
                  onClick={handleAddProductVariant}
                  isDisabled={productVariants.length >= 2}
                  _disabled={{ bg: 'gray.500', cursor: 'not-allowed' }}

                >
                  Add Classification
                </Button>

                {productVariants.length === 0 && (
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
                {productVariants.length > 0 && productVariants.map((productVariant, index) => (
                  <Box key={index} mt={4} bg="gray.100" p={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <FormLabel fontWeight="bold" fontSize="xl" mb={0}>
                        Classification group {index + 1}
                      </FormLabel>
                      <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleRemoveProductVariant(index)}>
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
                          value={productVariant.name}
                          onChange={(event) => handleProductVariantNameChange(index, event.target.value)}
                        />
                      </FormControl>

                      <FormControl w="100%" >
                        <FormLabel fontSize="md" mb={0}>
                          Values
                        </FormLabel>
                        <Box mt={2} >
                          <Flex w="100%" alignItems="center" mb={2} flexWrap="wrap">
                            <Flex key='232' w="50%" alignItems="center" mb={2}>
                              {productVariant.options.map((value, valueIndex) => (
                                <InputGroup>
                                  <Input
                                    borderColor='gray.600'
                                    placeholder="Product Classification Value"
                                    value={value}
                                    onChange={(event) => handleProductVariantValueChange(index, valueIndex, event.target.value)}
                                    mr={2}
                                  />
                                  <InputRightElement>
                                    <Button mr={4} size="sm" variant="ghost" colorScheme="red" onClick={() => handleRemoveProductVariantValue(index, valueIndex)}>
                                      <CloseIcon />
                                    </Button>
                                  </InputRightElement>
                                </InputGroup>
                              ))}
                              <Input
                                borderColor='gray.600'
                                placeholder="value"
                                mr={2}
                                onChange={(event) => handleProductVariantValueDefault(index, event.target.value)}
                              />
                            </Flex>
                          </Flex>
                        </Box>
                      </FormControl>



                    </Box>
                  </Box>
                ))}

                {/* // table */}
                {productVariants.length > 0 && (
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>{productVariants[0].name}</Th>
                        {productVariants.length === 2 && (
                          <Th>{productVariants[1].name}</Th>
                        )}
                        <Th>price</Th>
                        <Th>warehouse</Th>
                        <Th>sku</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {productVariants[0].options.map((item, index) => (
                        <Tr key={index}>
                          <Td>{item}</Td>
                          <Td>
                            {productVariants[0].options.map((item, valueIndex) => (
                              <Tr key={`class2${valueIndex}`}>
                                {item}
                              </Tr>
                            ))}
                          </Td>
                          <Td>
                            {productVariants[productVariants.length - 1].options.map((item, valueIndex) =>
                              item !== null && item !== '' && (
                                <Tr key={`price${index}`}>
                                  <InputGroup>
                                    <Input
                                      placeholder="price"
                                      value={productClassification[0].price}
                                      type="number"
                                      onChange={(event) =>
                                        handleProductClassificationChange(
                                          index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                          'price',
                                          event.target.value
                                        )
                                      }
                                      maxLength={maxLength}
                                      pr="4rem"
                                      overflow="hidden"
                                    />
                                    <InputLeftElement width="50px" textAlign="center" mr={2}>
                                      <Text fontSize="sm" color={isInvalid ? 'red.500' : 'gray.500'}>
                                        $
                                      </Text>
                                    </InputLeftElement>
                                  </InputGroup>
                                </Tr>
                              ))}
                          </Td>
                          <Td>
                            {productVariants[productVariants.length - 1].options.map((item, valueIndex) =>
                              item !== null && item !== '' && (
                                <Tr key={`store${index}`}>
                                  <Input
                                    placeholder="inventory"
                                    type="number"
                                    value={productClassification[0].quantity}
                                    onChange={(event) =>
                                      handleProductClassificationChange(
                                        index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                        'quantity',
                                        event.target.value
                                      )
                                    }
                                    maxLength={maxLength}
                                    pr="4rem"
                                  />
                                </Tr>
                              ))}
                          </Td>
                          <Td>
                            {productVariants[productVariants.length - 1].options.map((item, valueIndex) =>
                              item !== null && item !== '' && (
                                <Tr key={`sku${index}`}>
                                  <Input
                                    placeholder="sku"
                                    value={productClassification[index * productVariants[productVariants.length - 1].options.length + valueIndex].sku}
                                    onChange={(event) =>
                                      handleProductClassificationChange(
                                        index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                        'sku',
                                        event.target.value
                                      )
                                    }
                                    maxLength={maxLength}
                                    pr="4rem"
                                    overflow="hidden"
                                  />
                                </Tr>
                              ))}
                          </Td>

                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
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
