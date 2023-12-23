import Accordion from "../accordion/Accordion";
import AccordionHeader from "../accordion/AccordionHeader";
import Card from "../Card";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import TextField from "../text-field/TextField";
import { H5, H6, Paragraph, SemiSpan } from "../Typography";
import { AppThunkDispatch, RootState, useAppSelector } from '../../store/store';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getChildsCategory } from "../../store/slices/categories-slice";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Tooltip } from "@chakra-ui/react";

const ProductFilterCard = () => {

	const categories = useAppSelector((state: RootState) => state.categories);
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const { keyword, category, sortType } = useParams();
	const [minPrice, setMinPrice] = useState<number>();
	const [maxPrice, setMaxPrice] = useState<number>();
	const [isValidRangePrice, setIsValidRangePrice] = useState<boolean>(false);
	useEffect(() => {
		if (categories.children.length === 0) {
			dispatch(getChildsCategory(null))
		}
	}, []);

	useEffect(() => {
		if (minPrice && maxPrice && minPrice >= 1000 && maxPrice >= 1000 && minPrice < maxPrice) {
			setIsValidRangePrice(true);
			return;
		}
		setIsValidRangePrice(false);
	}, [minPrice, maxPrice]);

	const handleSubmitRangePrice = () => {
		if (!isValidRangePrice) {
			return;
		}
		const query = `minPrice=${minPrice}&maxPrice=${maxPrice}${keyword ? `&keyword=${keyword}` : ''}${category ? `&category=${encodeURIComponent(category)}` : ''}${sortType ? `&sortType=${sortType}` : ''}`
		navigate(`/search?${query}`);
	}

	return (
		<Card p="18px 27px" elevation={5}>

			<H6 mb="16px">Khoảng giá</H6>
			<Box>
				<FlexBox justifyContent="space-between" alignItems="center">
					<TextField placeholder="0" type="number" fullwidth value={minPrice}
						onChange={(e) => {
							setMinPrice(parseInt(e.target.value));
						}} />
					<H5 color="text.muted" px="0.5rem">
						-
					</H5>
					<TextField placeholder="100000" type="number" fullwidth value={maxPrice}
						onChange={(e) => {
							setMaxPrice(parseInt(e.target.value));
						}} />
				</FlexBox>
				<Tooltip label="Giá phải trên 1000 và min price phải nhỏ hơn max price">
					<Button
						size="sm"
						mt={2}
						colorScheme="red"
						isDisabled={!isValidRangePrice}
						onClick={handleSubmitRangePrice}>Áp dụng</Button>
				</Tooltip>
			</Box>
			<Divider my="24px" />

			<H6 mb="10px">Danh mục</H6>
			{categories.children.map((item) =>
				item.subCategories ? (
					<Accordion key={item.name} expanded
					>
						<AccordionHeader
							px="0px"
							py="6px"
							color="text.muted"
							onClick={() => navigate(`/search?category=${encodeURIComponent(item.name)}`)}
						// justifyContent="flex-start"
						>
							<SemiSpan className="cursor-pointer" mr="9px">
								{item.name}
							</SemiSpan>
						</AccordionHeader>
					</Accordion>
				) : (
					<Paragraph
						onClick={() => navigate(`/search?category=${encodeURIComponent(item.name)}`)}
						className="cursor-pointer"
						fontSize="14px"
						color="text.muted"
						py="6px"
						key={item.name}
					>
						{item.name}
					</Paragraph>
				)
			)}

			<Divider my="24px" />
		</Card>
	);
};


export default ProductFilterCard;
