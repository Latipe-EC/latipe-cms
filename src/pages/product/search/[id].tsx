import Box from "@components/Box";
import IconButton from "@components/buttons/IconButton";
import Card from "@components/Card";
import FlexBox from "@components/FlexBox";
import Grid from "@components/grid/Grid";
import Hidden from "@components/hidden/Hidden";
import Icon from "@components/icon/Icon";
import ProductCard1List from "@components/products/ProductCard1List";
import ProductCard9List from "@components/products/ProductCard9List";
import ProductFilterCard from "@components/products/ProductFilterCard";
import Sidenav from "@components/sidenav/Sidenav";
import { H5, Paragraph } from "@components/Typography";
import { useEffect, useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { searchProduct } from "@stores/slices/search-slice";
import { ProductListGetVm } from "../../../api/interface/search";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { Content } from "@/utils/constants";
import { Select } from "chakra-react-select";

const ProductSearchResult = () => {
	const dispatch = useDispatch<AppThunkDispatch>();

	const location = useLocation();

	const params = new URLSearchParams(location.search);
	const minPrice = params.get('minPrice');
	const maxPrice = params.get('maxPrice');
	const page = params.get('page');
	const pageSize = params.get('pageSize');
	const category = params.get('category');
	const keyword = params.get('keyword');
	const sortType = params.get('sortType');

	const [view] = useState("grid");
	const [result, setResult] = useState<ProductListGetVm>();
	const [currentPage, setCurrentPage] = useState(parseInt(page ? (parseInt(page) - 1).toString() : "0"));
	const [sortTypeState, setSortTypeState] = useState(sortType);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const keyword = params.get('keyword') ? params.get('keyword') : "";
		const category = params.get('category') || "";
		const minPrice = params.get('minPrice') || "";
		const maxPrice = params.get('maxPrice') || "";

		dispatch(searchProduct(
			{
				keyword,
				category: category,
				sortType: sortTypeState,
				page: currentPage,
				size: 12,
				minPrice,
				maxPrice
			})).unwrap().then((res) => {
				console.log(!res.data.error);
				if (!res.data.error) {
					setResult(res.data);
				}
				setIsLoading(false);
				return;
			});
	}, [location, currentPage, sortTypeState]);

	useEffect(() => {
		setIsLoading(true);
		dispatch(searchProduct(
			{
				keyword: keyword,
				category: category,
				sortType: sortTypeState,
				page: currentPage,
				size: pageSize,
				minPrice,
				maxPrice
			})).unwrap().then((res) => {
				setResult(res.data);
				setIsLoading(false);
				return;
			});
	}, []);

	const size = useWindowSize();
	const isTablet = size.width < 1025;

	const handlePageChange = (data: number) => {
		setCurrentPage(data);
		window.scrollTo(0, 0);
	};

	const handleFilterChange = (data) => {
		switch (data.value) {
			case "Date": {
				setSortTypeState("DEFAULT");
				break;
			}
			case "Price Low to High": {
				setSortTypeState("PRICE_ASC");
				break;
			}
			case "Price High to Low": {
				setSortTypeState("PRICE_DESC");
				break;
			}
			case "Relevance": {
				setSortTypeState("COUNT_SALE_DESC");
				break;
			}
		}
	}

	return (
		<>
			{result && <Box pt="20px">
				<FlexBox
					p="1.25rem"
					flexWrap="wrap"
					justifyContent="space-between"
					alignItems="center"
					mb="55px"
					elevation={5}
					as={Card}
				>
					{keyword && (<div>
						<H5>Tìm kiếm cho “ {keyword} ”</H5>
						<Paragraph color="text.muted">{result.totalElements} kết quả tìm thấy</Paragraph>
					</div>)}
					<FlexBox alignItems="center" flexWrap="wrap">
						<Paragraph color="text.muted" mr="1rem">
							Sắp xếp:
						</Paragraph>
						<Box flex="1 1 0" mr="1.75rem" minWidth="150px">
							<Select
								onChange={(e) => {
									handleFilterChange(e);
								}}
								placeholder="Sắp xếp"
								defaultValue={sortOptions[0]}
								options={sortOptions}
							/>
						</Box>

						{isTablet && (
							<Sidenav
								position="left"
								scroll={true}
								handle={
									<IconButton size="small">
										<Icon>options</Icon>
									</IconButton>
								}
							>
								<ProductFilterCard
								/>
							</Sidenav>
						)}
					</FlexBox>
				</FlexBox>

				<Grid container spacing={6}>
					<Hidden as={Grid} item lg={3} xs={12} down={1024}>
						<ProductFilterCard />
					</Hidden>

					{result && result.products && result.products.length > 0 && !isLoading ? (
						<Grid item lg={9} xs={12}>
							{view === "grid" ?
								<ProductCard1List forgePage={currentPage} data={result} onChange={handlePageChange} /> :
								<ProductCard9List forgePage={currentPage} data={result} onChange={handlePageChange} />
							}
						</Grid>
					) : result && (!result.products || result.products.length === 0) ? (
						<Box display="flex" justifyContent="center" alignItems="center" height="100%">
							<Text fontSize="xl" fontWeight="bold" textAlign="center" my={5}>
								{Content.PRODUCT_NOT_FOUND}
							</Text>
						</Box>
					) : (
						<Center position="fixed" top="0" right="0" bottom="0" left="0" zIndex="9999">
							<Spinner size="xl" />
						</Center>
					)}
				</Grid>
			</Box>}
		</>
	)

};

const sortOptions = [
	{ label: "Liên quan", value: "Relevance" },
	{ label: "Ngày mới nhất", value: "Date" },
	{ label: "Giá thấp đến cao", value: "Price Low to High" },
	{ label: "Giá cao đến thấp", value: "Price High to Low" },
];
export default ProductSearchResult;
