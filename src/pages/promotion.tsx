import { useEffect, useState } from "react";
import CheckoutNavLayout from "../components/layout/CheckoutNavLayout";
import { AppThunkDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { Box, Flex, IconButton, Text, useToast } from "@chakra-ui/react";
import DashboardPageHeader from "../components/layout/DashboardPageHeader";
import { getVoucherUser } from "../store/slices/promotions-slice";
import { ListVoucherReponse } from "api/interface/promotion";
import { CopyIcon } from "@chakra-ui/icons";

const Promotion = () => {

	const dispatch = useDispatch<AppThunkDispatch>();
	const [response, setResponse] = useState<ListVoucherReponse>(null);
	const toast = useToast();
	useEffect(() => {
		dispatch(getVoucherUser({
			page: "1", size: "100",
			"filters[is_expired][$eq]": "1"
		})).unwrap().then((res) => {
			if (res.status === 200) {
				setResponse(res.data);
			}
		});
		return () => {
		}
	}, []);

	return (
		<Box px={12} py={4}>
			<Box>
				<DashboardPageHeader
					title="Mã vận chuyển"
				/>
				{response && response.data.items && response.data.items.filter(x => x.voucher_type === 1).map((item) =>
					<Box borderWidth="1px" borderRadius="lg" padding="6" margin="4">
						<Flex display="inline-flex" alignItems="center" >
							<Text
								m={'auto'}
								fontWeight="bold" marginBottom="2">Code: {item.voucher_code}</Text>
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
										position: "top-right"
									});
								}}
								marginLeft="2"
							/>
						</Flex>
						<Text marginBottom="2">Giảm giá : {item.discount_value.toLocaleString('vi-VN')}₫</Text>
						<Text>Giá tối thiểu để giảm: {item.voucher_require.min_require.toLocaleString('vi-VN')}₫</Text>
						<Text>Chi tiết:</Text>
						<Text>{item.detail}</Text>
					</Box>
				)}
			</Box>
			<Box mt={12}>
				<DashboardPageHeader
					title="Mã sản phẩm"
				/>
				{response && response.data.items && response.data.items.filter(x => x.voucher_type === 2).map((item) =>
					<Box borderWidth="1px" borderRadius="lg" padding="6" margin="4">
						<Flex display="inline-flex" alignItems="center" >
							<Text
								m={'auto'}
								fontWeight="bold" marginBottom="2">Code: {item.voucher_code}</Text>
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
										position: "top-right"
									});
								}}
								marginLeft="2"
							/>
						</Flex>
						<Text marginBottom="2">Giảm giá : {item.discount_value.toLocaleString('vi-VN')}₫</Text>
						<Text>Giá tối thiểu để giảm: {item.voucher_require.min_require.toLocaleString('vi-VN')}₫</Text>
						<Text>Chi tiết:</Text>
						<Text>{item.detail}</Text>
					</Box>
				)}

			</Box>
		</Box >

	);
};

Promotion.layout = CheckoutNavLayout;

export default Promotion;
