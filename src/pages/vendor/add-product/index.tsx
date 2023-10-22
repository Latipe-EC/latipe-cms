import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Flex, FormControl, FormLabel, IconButton, Image, Input, InputGroup, InputLeftElement, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Switch, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr } from "@chakra-ui/react";
import DropZone from "../../../components/DropZone";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import './index.css'
import { useEffect, useState } from "react";
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Attribute, ProductClassification, ProductVariant } from "api/interface/product";
import AttributeForm from "../../../components/attribute/AttributeForm";


const attributess = [
  {
    name: "Name",
    defaultValue: "",
    type: "string",
    isRequired: true,
  },
  {
    name: "Age",
    defaultValue: "18",
    type: "number",
    isRequired: true,
    prefixUnit: "years",
  },
  {
    name: "Gender",
    defaultValue: "Male",
    type: "selectbox",
    isRequired: true,
    options: ["Male", "Female", "Other"],
  },
];
const AddProduct = () => {

  const [isPublic, setIsPublic] = useState(true);
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
  const [attributeValues, setAttributeValues] = useState(attributess);
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


  const handleAttributeChange = ({ index, value }) => {
    setAttributeValues((prevAttributes) =>
      prevAttributes.map((attribute, i) =>
        i === index ? { ...attribute, ["value"]: value } : attribute
      )
    );
    console.log(attributeValues);
  };

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
    setProductVariants([...productVariants, { name: '', options: [{ option: '', file: new File([new Blob()], 'Upload', { type: 'image/png' }) }] }]);
  }

  const handleProductVariantNameChange = (index: number, name: string) => {
    const newProductVariants = [...productVariants];
    newProductVariants[index].name = name;
    setProductVariants(newProductVariants);
  };

  const handleAddProductVariantValue = (index: number) => {
    const newProductVariants = [...productVariants];
    const newProductClassification = [...productClassification];

    newProductVariants[index].options.push({ option: '', file: new File([new Blob()], 'Upload', { type: 'image/png' }) });
    if (index === 0) {
      if (newProductVariants.length === 1) {
        newProductClassification.push({
          name:
            (index * newProductVariants[index].options.length + 1).toString(),
          quantity: 0, price: 0, sku: ''
        });
      } else {
        const newClassification = newProductVariants[1]
          .options.map(() => {
            return {
              name: '',
              quantity: 0, price: 0, sku: ''
            }
          });
        newProductClassification.push(...newClassification);
      }
    }
    if (index === 1) {
      newProductClassification.splice(newProductClassification.length, 0, {
        name:
          '',
        quantity: 0, price: 0, sku: ''
      });
      newProductClassification.splice(2 * newProductVariants[index].options.length - 1, 0, {
        name:
          '',
        quantity: 0, price: 0, sku: ''
      });
    }
    console.log(newProductClassification);
    setProductClassification(newProductClassification);
    setProductVariants(newProductVariants);

  }

  const handleProductVariantValueChange = (index: number, valueIndex: number, value: string) => {
    const newProductVariants = [...productVariants];
    newProductVariants[index].options[valueIndex].option = value;
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
    console.log(value);
    const newProductClassification = [...productClassification];
    switch (key) {
      case 'price':
        newProductClassification[index][key as 'price'] = value as number;
        break;
      case 'quantity':
        newProductClassification[index][key as 'quantity'] = value as number;
        break;
      case 'promotionalPrice':
        newProductClassification[index][key as 'promotionalPrice'] = value as number;
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
                          <Image src={URL.createObjectURL(previewImage)}
                            boxSize='150px' />
                          <button className="remove-image-button" type="button" onClick={() => handleRemove(index)}>
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormControl>
              <FormControl isInvalid={isInvalid}>
                <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Public</FormLabel>
                <Switch onChange={() => { setIsPublic(!isPublic) }} id='email-alerts' />
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
              <AttributeForm attributes={attributeValues} onChange={handleAttributeChange}></AttributeForm>
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
                            {productVariant.options.map((value, valueIndex) => (
                              <InputGroup w="50%">
                                <Input
                                  borderColor='gray.600'
                                  placeholder="Product Classification Value"
                                  value={value.option}
                                  mr={2}
                                  mb={2}
                                  onChange={(event) => handleProductVariantValueChange(index, valueIndex, event.target.value)}
                                />
                                <InputRightElement>
                                  <Button mr={4} size="sm" variant="ghost" colorScheme="red" onClick={() => handleRemoveProductVariantValue(index, valueIndex)}>
                                    <CloseIcon />
                                  </Button>
                                </InputRightElement>
                              </InputGroup>
                            ))}
                            <IconButton
                              isRound={true}
                              variant='solid'
                              colorScheme='teal'
                              aria-label='Done'
                              fontSize='20px'
                              onClick={() => handleAddProductVariantValue(index)}
                              icon={<AddIcon />}
                            />
                          </Flex>

                        </Box>

                      </FormControl>


                    </Box>
                  </Box>
                ))}

                {/* // table */}
                {productVariants.length > 0 && (
                  <Table mt={8} variant="striped" colorScheme='WhiteAlpha' style={{
                    borderCollapse: "separate",
                    border: "4px solid #ddd",

                  }} >
                    <Thead h="100px" >
                      <Tr>
                        <Th
                          bg="green.200"
                          borderBottom="2px"
                          borderColor="gray.300"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wide"
                          fontSize="sm"
                          py="2"
                          textAlign="center"
                          whiteSpace="unset"
                          overflow="hidden"
                          maxW="100px"
                          textOverflow="ellipsis"

                        >
                          {productVariants[0].name}
                        </Th>
                        {productVariants.length === 2 && (
                          <Th
                            bg="green.200"
                            borderBottom="2px"
                            borderColor="gray.300"
                            fontWeight="bold"
                            textTransform="uppercase"
                            letterSpacing="wide"
                            fontSize="sm"
                            py="2"
                            textAlign="center"
                            maxW="100px"
                            whiteSpace="unset"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {productVariants[1].name}
                          </Th>
                        )}
                        <Th
                          bg="green.200"
                          borderBottom="2px"
                          borderColor="gray.300"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wide"
                          fontSize="sm"
                          py="2"
                          textAlign="center"
                        >
                          Price
                        </Th>
                        <Th
                          bg="green.200"
                          borderBottom="2px"
                          borderColor="gray.300"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wide"
                          fontSize="sm"
                          py="2"
                          textAlign="center"
                        >
                          Promotional Price
                        </Th>
                        <Th
                          bg="green.200"
                          borderBottom="2px"
                          borderColor="gray.300"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wide"
                          fontSize="sm"
                          py="2"
                          textAlign="center"
                        >
                          Warehouse
                        </Th>
                        <Th
                          bg="green.200"
                          borderBottom="2px"
                          borderColor="gray.300"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wide"
                          fontSize="sm"
                          py="2"
                          textAlign="center"
                        >
                          SKU
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody borderColor="red.900">
                      {productVariants[0].options.map((item, index) => (
                        <Tr key={index}>
                          <Td style={{
                            borderRight: "2px solid #ddd",
                            borderBottom: index === productVariants[0].options.length - 1 ? "none" : "2px solid #ddd",
                          }}
                          >
                            <Flex alignItems="center" justifyContent="space-between" >
                              {item.option}
                              <IconButton
                                aria-label="Upload file"
                                icon={<AddIcon />}
                                onClick={() => {
                                  const fileInput = document.getElementById('fileInput');
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                              >
                              </IconButton>
                            </Flex>

                            <Flex alignItems="center" justifyContent="space-between" >
                              <Text mr={2}>
                                {productVariants[0].options[index].file !== null ?
                                  productVariants[0].options[index].file.name : "Upload"}
                              </Text>
                              {productVariants[0].options[index].file !== null &&
                                <IconButton
                                  aria-label="Remove file"
                                  icon={<CloseIcon boxSize={3} color="red.500" />}
                                  bg="transparent"
                                  onClick={() => {
                                    const updatedOptions = [...productVariants[0].options];
                                    updatedOptions[index].file = null;
                                    setProductVariants([
                                      {
                                        ...productVariants[0],
                                        options: updatedOptions,
                                      },
                                      ...productVariants.slice(1),
                                    ]);
                                  }}
                                />
                              }
                            </Flex>
                            <Input id="fileInput" type="file" display="none"
                              accept="image/*,video/*,.gif"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  const updatedOptions = [...productVariants[0].options];
                                  console.log(updatedOptions, index);
                                  updatedOptions[index].file = event.target.files[0];
                                  setProductVariants([
                                    {
                                      ...productVariants[0],
                                      options: updatedOptions,
                                    },
                                    ...productVariants.slice(1),
                                  ]);
                                }
                              }} />
                          </Td>
                          {
                            productVariants.length === 2 && (
                              <>
                                <Td style={{
                                  borderRight: "2px solid #ddd",
                                }}>
                                  {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                    item !== null && item.option !== '' && (
                                      <>
                                        <Tr style={{
                                          borderRight: "5px solid #ddd",
                                        }} key={`classd2${valueIndex}`}>
                                          <Input
                                            value={item.option}
                                            maxLength={maxLength}
                                            mb={2}
                                            border="none"
                                            readOnly
                                          />
                                        </Tr>
                                      </>
                                    ))}
                                </Td>

                                <Td style={{
                                  borderRight: "2px solid #ddd",
                                }}>
                                  {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                    item !== null && item.option !== '' && (
                                      <Tr key={`price-unique${index}`}>
                                        <InputGroup>
                                          <Input
                                            placeholder="price"
                                            type="number"
                                            value={productClassification[index * productVariants[productVariants.length - 1].options.length + valueIndex].price}
                                            onChange={(event) =>
                                              handleProductClassificationChange(
                                                index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                                'price',
                                                event.target.value
                                              )
                                            }
                                            maxLength={maxLength}
                                            overflow="hidden"
                                            mb={2}
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

                                <Td style={{
                                  borderRight: "2px solid #ddd",
                                }}>
                                  {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                    item !== null && item.option !== '' && (
                                      <Tr key={`pricePromotional-unique${index}`}>
                                        <InputGroup>
                                          <Input
                                            placeholder="Promotional Price"
                                            type="number"
                                            value={productClassification[index * productVariants[productVariants.length - 1].options.length + valueIndex].promotionalPrice}
                                            onChange={(event) =>
                                              handleProductClassificationChange(
                                                index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                                'promotionalPrice',
                                                event.target.value
                                              )
                                            }
                                            maxLength={maxLength}
                                            overflow="hidden"
                                            mb={2}
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

                                <Td style={{
                                  borderRight: "2px solid #ddd",
                                }}>
                                  {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                    item !== null && item.option !== '' && (
                                      <Tr key={`quantity${index}`}>
                                        <NumberInput step={1} defaultValue={0} min={0} mb={2}
                                          value={productClassification[index * productVariants[productVariants.length - 1].options.length + valueIndex].quantity}
                                          onChange={(value) =>
                                            handleProductClassificationChange(
                                              index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                              'quantity',
                                              value
                                            )
                                          }>
                                          <NumberInputField />
                                          <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                          </NumberInputStepper>
                                        </NumberInput>

                                      </Tr>
                                    ))}
                                </Td>
                                <Td >
                                  {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                    item !== null && item.option !== '' && (
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
                                          mb={2}
                                          maxLength={maxLength}
                                          overflow="hidden"
                                        />
                                      </Tr>
                                    ))}
                                </Td>
                              </>
                            )
                          }

                          {
                            productVariants.length === 1 &&
                            item !== null && item.option !== '' && (
                              <>
                                <Td>
                                  <Tr key={`price${index}`}>
                                    <InputGroup>
                                      <Input
                                        placeholder="price"
                                        type="number"
                                        value={productClassification[index].price}
                                        onChange={(event) =>
                                          handleProductClassificationChange(
                                            index,
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
                                </Td>

                                <Td>
                                  <Tr key={`promotionalPrice${index}`}>
                                    <InputGroup>
                                      <Input
                                        placeholder="price"
                                        type="number"
                                        value={productClassification[index].promotionalPrice}
                                        onChange={(event) =>
                                          handleProductClassificationChange(
                                            index,
                                            'promotionalPrice',
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
                                </Td>
                                <Td>
                                  <Tr key={`store${index}`}>
                                    <Input
                                      placeholder="inventory"
                                      type="number"
                                      value={productClassification[index].quantity}
                                      onChange={(event) =>
                                        handleProductClassificationChange(
                                          index,
                                          'quantity',
                                          event.target.value
                                        )
                                      }
                                      maxLength={maxLength}
                                    />
                                  </Tr>
                                </Td>
                                <Td>
                                  <Tr key={`sku${index}`}>
                                    <Input
                                      placeholder="sku"
                                      value={productClassification[index].sku} onChange={(event) =>
                                        handleProductClassificationChange(
                                          index,
                                          'sku',
                                          event.target.value
                                        )
                                      }
                                      maxLength={maxLength}
                                      pr="4rem"
                                      overflow="hidden"
                                    />
                                  </Tr>
                                </Td>
                              </>
                            )
                          }

                        </Tr>
                      ))}


                    </Tbody>
                  </Table>
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>
          <Flex justifyContent="flex-end" mt={2}>
            <Button
              isLoading={false}
              loadingText='Loading'
              colorScheme='teal'
              variant='outline'
              spinnerPlacement='end'

            >
              Save
            </Button>
          </Flex>

        </Accordion>
      </Box >
    </div >
  );
};





AddProduct.layout = VendorDashboardLayout;

export default AddProduct;
