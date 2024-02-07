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
import Select from "@components/Select";
import Sidenav from "@components/sidenav/Sidenav";
import { H5, Paragraph } from "@components/Typography";
import { useCallback, useEffect, useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { searchProduct } from "@stores/slices/search-slice";
import { ProductListGetVm } from "../../../api/interface/search";
import { Center, Spinner } from "@chakra-ui/react";

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

	const [view, setView] = useState("grid");
	const [result, setResult] = useState<ProductListGetVm>();
	const [currentPage, setCurrentPage] = useState(parseInt(page ? page : "0"));
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
				setResult(res.data);
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

	const toggleView = useCallback(
		(v) => () => {
			setView(v);
		},
		[]
	);

	const handlePageChange = (data: number) => {
		setCurrentPage(data);
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
						<H5>Searching for “ {keyword} ”</H5>
						<Paragraph color="text.muted">{result.totalElements} kết quả tìm thấy</Paragraph>
					</div>)}
					<FlexBox alignItems="center" flexWrap="wrap">
						<Paragraph color="text.muted" mr="1rem">
							Short by:
						</Paragraph>
						<Box flex="1 1 0" mr="1.75rem" minWidth="150px">
							<Select
								onChange={(e) => {
									handleFilterChange(e);
								}}
								placeholder="Short by"
								defaultValue={sortOptions[0]}
								options={sortOptions}
							/>
						</Box>

						<Paragraph color="text.muted" mr="0.5rem">
							View:
						</Paragraph>
						<IconButton size="small" onClick={toggleView("grid")}>
							<Icon
								variant="small"
								defaultcolor="auto"
								color={view === "grid" ? "primary" : "inherit"}
							>
								grid
							</Icon>
						</IconButton>
						<IconButton size="small" onClick={toggleView("list")}>
							<Icon
								variant="small"
								defaultcolor="auto"
								color={view === "list" ? "primary" : "inherit"}
							>
								menu
							</Icon>
						</IconButton>

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

					{result && !isLoading ? (<Grid item lg={9} xs={12}>
						{view === "grid" ? <ProductCard1List
							data={result} onChange={handlePageChange} /> :
							<ProductCard9List data={result}
								onChange={handlePageChange} />}
					</Grid>) : (
						<Center position="fixed" top="0" right="0" bottom="0" left="0" zIndex="9999">
							<Spinner size="xl" />
						</Center>)}
				</Grid>
			</Box>}
		</>
	)

};

const sortOptions = [
	{ label: "Relevance", value: "Relevance" },
	{ label: "Date", value: "Date" },
	{ label: "Price Low to High", value: "Price Low to High" },
	{ label: "Price High to Low", value: "Price High to Low" },
];
export default ProductSearchResult;
