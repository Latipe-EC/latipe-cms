import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack
} from "@chakra-ui/react";
import DropZone from "../../../components/DropZone";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import './index.css'
import {useEffect, useState} from "react";
import {AddIcon, CloseIcon} from '@chakra-ui/icons';
import {
  Options,
  ProductClassification,
  ProductResponse,
  ProductVariant,
  UpdateProductRequest
} from "api/interface/product";
import AttributeRenderForm from "../../../components/attribute/AttributeRenderForm";
import {debounce} from "lodash";
import {useDispatch} from "react-redux";
import {getChildsCategory, searchCategory} from "../../../store/slices/categories-slice";
import {AppThunkDispatch} from "../../../store/store";
import {getProductById, updateProduct} from "../../../store/slices/products-slice";
import {useNavigate, useParams} from "react-router-dom";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const ProductDetailVendor = () => {


  const [isPublished, setIsPublished] = useState(true);
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [isModalCateOpen, setModalCateOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productClassifications, setProductClassifications] = useState<ProductClassification[]>([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [disableButtonSaveCategory, setDisableButtonSaveCategory] = useState(false);
  const [step, setStep] = useState([0, 1, 2]);
  const [promotionalPrice, setPromotionalPrice] = useState(0);
  const [disableSaveProduct, setDisableSaveProduct] = useState(true);
  const [fileOriginal, setFileOriginal] = useState([]);
  const dispatch = useDispatch<AppThunkDispatch>();
  const toast = useToast();
  const navigate = useNavigate();
  const {id} = useParams<{ id: string }>();
  const maxLength = 210;
  const isInvalid = name.length > maxLength;
  const [defaultValue, setDefaultValue] = useState<ProductResponse>();

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id)).unwrap().then((res) => {
        if (res.status.toString().startsWith('2')) {
          const product = res.data;

          const setProduct = async (product) => {
            const listFile = [];
            let urls = product.images;
            let blobs = [];
            for (let i = 0; i < urls.length; i++) {
              const blob = await createBlobFromUrl(urls[i])
              listFile.push({
                url: urls[i],
                file: blob
              })
              blobs.push(blob);
            }
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setInventory(product.quantity);
            setIsPublished(product.isPublished);
            setImages(blobs == null ? [] : blobs);
            setSelectedCategory(product.categories);
            setAttributeValues(product.detailsProduct);
            blobs = [];
            urls = product.productVariants.map(x => x.image);
            for (let i = 0; i < urls.length; i++) {
              const blob = await createBlobFromUrl(urls[i])
              listFile.push({
                url: urls[i],
                file: blob
              })
              blobs.push(blob);
            }
            setFileOriginal(listFile);

            setProductVariants(product.productVariants.map((productVariant, index) => {
              return {
                ...productVariant,
                options: productVariant.options.map((option: Options) => ({
                  value: option.value,
                  image: productVariant.image,
                  file: blobs[index] != null ? blobs[index] : new File([new Blob()], 'Upload', {type: 'image/png'})
                }))
              }
            }));

            setProductClassifications(product.productClassifications.map((productClassification) => ({
              ...productClassification,
              promotionalPrice: productClassification.promotionalPrice ? productClassification.promotionalPrice : 0

            })));

            setPromotionalPrice(product.promotionalPrice);
            setDisableSaveProduct(false);
            setDefaultValue(product);
          }
          setProduct(product);

        } else {
          // window.location.href = '/404'
        }
      });
    }
  }, []);

  useEffect(() => {
    if (name === '' || description === '' || images.length === 0 || selectedCategory.length === 0) {
      setDisableSaveProduct(true);
      return;
    }
    if (productVariants.length === 0) {
      if (price === 0 || inventory === 0) {
        setDisableSaveProduct(true);
        return;
      }
      setDisableSaveProduct(false);
    } else {
      if (productClassifications.length >= 0) {
        for (let i = 0; i < productClassifications.length; i++) {
          if (productClassifications[i].price === 0 || productClassifications[i].quantity === 0) {
            setDisableSaveProduct(true);
            return;
          }
        }
        setDisableSaveProduct(false);
      }
    }
  }, [name, description, images, selectedCategory, productVariants.length, price, inventory, productClassifications]);

  useEffect(() => {
    if (isModalCateOpen) {
      if (categories.length === 0) {
        dispatch(getChildsCategory(null)).unwrap().then((payload) => {
          if (payload.data.length === 0) {
            setCategories([])
          } else
            setCategories([{categories: [...payload.data], order: 1}]);
        });
      } else {
        const newData = categories.splice(0, 1)
        setCategories(newData);
      }
    }
  }, [isModalCateOpen]);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  async function createBlobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url);
    const data = await response.blob();
    return data;
  }

  const handleSearch = debounce(() => {
    if (isModalCateOpen) {
      if (searchText && searchText.length > 0) {
        dispatch(searchCategory({name: searchText})).unwrap().then((payload) => {
          setCategories([{categories: [...payload.data.data], order: 1}]);
        });
      } else {
        dispatch(getChildsCategory(null)).unwrap().then((payload) => {
          console.log(payload.data);
          if (payload.data.length === 0) {
            setCategories([])
          } else {
            setCategories([{categories: [...payload.data], order: 1}]);
          }
        });
      }
    }
  }, 500);

  const handleDrop = (acceptedFiles) => {
    setImages((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const handleRemove = (index) => {
    setImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAttributeChange = ({index, value}) => {
    setAttributeValues((prevAttributes) =>
        prevAttributes.map((attribute, i) =>
            i === index ? {...attribute, ["value"]: value} : attribute
        )
    );
  };

  const handleCategorySelect = (category, order) => {
    const newSelectedListCategory = [...selectedCategory];
    newSelectedListCategory.splice(order, newSelectedListCategory.length - order);
    setSelectedCategory([...newSelectedListCategory, {
      id: category.id,
      name: category.name,
      attributes: category.attributes
    }]);
    const newCategory = [...categories];
    newCategory.splice(order + 1, newCategory.length - order);
    dispatch(getChildsCategory(category.id)).unwrap().then((payload) => {
      if (payload.data.length !== 0) {
        setCategories([...newCategory, {categories: [...payload.data], order}]);
        setDisableButtonSaveCategory(true)
      } else {
        setCategories([...newCategory]);
        setDisableButtonSaveCategory(false);
      }
    });
  }

  const handleAddProductVariant = () => {
    if (productVariants.length >= 2) {
      return;
    }
    if (productVariants.length === 0) {
      setProductClassifications([{name: '0', quantity: 0, price: 0, promotionalPrice: 0, sku: ''}]);
    } else {
      const newProductClassification = [...productClassifications];
      newProductClassification.flatMap((item, index) => [item, {
        name:
            (index + 2).toString(),
        quantity: 0, price: 0, sku: ''
      }])
      setProductClassifications(newProductClassification);

    }
    setProductVariants([...productVariants, {
      name: '',
      options: [{value: '', file: new File([new Blob()], 'Upload', {type: 'image/png'})}]
    }]);
  }

  const handleProductVariantNameChange = (index: number, name: string) => {
    const newProductVariants = [...productVariants];
    newProductVariants[index].name = name;
    setProductVariants(newProductVariants);
  };

  const handleAddProductVariantValue = (index: number) => {
    const newProductVariants = [...productVariants];
    const newProductClassification = [...productClassifications];

    newProductVariants[index].options.push({
      value: '',
      file: new File([new Blob()], 'Upload', {type: 'image/png'})
    });
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
            quantity: 0, price: 0, sku: '', promotionalPrice: 0
          }
        });
        newProductClassification.push(...newClassification);
      }
    }
    if (index === 1) {
      newProductClassification.splice(newProductClassification.length, 0, {
        name:
            '',
        quantity: 0, price: 0, sku: '', promotionalPrice: 0
      });
      newProductClassification.splice((newProductVariants[index].options.length - 1), 0, {
        name:
            '',
        quantity: 0, price: 0, sku: '', promotionalPrice: 0
      });
    }
    setProductClassifications(newProductClassification);
    setProductVariants(newProductVariants);

  }

  const handleProductVariantValueChange = (index: number, valueIndex: number, value: string) => {
    const newProductVariants = [...productVariants];
    newProductVariants[index].options[valueIndex].value = value;
    setProductVariants(newProductVariants);
  };

  const handleRemoveProductVariant = (index: number) => {
    const newProductVariants = [...productVariants];
    newProductVariants.splice(index, 1);

    const newProductClassification = [...productClassifications];
    newProductClassification.splice(index * productVariants[index].options.length, productVariants[index].options.length);

    setProductClassifications(newProductClassification);
    setProductVariants(newProductVariants);
  };

  const handleRemoveProductVariantValue = (index: number, valueIndex: number) => {
    const newProductVariants = [...productVariants];
    const productVariant = newProductVariants[index];
    if (productVariant.options.length === 1) {
      return;
    }

    const newProductClassification = [...productClassifications];
    newProductClassification.splice(valueIndex, 1);
    if (productVariant.options.length === 2) {
      newProductClassification.splice(valueIndex + productVariants[index].options.length - 1, 1);
    }
    setProductClassifications(newProductClassification);

    productVariant.options.splice(valueIndex, 1);
    setProductVariants(newProductVariants);
  };

  const handleProductClassificationChange = (
      index: number,
      key: keyof ProductClassification,
      value: number | string
  ) => {
    console.log(value);
    const newProductClassification = [...productClassifications];
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
    setProductClassifications(newProductClassification);
  };

  const handleSaveCategoriesSelect = () => {
    if (disableButtonSaveCategory)
      return;
    setModalCateOpen(false);
    setAttributeValues(selectedCategory[selectedCategory.length - 1].attributes);
    setStep([...new Set([...step, 1, 2])]);
  }

  const handleSaveProduct = () => {

    const request: UpdateProductRequest = {
      id,
      name,
      description,
      promotionalPrice,
      price,
      categories: selectedCategory.map((category) => category.id),
      isPublished,
      quantity: inventory,
      detailsProduct: attributeValues.map((attribute) => ({
        name: attribute.name,
        value: attribute.value ? attribute.value : attribute.defaultValue ? attribute.defaultValue : 'Khong co',
      })),
      productVariants,
      productClassifications,
      imagesFile: images,
      defaultValue,
      originalFiles: fileOriginal
    }

    const loadingToastId = toast({
      title: 'Upadting product...',
      description: <Spinner/>,
      status: 'info',
      duration: null,
      isClosable: true,
      position: "top-right",
    })

    dispatch(updateProduct(request))
    .unwrap()
    .then((res) => {
      toast.close(loadingToastId)
      if (res.status.toString().includes("20")) {
        toast({
          title: 'Success!',
          description: "Update product success",
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: "top-right",
        })
        setTimeout(() => {
          navigate("/vendor/products");
        }, 2500)
      } else {
        toast({
          title: 'Error!',
          description: "Update product failed",
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: "top-right",
        })
      }
    })
  }

  return (
      <div>
        <Modal size={"6xl"} isOpen={isModalCateOpen} onClose={() => {
          setModalCateOpen(false);
          setSelectedCategory([])
        }} isCentered>
          <ModalOverlay/>
          <ModalContent height="4xl">
            <ModalHeader style={{
              fontWeight: 'bold',
              fontSize: '20px',
              color: 'gray.800',
              textAlign: "center",
              marginTop: '20px'
            }}>
              Chọn phân loại hàng
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <Box bgColor={"#f6f6f6"} p={2}>
                <FormControl mt={2} mb={4} w={"50%"}>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      {/* <Icon as={SearchIcon} color="gray.300" /> */}
                    </InputLeftElement>
                    <Input placeholder="Search" value={searchText}
                           onChange={(e) => setSearchText(e.target.value)}/>
                  </InputGroup>
                </FormControl>
                <FormControl p={2} bgColor={"white"}>
                  <Flex h="l" overflowX="auto" alignItems="stretch">
                    {isModalCateOpen && categories.length > 0 && categories.map((data, index) => (
                        <Flex key={index}>
                          <Flex
                              fontSize="md"
                              pl={2} pt={2}
                              flex="1"
                              minW="250px"
                              maxW="250px"
                              ml={2}
                          >
                            <VStack height="xl" spacing={2} alignItems="stretch">
                              {data.categories && data.categories.map((category) => (
                                  <Box
                                      key={category.id}
                                      cursor="pointer"
                                      onClick={() => handleCategorySelect(category, index)}
                                      fontWeight={selectedCategory.findIndex(x => x.id.includes(category.id)) !== -1 ? "bold" : ""}
                                      color={selectedCategory.findIndex(x => x.id.includes(category.id)) !== -1 ? "#ee4d2d" : "black"}
                                  >
                                    {category.name}
                                  </Box>
                              ))}
                            </VStack>
                          </Flex>
                          {data.order < data.length && (
                              <Divider orientation="vertical" width="1px" h="xl" bgColor="red.300"/>
                          )}
                        </Flex>
                    ))}
                  </Flex>
                </FormControl>

              </Box>
            </ModalBody>
            <ModalFooter>
              <Button variant={'ghost'} color="red" mr={3}
                      onClick={() => {
                        setModalCateOpen(false);
                        setSelectedCategory([])
                      }}
              >
                Đóng
              </Button>
              <Button variant={!disableButtonSaveCategory ? 'ghost' : 'unstyled'}
                      color={!disableButtonSaveCategory ? 'green' : 'gray.200'}
                      isDisabled={disableButtonSaveCategory}
                      onClick={handleSaveCategoriesSelect}
              >Lưu</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <DashboardPageHeader
            title="Add Product"
            iconName="delivery-box"
            button={
              <a href="/vendor/products">
                <Button color="primary" bg="primary.light" px="2rem">
                  Quay lại
                </Button>
              </a>
            }
        />
        <Box mt={8} mb={8}>
          <Accordion allowMultiple index={step}>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                  Thông tin cơ bản
                </Box>
              </AccordionButton>
              <AccordionPanel ml={2}>
                <FormControl isInvalid={isInvalid}>
                  <FormLabel fontWeight="bold" fontSize="sm" mt={2}>Tên</FormLabel>
                  <InputGroup>
                    <Input
                        name="name"
                        placeholder="Name"
                        value={name}
                        maxLength={maxLength}
                        onChange={handleChangeName}
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
                  <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Mô tả</FormLabel>
                  <CKEditor
                      editor={ClassicEditor}
                      data={description}
                      onChange={(event, editor) => {
                        setDescription(editor.getData());
                      }}
                      onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                      }}
                      onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                      }}
                  />
                </FormControl>

                <FormControl isInvalid={isInvalid}>
                  <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Danh mục</FormLabel>
                  <InputGroup>
                    <Input
                        placeholder="category"
                        value={selectedCategory.map((cate) => cate.name).join(' -> ')}
                        onChange={handleChangeName}
                        onClick={() => {
                          setModalCateOpen(true);
                          setSelectedCategory([]);
                          setDisableButtonSaveCategory(true);
                        }}
                        maxLength={maxLength}
                        pr="4rem"
                        cursor={'pointer'}
                        readOnly
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isInvalid={isInvalid}>
                  <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Hình ảnh</FormLabel>

                  <DropZone onChange={handleDrop}/>

                  {images.length > 0 && (
                      <div>
                        <FormLabel fontWeight="bold" fontSize="sm" mt={4}>Xem trước hình
                          ảnh</FormLabel>
                        <div className="image-preview-container">
                          {images.map((previewImage, index) => (
                              <div key={index} className="image-preview">
                                <Image src={URL.createObjectURL(previewImage)}
                                       boxSize='200px' mr={2}/>
                                <button className="remove-image-button" type="button"
                                        onClick={() => handleRemove(index)}>
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
                  <Switch onChange={() => {
                    setIsPublished(!isPublished)
                  }} id='email-alerts'/>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                  Thông tin chi tiết
                </Box>
              </AccordionButton>
              <AccordionPanel ml={2}>
                {attributeValues.length > 0 && (
                    <AttributeRenderForm attributes={attributeValues}
                                         onChange={handleAttributeChange}></AttributeRenderForm>
                )}
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl">
                  Phân loại hàng
                </Box>
              </AccordionButton>
              <AccordionPanel ml={2}>
                <div>
                  <Button
                      leftIcon={<AddIcon/>}
                      colorScheme="red"
                      variant="solid"
                      onClick={handleAddProductVariant}
                      isDisabled={productVariants.length >= 2}
                      _disabled={{bg: 'gray.500', cursor: 'not-allowed'}}

                  >
                    Thêm phân loại hàng
                  </Button>

                  {productVariants.length === 0 && (
                      <>
                        <FormControl mt={4} w="40%">
                          <FormLabel fontSize="sm" mb={2}>
                            Giá khuyến mãi
                          </FormLabel>
                          <Input
                              placeholder="Promotional Price"
                              type="number"
                              min="0"
                              value={promotionalPrice}
                              onChange={(event) => setPromotionalPrice(parseInt(event.target.value))}
                          />
                        </FormControl>
                        <FormControl mt={4} w="40%">
                          <FormLabel fontSize="sm" mb={2}>
                            Giá
                          </FormLabel>
                          <Input
                              placeholder="Price"
                              type="number"
                              min="0"
                              value={price}
                              onChange={(event) => setPrice(parseInt(event.target.value))}
                          />
                        </FormControl>

                        <FormControl mt={4} w="40%">
                          <FormLabel fontSize="sm" mb={2}>
                            Kho
                          </FormLabel>
                          <Input
                              placeholder="Storage"
                              type="number"
                              min="0"
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
                            Phân lọai hàng {index + 1}
                          </FormLabel>
                          <Button size="sm" variant="ghost" colorScheme="red"
                                  onClick={() => handleRemoveProductVariant(index)}>
                            <CloseIcon/>
                          </Button>
                        </Box>
                        <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap">
                          <FormControl w="50%" mb={4}>
                            <FormLabel fontSize="md" mb={0}>
                              Tên
                            </FormLabel>
                            <Input
                                borderColor='gray.600'
                                placeholder="Product Classification Name"
                                value={productVariant.name}
                                onChange={(event) => handleProductVariantNameChange(index, event.target.value)}
                            />
                          </FormControl>

                          <FormControl w="100%">
                            <FormLabel fontSize="md" mb={0}>
                              Giá trị
                            </FormLabel>
                            <Box mt={2}>
                              <Flex w="100%" alignItems="center" mb={2} flexWrap="wrap">
                                {productVariant.options.map((value, valueIndex) => (
                                    <InputGroup w="50%">
                                      <Input
                                          borderColor='gray.600'
                                          placeholder="Product Classification Value"
                                          value={value.value}
                                          mr={2}
                                          mb={2}
                                          onChange={(event) => handleProductVariantValueChange(index, valueIndex, event.target.value)}
                                      />
                                      <InputRightElement>
                                        <Button mr={4} size="sm" variant="ghost" colorScheme="red"
                                                onClick={() => handleRemoveProductVariantValue(index, valueIndex)}>
                                          <CloseIcon/>
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
                                    icon={<AddIcon/>}
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

                      }}>
                        <Thead h="100px">
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
                                  <Flex alignItems="center" justifyContent="space-between">
                                    {item.value}
                                    <IconButton
                                        aria-label="Upload file"
                                        icon={<AddIcon/>}
                                        onClick={() => {
                                          const fileInput = document.getElementById(`fileInput-${index}`);
                                          console.log(fileInput);
                                          if (fileInput) {
                                            fileInput.click();
                                          }
                                        }}
                                    >
                                    </IconButton>
                                  </Flex>

                                  <Flex alignItems="center" justifyContent="space-between">
                                    <Text mr={2}>
                                      {productVariants[0].options[index].file !== null ?
                                          productVariants[0].options[index].file.name : "Upload"}
                                    </Text>
                                    {productVariants[0].options[index].file !== null &&
                                        <IconButton
                                            aria-label="Remove file"
                                            icon={<CloseIcon boxSize={3} color="red.500"/>}
                                            bg="transparent"
                                            onClick={() => {
                                              const updatedOptions = [...productVariants[index].options];
                                              updatedOptions[index].file = new File([new Blob()], 'Upload');
                                              setProductVariants([
                                                {
                                                  ...productVariants[index],
                                                  options: updatedOptions,
                                                },
                                                ...productVariants.slice(1),
                                              ]);
                                            }}
                                        />
                                    }
                                  </Flex>
                                  <Input id={`fileInput-${index}`} type="file" display="none"
                                         accept="image/*,video/*,.gif"
                                         onChange={(event) => {
                                           const file = event.target.files?.[0];
                                           if (file) {
                                             const updatedOptions = [...productVariants[0].options];
                                             updatedOptions[index].file = event.target.files[0];
                                             const newProductVariants = [...productVariants];
                                             newProductVariants[0].options = updatedOptions;
                                             setProductVariants(newProductVariants);
                                           }
                                         }}/>
                                </Td>
                                {
                                    productVariants.length === 2 && (
                                        <>
                                          <Td style={{
                                            borderRight: "2px solid #ddd",
                                          }}>
                                            {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                                item !== null && item.value !== '' && (
                                                    <>
                                                      <Tr style={{
                                                        borderRight: "5px solid #ddd",
                                                      }} key={`classd2${valueIndex}`}>
                                                        <Input
                                                            value={item.value}
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
                                                item !== null && item.value !== '' && (
                                                    <Tr key={`price-unique${valueIndex}${index}`}>
                                                      <InputGroup>
                                                        <Input
                                                            placeholder="price"
                                                            type="number"
                                                            value={productClassifications[index * productVariants[productVariants.length - 1].options.length + valueIndex].price}
                                                            min="0"
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
                                                        <InputLeftElement width="50px" textAlign="center"
                                                                          mr={2}>
                                                          <Text fontSize="sm"
                                                                color={isInvalid ? 'red.500' : 'gray.500'}>
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
                                                item !== null && item.value !== '' && (
                                                    <Tr key={`pricePromotional-unique${valueIndex}${index}`}>
                                                      <InputGroup>
                                                        <Input
                                                            placeholder="Promotional Price"
                                                            type="number"
                                                            min="0"
                                                            value={productClassifications[index * productVariants[productVariants.length - 1].options.length + valueIndex].promotionalPrice}
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
                                                        <InputLeftElement width="50px" textAlign="center"
                                                                          mr={2}>
                                                          <Text fontSize="sm"
                                                                color={isInvalid ? 'red.500' : 'gray.500'}>
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
                                                item !== null && item.value !== '' && (
                                                    <Tr key={`quantity${valueIndex}${index}`}>
                                                      <NumberInput step={1} defaultValue={0} min={0} mb={2}
                                                                   value={productClassifications[index * productVariants[productVariants.length - 1].options.length + valueIndex].quantity}
                                                                   onChange={(value) =>
                                                                       handleProductClassificationChange(
                                                                           index * productVariants[productVariants.length - 1].options.length + valueIndex,
                                                                           'quantity',
                                                                           value
                                                                       )
                                                                   }>
                                                        <NumberInputField/>
                                                        <NumberInputStepper>
                                                          <NumberIncrementStepper/>
                                                          <NumberDecrementStepper/>
                                                        </NumberInputStepper>
                                                      </NumberInput>

                                                    </Tr>
                                                ))}
                                          </Td>
                                          <Td>
                                            {productVariants.length === 2 && productVariants[1].options.map((item, valueIndex) =>
                                                item !== null && item.value !== '' && (
                                                    <Tr key={`sku${valueIndex}${index}`}>
                                                      <Input
                                                          placeholder="sku"
                                                          value={productClassifications[index * productVariants[productVariants.length - 1].options.length + valueIndex].sku}
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
                                    item !== null && item.value !== '' && (
                                        <>
                                          <Td>
                                            <Tr key={`price${index}`}>
                                              <InputGroup>
                                                <Input
                                                    placeholder="price"
                                                    type="number"
                                                    min="0"
                                                    value={productClassifications[index].price}
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
                                                <InputLeftElement width="50px" textAlign="center"
                                                                  mr={2}>
                                                  <Text fontSize="sm"
                                                        color={isInvalid ? 'red.500' : 'gray.500'}>
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
                                                    min="0"
                                                    value={productClassifications[index].promotionalPrice}
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
                                                <InputLeftElement width="50px" textAlign="center"
                                                                  mr={2}>
                                                  <Text fontSize="sm"
                                                        color={isInvalid ? 'red.500' : 'gray.500'}>
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
                                                  min="0"
                                                  value={productClassifications[index].quantity}
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
                                                  value={productClassifications[index].sku}
                                                  onChange={(event) =>
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
                  onClick={handleSaveProduct}
                  isDisabled={disableSaveProduct}
              >
                Save
              </Button>
            </Flex>
          </Accordion>
        </Box>
      </div>
  );
};

export default ProductDetailVendor;
