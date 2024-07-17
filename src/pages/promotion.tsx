import { useEffect, useState } from "react";
import CheckoutNavLayout from "@components/layout/CheckoutNavLayout";
import { AppThunkDispatch } from "@stores/store";
import { useDispatch } from "react-redux";
import { Box, Flex, IconButton, Text, useToast, Input, Button, Stack, Heading, SimpleGrid } from "@chakra-ui/react";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import { getVoucherUser } from "@stores/slices/promotions-slice";
import { ItemVoucher, ListVoucherReponse } from "@interfaces/promotion";
import { CopyIcon, SearchIcon } from "@chakra-ui/icons";
import { VoucherType } from "@/utils/constants";

const Promotion = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const [response, setResponse] = useState<ListVoucherReponse>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const toast = useToast();

	useEffect(() => {
		dispatch(
			getVoucherUser({
				page: "1",
				size: "100",
				"filters[is_expired][$eq]": "1"
			})
		)
			.unwrap()
			.then((res) => {
				if (res.status === 200) {
					setResponse(res.data);
				}
			});
		return () => { };
	}, []);

	const filterVouchers = (vouchers: ItemVoucher[], type: number) => {
		return vouchers
			.filter((voucher) => voucher.voucher_type === type)
			.filter((voucher) =>
				voucher.voucher_code.toLowerCase().includes(searchTerm.toLowerCase())
			);
	};

	return (
		<Box px={12} py={4}>
			<DashboardPageHeader title="Tìm kiếm mã giảm giá" />

			<Stack spacing={4} direction={{ base: "column", md: "row" }} align="stretch">
				<Input
					placeholder="Nhập mã giảm giá"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Button leftIcon={<SearchIcon />} colorScheme="blue">
					Tìm kiếm
				</Button>
			</Stack>

			<Stack spacing={8} mt={8}>
				<Box>
					<Heading as="h2" size="lg" mb={4}>
						Mã vận chuyển
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
						{response &&
							response.data.items &&
							filterVouchers(response.data.items, VoucherType.DELIVERY).map((item) => (
								<Box key={item.id} borderWidth="1px" borderRadius="lg" padding="6">
									<Flex alignItems="center" mb={2}>
										<Text fontWeight="bold" flex="1">
											Code: {item.voucher_code}
										</Text>
										<IconButton
											aria-label="Copy code"
											icon={<CopyIcon />}
											onClick={() => {
												navigator.clipboard.writeText(item.voucher_code);
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
									<Text mb={2}>Giảm giá: {item.discount_data.shipping_value.toLocaleString("vi-VN")}₫</Text>
									<Text mb={2}>
										Giá tối thiểu để giảm: {item.voucher_require.min_require.toLocaleString("vi-VN")}₫
									</Text>
									<Text fontWeight="bold" mb={1}>
										Chi tiết:
									</Text>
									<Text>{item.detail}</Text>
								</Box>
							))}
					</SimpleGrid>
				</Box>

				<Box>
					<Heading as="h2" size="lg" mb={4}>
						Mã sản phẩm
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
						{response &&
							response.data.items &&
							filterVouchers(response.data.items, VoucherType.PRODUCT).map((item) => (
								<Box key={item.id} borderWidth="1px" borderRadius="lg" padding="6">
									<Flex alignItems="center" mb={2}>
										<Text fontWeight="bold" flex="1">
											Code: {item.voucher_code}
										</Text>
										<IconButton
											aria-label="Copy code"
											icon={<CopyIcon />}
											onClick={() => {
												navigator.clipboard.writeText(item.voucher_code);
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
									<Text mb={2}>Giảm giá: {item.discount_data.discount_value.toLocaleString("vi-VN")}₫</Text>
									<Text mb={2}>
										Giá tối thiểu để giảm: {item.voucher_require.min_require.toLocaleString("vi-VN")}₫
									</Text>
									<Text fontWeight="bold" mb={1}>
										Chi tiết:
									</Text>
									<Text>{item.detail}</Text>
								</Box>
							))}
					</SimpleGrid>
				</Box>
			</Stack>
		</Box>
	);
};

Promotion.layout = CheckoutNavLayout;

export default Promotion;