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
	FormHelperText,
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
import {
	Select as ChakraReactSelect,
} from "chakra-react-select";
import DropZone from "@components/DropZone";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import './index.css'
import { useEffect, useState } from "react";
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
	Options,
	ProductClassification,
	ProductResponse,
	ProductVariant,
	UpdateProductRequest
} from "@interfaces/product";
import AttributeRenderForm from "@components/attribute/AttributeRenderForm";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { getChildsCategory, searchCategory } from "@stores/slices/categories-slice";
import { AppThunkDispatch } from "@stores/store";
import { getProductById, updateProduct } from "@stores/slices/products-slice";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { handleApiCallWithToast, parseNumericValue, truncateFilename } from "../../../utils/utils";
import { Path, ContentToast, TitleToast } from "@/utils/constants";
import { LoginResponse } from "@/api/interface/auth";


const ProductDetailVendor = () => {


	const [isPublished, setIsPublished] = useState(true);
	const [images, setImages] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState("0");
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
	const [promotionalPrice, setPromotionalPrice] = useState("0");
	const [disableSaveProduct, setDisableSaveProduct] = useState(true);
	const [fileOriginal, setFileOriginal] = useState([]);
	const dispatch = useDispatch<AppThunkDispatch>();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const maxLength = 210;
	const isInvalid = name.length > maxLength;
	const [defaultValue, setDefaultValue] = useState<ProductResponse>();
	const [featuresImage, setFeaturesImage] = useState([]);



	useEffect(() => {
		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
		if (!REACT_STARTER_AUTH) {
			navigate("/login");
			return;
		}
		if (REACT_STARTER_AUTH.role !== "VENDOR") {
			navigate("/require-register-vendor");
			return;
		}

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
						setPrice(parseInt(product.price).toLocaleString('vi-VN'))
						setPromotionalPrice(parseInt(product.promotionalPrice).toLocaleString('vi-VN'))
						setInventory(product.quantity);
						setIsPublished(product.isPublished);
						setImages(blobs == null ? [] : blobs);
						setSelectedCategory(product.categories);
						setAttributeValues(product.detailsProduct);
						if (product.indexFeatures) {
							setFeaturesImage(product.indexFeatures);
						}
						blobs = [];
						if (product.productVariants.length > 0) {
							urls = product.productVariants[0].options.map(x => x.image);
							for (let i = 0; i < urls.length; i++) {
								const blob = await createBlobFromUrl(urls[i])
								listFile.push({
									url: urls[i],
									file: blob
								})
								blobs.push(blob);
							}
							setFileOriginal(listFile);
						}

						setProductVariants([...product.productVariants.map((productVariant, index) => {
							return {
								...productVariant,
								options: productVariant.options.map((option: Options) => ({
									value: option.value,
									image: option.image,
									file: blobs[index] != null ? blobs[index] : new File([new Blob()], 'Upload', { type: 'image/png' })
								}))
							}
						})]);

						setProductClassifications(product.productClassifications.map((productClassification) => ({
							...productClassification,
							promotionalPrice: productClassification.promotionalPrice ? productClassification.promotionalPrice : 0

						})));
						setDisableSaveProduct(false);
						setDefaultValue(product);
					}
					setProduct(product);

				} else {
					window.location.href = '/404'
				}
			});
		}

		return () => {
		};
	}, []);

	useEffect(() => {
		if (name === '' || description === '' || images.length === 0 || selectedCategory.length === 0) {
			setDisableSaveProduct(true);
			return;
		}
		if (productVariants.length === 0) {
			if (parseNumericValue(price) === 0 || inventory === 0) {
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
						setCategories([{ categories: [...payload.data], order: 1 }]);
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
				dispatch(searchCategory({ name: searchText })).unwrap().then((payload) => {
					setCategories([{ categories: [...payload.data.data], order: 1 }]);
				});
			} else {
				dispatch(getChildsCategory(null)).unwrap().then((payload) => {
					console.log(payload.data);
					if (payload.data.length === 0) {
						setCategories([])
					} else {
						setCategories([{ categories: [...payload.data], order: 1 }]);
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

	const handleAttributeChange = ({ index, value }) => {
		setAttributeValues((prevAttributes) =>
			prevAttributes.map((attribute, i) =>
				i === index ? { ...attribute, ["value"]: value } : attribute
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
				setCategories([...newCategory, { categories: [...payload.data], order }]);
				setDisableButtonSaveCategory(true)
			} else {
				setCategories([...newCategory]);
				setDisableButtonSaveCategory(false);
			}
		});
	}

	const handleProductVariantNameChange = (index: number, name: string) => {
		const newProductVariants = [...productVariants];
		newProductVariants[index].name = name;
		setProductVariants(newProductVariants);
	};

	const handleAddProductVariant = () => {
		if (productVariants.length >= 2) {
			return;
		}

		let newProductClassifications = [...productClassifications];

		if (productVariants.length === 0) {
			newProductClassifications = [{ quantity: 0, price: 0, promotionalPrice: 0, sku: '' }];
		}

		setProductClassifications(newProductClassifications);

		const newProductVariant = {
			name: '',
			options: [{ value: '', file: new File([new Blob()], 'Upload', { type: 'image/png' }) }]
		};

		setProductVariants([...productVariants, newProductVariant]);
	}

	const handleAddProductVariantValue = (index: number) => {
		const newProductVariants = [...productVariants];
		const lenVarFirst = productVariants.length === 2 ? productVariants[1].options.length : 0;

		const newOption = {
			value: '',
			file: new File([new Blob()], 'Upload', { type: 'image/png' })
		};

		newProductVariants[index].options.push(newOption);

		const newClassification = {
			quantity: 0,
			price: 0,
			sku: '',
			promotionalPrice: 0
		};

		if (index === 0) {
			if (newProductVariants.length === 1) {
				setProductClassifications([...productClassifications, { ...newClassification }]);
			} else {
				const classifications = newProductVariants[1].options.map(() => { return { ...newClassification } });
				setProductClassifications([...productClassifications, ...classifications]);
			}
		}

		else if (index === 1) {
			console.log("lenVarFirst: ", lenVarFirst);
			let count = 0;
			const newProductClassification = []
			for (let i = 0; i < productClassifications.length; i++) {
				if (count === lenVarFirst) {
					newProductClassification.push({ ...newClassification });
					count = 0;
				}
				newProductClassification.push({ ...productClassifications[i] });
				count++;
			}
			newProductClassification.push({ ...newClassification });
			setProductClassifications(newProductClassification);
		}

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

		if (newProductVariants[index].options.length === 1) {
			return;
		}

		if (index === 0) {
			const newProductClassification = [...productClassifications];
			if (productVariants.length === 1)
				newProductClassification.splice(valueIndex, 1);
			else {
				newProductClassification.splice(valueIndex * productVariants[1].options.length, productVariants[1].options.length);
			}
			setProductClassifications(newProductClassification);

		} else {
			const newProductClassification = [];
			const lenVarFirst = productVariants[1].options.length;
			let count = valueIndex;
			for (let i = 0; i < productClassifications.length; i++) {
				if (i !== count) {
					newProductClassification.push({ ...productClassifications[i] });
				} else {
					count += lenVarFirst;
				}
			}
			setProductClassifications(newProductClassification);
		}

		newProductVariants[index] = {
			...productVariants[index],
			options: newProductVariants[index].options.filter((_, i) => i !== valueIndex)
		};

		setProductVariants(newProductVariants);
	};

	const handleProductClassificationChange = (
		index: number,
		key: keyof ProductClassification,
		value: number | string
	) => {
		const newProductClassification = [...productClassifications];
		switch (key) {
			case 'price':
				newProductClassification[index][key as 'price'] = value;
				break;
			case 'quantity':
				newProductClassification[index][key as 'quantity'] = value as number;
				break;
			case 'promotionalPrice':
				newProductClassification[index][key as 'promotionalPrice'] = value;
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
			promotionalPrice: parseNumericValue(promotionalPrice),
			price: parseNumericValue(price),
			indexFeatures: featuresImage,
			categories: selectedCategory.map((category) => category.id),
			isPublished,
			quantity: inventory,
			detailsProduct: attributeValues.map((attribute) => ({
				name: attribute.name,
				value: attribute.value ? attribute.value : attribute.defaultValue ? attribute.defaultValue : 'Khong co',
			})),
			productVariants,
			productClassifications: productClassifications.map((item) => ({
				...item,
				price: parseNumericValue(item.price),
				promotionalPrice: parseNumericValue(item.promotionalPrice),
			})),
			imagesFile: images,
			defaultValue,
			originalFiles: fileOriginal
		}

		handleApiCallWithToast(dispatch,
			updateProduct,
			request,
			Path.VENDOR_PRODUCT,
			TitleToast.UPDATE_PRODUCT,
			TitleToast.SUCCESS,
			ContentToast.UPDATE_PRODUCT_SUCCESS,
			TitleToast.ERROR,
			ContentToast.UPDATE_PRODUCT_ERROR,
			navigate,
			toast,
			<Spinner />)

	}

	return (
		<Box py={4}>
			<Modal size={"6xl"} isOpen={isModalCateOpen} onClose={() => {
				setModalCateOpen(false);
				setSelectedCategory([])
			}} isCentered>
				<ModalOverlay />
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
					<ModalCloseButton />
					<ModalBody>
						<Box bgColor={"#f6f6f6"} p={2}>
							<FormControl mt={2} mb={4} w={"50%"}>
								<InputGroup size="md">
									<InputLeftElement pointerEvents="none">
										{/* <Icon as={SearchIcon} color="gray.300" /> */}
									</InputLeftElement>
									<Input placeholder="Tìm kiếm" value={searchText}
										onChange={(e) => setSearchText(e.target.value)} />
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
												<Divider orientation="vertical" width="1px" h="xl" bgColor="red.300" />
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
				title="Chi tiết sản phẩm"
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
										placeholder="Tên"
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
									onChange={(_, editor) => {
										setDescription(editor.getData());
									}}
									onBlur={(editor) => {
										console.log('Blur.', editor);
									}}
									onFocus={(editor) => {
										console.log('Focus.', editor);
									}}
								/>
							</FormControl>

							<FormControl isInvalid={isInvalid}>
								<FormLabel fontWeight="bold" fontSize="sm" mt={4}>Danh mục</FormLabel>
								<InputGroup>
									<Input
										placeholder="Danh mục"
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

								<DropZone onChange={handleDrop} />

								{images.length > 0 && (
									<div>
										<FormLabel fontWeight="bold" fontSize="sm" mt={4}>Xem trước hình
											ảnh</FormLabel>
										<div className="image-preview-container">
											{images.map((previewImage, index) => (
												<div key={index} className="image-preview">
													<Image src={URL.createObjectURL(previewImage)}
														boxSize='200px' mr={2} />
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
								<FormLabel fontWeight="bold" fontSize="sm" mt={4}>Chọn ảnh đặc trưng</FormLabel>

								<FormHelperText>Chọn tối đa 2 ảnh. Trong trường hợp có 1 ảnh trở lên, phải chọn 2 ảnh.</FormHelperText>
								{images && images.length > 0 && (
									<ChakraReactSelect
										isMulti
										menuPortalTarget={document.body} // Render the dropdown menu within a portal targeting the body
										styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} // Adjust z-index as needed
										value={featuresImage.map(value => ({ label: `Ảnh ${parseInt(value, 10) + 1}`, value: value.toString() }))}
										options={images.map((_, index) => ({
											label: `Ảnh ${index + 1}`,
											value: index,
										}))}
										onChange={(selectedOptions) => {
											let value = selectedOptions.map(option => option.value);

											// If more than one image is available
											if (images.length > 1) {
												// Enforce selection of exactly two images if more than one image is available
												if (value.length > 2) {
													value = value.slice(0, 2); // Keep only the first two selections
												} else if (value.length < 2) {
													// Optionally, handle the case where less than two images are selected
													// e.g., show a message to the user
												}
											}
											// If only one image is available, the logic above allows any selection,
											// which effectively means the user can only select one image.

											console.log(value);
											setFeaturesImage(value);
										}}
									/>
								)}

							</FormControl>

							<FormControl isInvalid={isInvalid}>
								<FormLabel fontWeight="bold" fontSize="sm" mt={4}>Public</FormLabel>
								<Switch isChecked={isPublished} onChange={() => {
									setIsPublished(!isPublished)
								}} id='email-alerts' />
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
							<Box>
								<Button
									leftIcon={<AddIcon />}
									colorScheme="red"
									variant="solid"
									onClick={handleAddProductVariant}
									isDisabled={productVariants.length >= 2}
									_disabled={{ bg: 'gray.500', cursor: 'not-allowed' }}

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
												placeholder="Giá khuyến mãi"
												type="number"
												min="0"
												value={promotionalPrice}
												onChange={(event) => {
													let { value } = event.target;
													// Remove all periods from the input value
													value = value.replace(/\./g, '');
													const pattern = /^[0-9]+$/; if (pattern.test(value) || value === '') {
														setPromotionalPrice(parseInt(value).toLocaleString('vi-VN'))
													}
												}}
											/>
										</FormControl>
										<FormControl mt={4} w="40%">
											<FormLabel fontSize="sm" mb={2}>
												Giá
											</FormLabel>
											<Input
												placeholder="Giá"
												type="number"
												min="0"
												value={price}
												onChange={(event) => {
													let { value } = event.target;
													// Remove all periods from the input value
													value = value.replace(/\./g, '');
													const pattern = /^[0-9]+$/; if (pattern.test(value) || value === '') {
														setPrice(parseInt(value).toLocaleString('vi-VN'))
													}
												}}
											/>
										</FormControl>

										<FormControl mt={4} w="40%">
											<FormLabel fontSize="sm" mb={2}>
												Kho
											</FormLabel>
											<Input
												placeholder="Kho hàng"
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
												<CloseIcon />
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

								{/* // Table product classification */}
								{productVariants.length > 0 && (
									<Table mt={8} variant="striped"
									>
										<Thead h="100px">
											<Tr>
												<Th
													bg="green.200"
													borderBottom="1px"
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
														borderBottom="1px"
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
													borderBottom="1px"
													borderColor="gray.300"
													fontWeight="bold"
													textTransform="uppercase"
													letterSpacing="wide"
													fontSize="sm"
													py="2"
													textAlign="center"
												>
													Giá
												</Th>
												<Th
													bg="green.200"
													borderBottom="1px"
													borderColor="gray.300"
													fontWeight="bold"
													textTransform="uppercase"
													letterSpacing="wide"
													fontSize="sm"
													py="2"
													textAlign="center"
												>
													Giá khuyến mãi
												</Th>
												<Th
													bg="green.200"
													borderBottom="1px"
													borderColor="gray.300"
													fontWeight="bold"
													textTransform="uppercase"
													letterSpacing="wide"
													fontSize="sm"
													py="2"
													textAlign="center"
												>
													Kho
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
															{item.value.length > 10 ? item.value.substring(0, 10) + '...' : item.value}
															<IconButton
																aria-label="Upload file"
																icon={<AddIcon />}
																onClick={() => {
																	const fileInput = document.getElementById(`fileInput-${index}`);
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
																	truncateFilename(productVariants[0].options[index].file, 3) : "Upload"}
															</Text>
															{productVariants[0].options[index].file !== null &&
																<IconButton
																	aria-label="Remove file"
																	icon={<CloseIcon boxSize={3} color="red.500" />}
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
															}} />
													</Td>
													{productVariants.length === 2
														&& productVariants[0].options.length * productVariants[1].options.length === productClassifications.length && (
															<>
																<Td style={{
																	borderRight: "2px solid #ddd",
																}}>
																	{productVariants[1].options.map((item, valueIndex) =>
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
																	{productVariants[1].options.map((item, valueIndex) =>
																		item !== null && item.value !== '' && (
																			<Tr key={`price-unique${valueIndex}${index}`}>
																				<InputGroup>
																					<Input
																						placeholder="Giá"
																						type="text"
																						value={productClassifications[index * productVariants[productVariants.length - 1].options.length + valueIndex].price}
																						min="0"
																						onChange={(event) => {
																							let { value } = event.target;
																							// Remove all periods from the input value
																							value = value.replace(/\./g, '');

																							const pattern = /^[0-9]+$/;
																							if (pattern.test(value) || value === '') { // Allow the value if it matches the pattern or is an empty string
																								handleProductClassificationChange(
																									index * productVariants[1].options.length + valueIndex,
																									'price',
																									parseInt(value).toLocaleString('vi-VN')
																								);
																							}
																						}}
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
																	{productVariants[1].options.map((item, valueIndex) =>
																		item !== null && item.value !== '' && (
																			<Tr key={`pricePromotional-unique${valueIndex}${index}`}>
																				<InputGroup>
																					<Input
																						placeholder="Giá khuyến mãi"
																						type="text"
																						min="0"
																						value={productClassifications[index * productVariants[productVariants.length - 1].options.length + valueIndex].promotionalPrice}
																						onChange={(event) => {
																							let { value } = event.target;
																							// Remove all periods from the input value
																							value = value.replace(/\./g, '');

																							const pattern = /^[0-9]+$/;
																							if (pattern.test(value) || value === '') {
																								handleProductClassificationChange(
																									index * productVariants[1].options.length + valueIndex,
																									'promotionalPrice',
																									parseInt(value).toLocaleString('vi-VN')
																								);
																							}
																						}}
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
																	{productVariants[1].options.map((item, valueIndex) =>
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
																					<NumberInputField />
																					<NumberInputStepper>
																						<NumberIncrementStepper />
																						<NumberDecrementStepper />
																					</NumberInputStepper>
																				</NumberInput>

																			</Tr>
																		))}
																</Td>
																<Td>
																	{productVariants[1].options.map((item, valueIndex) =>
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
														productVariants.length === 1 && productVariants[0].options.length === productClassifications.length &&
														item !== null && item.value !== '' && (
															<>
																<Td>
																	<Tr key={`price${index}`}>
																		<InputGroup>
																			<Input
																				placeholder="Giá"
																				type="text"
																				min="0"
																				value={productClassifications[index].price}
																				onChange={(event) => {
																					let { value } = event.target;
																					// Remove all periods from the input value
																					value = value.replace(/\./g, '');
																					const pattern = /^[0-9]+$/;

																					if (pattern.test(value) || value === '') { // Allow the value if it matches the pattern or is an empty string
																						handleProductClassificationChange(
																							index,
																							'price',
																							parseInt(value).toLocaleString('vi-VN')
																						);
																					}
																				}}
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
																				placeholder="Giá"
																				type="number"
																				min="0"
																				value={productClassifications[index].promotionalPrice}
																				onChange={(event) => {
																					let { value } = event.target;
																					// Remove all periods from the input value
																					value = value.replace(/\./g, '');

																					const pattern = /^[0-9]+$/;
																					if (pattern.test(value) || value === '') { // Allow the value if it matches the pattern or is an empty string
																						handleProductClassificationChange(
																							index,
																							'promotionalPrice',
																							parseInt(value).toLocaleString('vi-VN')
																						);
																					}
																				}}
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
																			placeholder="kho"
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
							</Box>
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
							Lưu
						</Button>
					</Flex>
				</Accordion>
			</Box>
		</Box>
	);
};

export default ProductDetailVendor;
