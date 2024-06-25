import { useDispatch } from "react-redux";
import Grid from "@components/grid/Grid";
import NavbarLayout from "@components/layout/NavbarLayout";
import ShopIntroCard from "@components/shop/ShopIntroCard";
import { AppThunkDispatch } from "@stores/store";
import { useEffect, useState } from "react";
import { getProductStore, getStoreById } from "@stores/slices/stores-slice";
import { PagedResultResponse } from "../../api/interface/PagedResultResponse";
import { ProductStoreResponse, StoreResponse } from "../../api/interface/store";
import StoreProductListCard from "@components/products/StoreProductCardList";
import { useParams } from "react-router-dom";
import { Box, Code, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import { CopyIcon, InfoIcon } from "@chakra-ui/icons";
import { VoucherModal } from "@/pages/shop/VoucherModal";

const Shop = () => {

	const dispatch = useDispatch<AppThunkDispatch>();
	const [result, setResult] = useState<PagedResultResponse<ProductStoreResponse>>();
	const [currentPage, setCurrentPage] = useState(0);
	const [profileStore, setProfileStore] = useState<StoreResponse>(null);
	const [vouchers, setVouchers] = useState([]);
	const { id } = useParams<{ id: string }>();
	const toast = useToast();
	const [showModalVoucher, setShowModalVoucher] = useState(false);
	const [selectedVoucher, setSelectedVoucher] = useState(null);

	useEffect(() => {
		setVouchers([
			{
				voucher_code: "VOUCHER1",
				detail: "Chi tiết voucher 1",
				stated_time: "2022-01-01",
				ended_time: "2022-12-31",
				voucher_require: {
					min_require: 100000,
					max_voucher_per_user: 5,
				},
				discount_data: {
					discount_type: 0, // FIXED_DISCOUNT
					discount_value: 50000,
				},
			},
			{
				voucher_code: "VOUCHER2",
				detail: "Chi tiết voucher 2",
				stated_time: "2022-01-01",
				ended_time: "2022-12-31",
				voucher_require: {
					min_require: 200000,
					max_voucher_per_user: 3,
				},
				discount_data: {
					discount_type: 1, // PERCENT_DISCOUNT
					discount_percent: 10,
					maximum_value: 50000,
				},
			},
			{
				voucher_code: "VOUCHER3",
				detail: "Chi tiết voucher 3",
				stated_time: "2022-01-01",
				ended_time: "2022-12-31",
				voucher_require: {
					min_require: 300000,
					max_voucher_per_user: 2,
				},
				discount_data: {
					discount_type: 1, // PERCENT_DISCOUNT
					discount_percent: 20,
					maximum_value: 100000,
				},
			},
		])
		// dispatch(getV(
		// 	{
		// 		id,
		// 		params: {
		// 			skip: 0,
		// 			limit: 12,
		// 		}
		// 	})).unwrap().then((res) => {
		// 		if (res.status.toString().startsWith('2')) {
		// 			setResult(res.data);
		// 			return;
		// 		}

		// 	});
		// dispatch(getStoreById(id)).unwrap().then((res) => {
		// 	if (res.status.toString().startsWith('2')) {
		// 		setProfileStore(res.data);
		// 		return;
		// 	}

		// });
	}, []);

	useEffect(() => {
		dispatch(getProductStore(
			{
				id,
				params: {
					skip: currentPage * 12,
					limit: 12,
				}
			})).unwrap().then((res) => {
				if (res.status.toString().startsWith('2')) {
					setResult(res.data);
					return;
				}

			});
		dispatch(getStoreById(id)).unwrap().then((res) => {
			if (res.status.toString().startsWith('2')) {
				setProfileStore(res.data);
				return;
			}

		});
	}, [currentPage]);

	const handlePageChange = (data: number) => {
		setCurrentPage(data);
		window.scrollTo(0, 0);
	};

	return (
		<div>
			{profileStore &&
				<ShopIntroCard store={profileStore} />}

			<Grid container spacing={6}>
				<Grid item md={12} xs={12}>
					{vouchers.length > 0 && (
						<Box border="1px" borderColor="gray.200" borderRadius="md" p="4" boxShadow="lg">
							<Text fontSize="2xl" mb="4" fontWeight="bold" color="teal.500">Khuyến mãi của shop</Text>
							<Flex overflowX="auto">
								{vouchers.map((voucher) => (
									<Box minW='300px' key={voucher.id} mb="2" border="1px" borderColor="gray.200" borderRadius="md" p="4" width="300px" mr="2" boxShadow="md" bg="white">
										<Flex justifyContent="space-between" alignItems="center">
											<Text
												mb="2"
												fontSize="lg"
												fontWeight="semibold"
												_hover={{ textDecoration: "underline", cursor: "pointer" }}
												onClick={() => {
													navigator.clipboard.writeText(voucher.voucher_code);
													toast({
														title: "Copy mã thành công",
														status: "success",
														duration: 1000,
														isClosable: true,
														position: "top-right",
													});
												}}
											>
												{voucher.detail}
											</Text>
											<IconButton
												size="sm"
												aria-label="Copy code"
												icon={<CopyIcon />}
												colorScheme="teal"
												onClick={() => {
													navigator.clipboard.writeText(voucher.voucher_code);
													toast({
														title: "Copy mã thành công",
														status: "success",
														duration: 1000,
														isClosable: true,
														position: "top-right",
													});
												}}
											/>
										</Flex>
										<Flex alignItems="center" justifyContent="space-between">
											<Code
												fontSize="sm"
												p="2"
												borderRadius="md"
												mr="2"
												_hover={{ bg: "teal.500", color: "white", cursor: "pointer" }}
												onClick={() => {
													navigator.clipboard.writeText(voucher.voucher_code);
													toast({
														title: "Copy mã thành công",
														status: "success",
														duration: 1000,
														isClosable: true,
														position: "top-right",
													});
												}}
											>
												{voucher.voucher_code}
											</Code>
											<IconButton
												size="sm"
												aria-label="Details"
												icon={<InfoIcon />}
												colorScheme="teal"
												onClick={() => {
													setShowModalVoucher(true);
													setSelectedVoucher(voucher);
												}}
											/>
										</Flex>
									</Box>
								))}
							</Flex>
						</Box>
					)}
				</Grid>
			</Grid>
			<Grid container spacing={6}>
				<Grid item md={12} xs={12}>
					{result &&
						<StoreProductListCard
							data={result}
							onChange={handlePageChange}
						/>}
				</Grid>
			</Grid>
			{selectedVoucher && <VoucherModal isOpen={showModalVoucher} onClose={() => {
				setShowModalVoucher(false);
				setSelectedVoucher(null);
			}} voucher={selectedVoucher} />}
		</div>
	);
};

Shop.layout = NavbarLayout;

export default Shop;
