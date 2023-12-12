import { Spinner, Text } from "@chakra-ui/react";
import Button from "../components/buttons/Button";
import FlexBox from "../components/FlexBox";
import Image from "../components/Image";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../store/store";
import { finishVerifyAccount } from "../store/slices/auth-slice";

const VerifyAccount = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const { token } = useParams();
	const [res, setRes] = useState<boolean>(null);
	useEffect(() => {
		dispatch(finishVerifyAccount({
			token: decodeURIComponent(token)
		})).unwrap().then((res) => {
			if (res.status === 200) {
				setRes(true);
			} else {
				setRes(false);
			}
		});
	}, []);

	return (
		<FlexBox
			flexDirection="column"
			minHeight="80vh"
			justifyContent="center"
			alignItems="center"
			px="0.5rem"
		>
			{res === null ? <Spinner size={"xl"} /> : <>
				<Image
					src={`/assets/images/order/order_${res ? "success" : "failed"}.svg`}
					width="10%"
					mb="1rem"
				/>
				<Text fontSize="xl" fontWeight="bold" mb="1rem">
					{res ? "Xác thực thành công" : "Xác thực thất bại"}
				</Text>
				<FlexBox flexWrap="wrap">
					<Button
						variant="outlined"
						color="primary"
						m="0.5rem"
						onClick={() => { navigate("/") }}
					>
						Về trang chủ
					</Button>

				</FlexBox>
			</>
			}
		</FlexBox>
	);
};

export default VerifyAccount;