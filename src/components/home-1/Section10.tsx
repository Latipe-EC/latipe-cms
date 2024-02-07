import LazyImage from "../LazyImage";
import React, { useEffect, useState } from "react";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../stores/store";
import { getChildsCategory } from "../../stores/slices/categories-slice";
import { CategoryResponse } from "../../api/interface/product";
import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from "pure-react-carousel";
import { Box, Button as ButtonChakra, Flex, Spacer, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Section10: React.FC = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const [categories, setCategories] = useState<CategoryResponse[]>([]);

	useEffect(() => {
		dispatch(getChildsCategory(null)).unwrap().then((res) => {
			return setCategories(res.data.filter(x => x.image));
		});

	}, []);

	const navigate = useNavigate();

	return (
		<Container mb="70px">
			<CategorySectionHeader
				title="Danh mục sản phẩm"
				iconName="categories"
			/>
			{categories.length > 0 && (
				<CarouselProvider
					naturalSlideWidth={100}
					naturalSlideHeight={20}
					totalSlides={Math.ceil(categories.length / 20)}
				>
					<Slider>
						{Array.from({ length: Math.ceil(categories.length / 20) }, (_, i) => (
							<Slide index={i} key={i}>
								<Grid container spacing={2}>
									{categories.slice(i * 20, i * 20 + 10).map((category) => (
										<Grid item xs={6} sm={1} key={category.id}
											style={{ width: '120px', height: '120px' }}
											onClick={() => navigate(`/search?category=${encodeURIComponent(category.name)}`)}
											alignItems="center"
											justifyContent="center"
										> <Box
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
												<LazyImage
													src={category.image ? category.image : '/assets/images/products/apple-watch-0.png'}
													alt="fashion"
													height="52px"
													width="52px"
													objectFit="contain"
													borderRadius={8}
												/>
											</Box>
											<Text textAlign={'center'} isTruncated>{category.name}</Text>
										</Grid>
									))}
								</Grid>
								<Grid container spacing={2}>
									{categories.slice(i * 20 + 10, i * 20 + 20).map((category) => (
										<Grid item xs={6} sm={1} key={category.id}
											style={{ width: '120px', height: '120px' }}
											onClick={() => navigate(`/search?category=${encodeURIComponent(category.name)}`)}
											alignItems="center"
											justifyContent="center"
										>
											<Box
												style={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
												}}>
												<LazyImage
													src={category.image ? category.image : '/assets/images/products/apple-watch-0.png'}
													alt="fashion"
													height="52px"
													width="52px"
													objectFit="contain"
													borderRadius={8}
												/></Box>
											<Text textAlign={'center'} isTruncated>{category.name}</Text>

										</Grid>
									))}
								</Grid>
							</Slide>
						))}
					</Slider>
					<Flex justifyContent="center" alignItems="center">
						<ButtonChakra as={ButtonBack} leftIcon={<ChevronLeftIcon />} colorScheme="teal"
							variant="outline">
						</ButtonChakra>
						<Spacer />
						<ButtonChakra as={ButtonNext} leftIcon={<ChevronRightIcon />} colorScheme="teal"
							variant="outline"></ButtonChakra>
					</Flex>

				</CarouselProvider>
			)}
		</Container>
	);
};

export default Section10;
