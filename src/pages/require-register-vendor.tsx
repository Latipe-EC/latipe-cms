import { Text } from "@chakra-ui/react";
import Button from "@components/buttons/Button";
import FlexBox from "@components/FlexBox";
import Image from "@components/Image";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const RequireRegisterVendor = () => {
	const navigate = useNavigate();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	const handleGoBack = async () => {
		navigate("/");
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
				Bạn chưa đăng ký là nhà bán hàng. Hãy đăng ký ngay
			</Text>
			<FlexBox flexWrap="wrap">
				<Button
					variant="outlined"
					color="primary"
					m="0.5rem"
					onClick={handleGoBack}
				>
					Về trang chủ
				</Button>
				<a href="/register-store">
					<Button variant="contained" color="primary" m="0.5rem">
						Đăng ký
					</Button>
				</a>
			</FlexBox>
		</FlexBox>
	);
};

export default RequireRegisterVendor;