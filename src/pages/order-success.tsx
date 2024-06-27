import { Text } from "@chakra-ui/react";
import Button from "@components/buttons/Button";
import FlexBox from "@components/FlexBox";
import Image from "@components/Image";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
	const navigate = useNavigate();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	const handleGoBack = async () => {
		navigate("/search");
	};

	return (
		<FlexBox
			flexDirection="column"
			minHeight="80vh"
			justifyContent="center"
			alignItems="center"
			px="0.5rem"
		>
			<Image
				src="/assets/images/order/order_success.svg"
				width="10%"
				mb="1rem"
			/>
			<Text fontSize="xl" fontWeight="bold" mb="1rem">
				Bạn đã mua hàng thành công
			</Text>
			<FlexBox flexWrap="wrap">
				<Button
					variant="outlined"
					color="primary"
					m="0.5rem"
					onClick={handleGoBack}
				>
					Tiếp tục mua sắm
				</Button>
				<a href="/orders">
					<Button variant="contained" color="primary" m="0.5rem">
						Xem đơn hàng
					</Button>
				</a>
			</FlexBox>
		</FlexBox>
	);
};

export default OrderSuccess;