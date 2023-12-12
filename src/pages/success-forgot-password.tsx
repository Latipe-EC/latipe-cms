import { Text } from "@chakra-ui/react";
import Button from "../components/buttons/Button";
import FlexBox from "../components/FlexBox";
import Image from "../components/Image";
import { useNavigate } from 'react-router-dom';


const SuccessForgotPassword = () => {

	const navigate = useNavigate();

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
				Đã gửi email xác thực, vui lòng kiểm tra email của bạn
			</Text>
			<FlexBox flexWrap="wrap">
				<Button
					variant="outlined"
					color="primary"
					m="0.5rem"
					onClick={() => { navigate("/") }}
				>
					Quay về trang chủ
				</Button>
			</FlexBox>
		</FlexBox>
	);
};

export default SuccessForgotPassword;