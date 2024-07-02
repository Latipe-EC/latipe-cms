import Card from "../Card";
import { Span } from "../Typography";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../Box";
import Icon from "../icon/Icon";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import StyledSearchBox from "./SearchBoxStyle";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { autoComplete } from "@stores/slices/search-slice";
import { useNavigate } from "react-router-dom";
import { Action, Content } from "@/utils/constants";
import { Button, Center, Heading, Image, Icon as IconCharkra, SimpleGrid, Text, VStack, Flex } from "@chakra-ui/react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { Api } from "@/api/AxiosClient";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";

export interface SearchBoxProps {
}

const Modal = styled.div`
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
`;

const SearchBox: React.FC<SearchBoxProps> = () => {
	const [resultList, setResultList] = useState([]);
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState("");
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [image, setImage] = useState(null);
	const [products, setProducts] = useState([]);
	const [searched, setSearched] = useState(false);
	const [loading, setLoading] = useState(false);

	const api = new Api();

	const search = debounce((e) => {
		const value = e.target?.value;

		dispatch(autoComplete({ keyword: value })).unwrap().then((res) => {
			return setResultList(res.data.productNames);
		});
	}, 200);

	const hanldeSearch = useCallback((event) => {
		setKeyword(event.target.value);
		event.persist();
		search(event);
	}, []);

	const handleDocumentClick = () => {
		setResultList([]);
	};

	useEffect(() => {
		window.addEventListener("click", handleDocumentClick);
		return () => {
			window.removeEventListener("click", handleDocumentClick);
		};
	}, []);

	const handleImageUpload = (event) => {
		setLoading(true);
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			setImage(reader.result);
			const file = event.target.files[0];
			api.SIE.search({ image_request: file }).then((res) => {
				setSearched(true);
				if (res.data.code === 200) {
					setProducts(res.data.data)
				} else {
					setProducts([])
				}
			}).finally(() => {
				setLoading(false);
			});
		};

		if (file) {
			reader.readAsDataURL(file);
		} else {
			setImage(null);
		}
	};

	return (
		<Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
			<LoadingOverlay isLoading={loading} />
			<StyledSearchBox>
				<Icon className="search-icon" size="18px">
					search
				</Icon>
				<TextField
					className="search-field"
					placeholder={Content.SEARCH_NOW}
					fullwidth
					onChange={hanldeSearch}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							navigate(`/search?keyword=${keyword}`)
						}
					}}
				/>
				<Icon className="camera" size="18px" onClick={() => {
					setImage(null)
					setProducts([])
					setSearched(false)
					setModalOpen(true)
				}}>
					camera
				</Icon>
			</StyledSearchBox>

			{modalOpen && (
				<Modal>
					<ModalContent>

						<VStack spacing={4} align="stretch">
							<Heading size="lg" textAlign="center" mb={4}>
								Sản phẩm tương tự
							</Heading>
							<button
								onClick={() => setModalOpen(false)}
								style={{
									position: 'absolute',
									top: '0.5rem',
									right: '0.5rem',
									background: 'transparent',
									border: 'none',
									cursor: 'pointer',
								}}
							>
								{/* This is a generic close icon using SVG. Replace it with any icon you prefer. */}
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
							<Button
								leftIcon={<IconCharkra as={FaPlus} />}
								onClick={() => document.getElementById('file-upload').click()}
								width="fit-content"
								alignSelf="center"
							>
								Chọn ảnh
								<input
									id="file-upload"
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									style={{ display: 'none' }}
								/>
							</Button>
							{image && (
								<Center>
									<Image src={image} alt="Preview" boxSize="200px" objectFit="cover" />
								</Center>
							)}

							{products.length > 0 ? (
								<SimpleGrid columns={{ sm: 2, md: 3, lg: 5 }} spacing={5}>
									{products.map((product) => (
										<Box
											key={product.id}
											p={4} // Adjusted padding for a tighter look
											shadow="xl" // Enhanced shadow for a deeper effect
											borderWidth="1px"
											borderColor="gray.200" // Added border color for a subtle definition
											borderRadius="lg"
											as="a"
											target="_blank"
											cursor="pointer"
											rel="noopener noreferrer"
											onClick={() => window.open(`/products/${product.product_id}`, '_blank')}
											_hover={{
												transform: 'scale(1.03)', // Slight scale up on hover for an interactive feel
												transition: 'all 0.2s ease-in-out', // Smooth transition for the hover effect
												shadow: '2xl', // Enhanced shadow on hover for depth
											}}
											overflow="hidden" // Ensures content does not overflow the rounded borders
										>
											<Image
												src={product.image_urls[0]}
												alt={product.product_name}
												width="100%" // Adjust width to fill the container
												height="auto" // Adjust height automatically to maintain aspect ratio
												objectFit="cover" // Ensure the image covers the space without distortion
												transition="transform 0.2s" // Smooth transition for the image
												_hover={{
													transform: 'scale(1.1)', // Slightly enlarges the image on hover
												}}
											/>
											<Text fontWeight="bold" mt={2} mb={2} textAlign="center" fontSize="sm">
												{product.product_name}
											</Text>
										</Box>
									))}
								</SimpleGrid>
							) : (
								searched && (
									<Text textAlign="center" mt={5}>
										Không tìm thấy sản phẩm tương tự nào
									</Text>
								)
							)}
						</VStack>
						<Flex justifyContent="end" mt={4}>
							<Button
								colorScheme="blue"
								onClick={() => setModalOpen(false)}
								width="fit-content"
								alignSelf="center"
							>
								{Action.CLOSE}
							</Button>
						</Flex>

					</ModalContent>
				</Modal>
			)}

			{!!resultList.length && (
				<Card
					position="absolute"
					top="100%"
					py="0.5rem"
					width="100%"
					boxShadow="large"
					zIndex={99}
				>
					{resultList.map((item) => (
						<a href={`/search?keyword=${item.name}`} key={item.name}>
							<MenuItem key={item}>
								<Span fontSize="14px">{item.name}</Span>
							</MenuItem>
						</a>
					))}
				</Card>
			)}
		</Box>
	);
};


export default SearchBox;
