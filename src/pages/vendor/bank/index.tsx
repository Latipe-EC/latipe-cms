import { useNavigate } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../store/store";
import { getMyStore } from "../../../store/slices/stores-slice";
import { useEffect, useState } from "react";
import { GetMyStoreResponse } from "../../../api/interface/store";
import { Box, FormControl, FormHelperText, FormLabel, Heading, Input, Spinner, useToast } from "@chakra-ui/react";
import { Chip } from "../../../components/Chip";
import { Small } from "../../../components/Typography";
import { withdrawPayPal } from "../../../store/slices/payment-slice";

const BankVendor = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const toast = useToast();
	const [response, setResponse] = useState<GetMyStoreResponse>();
	const [withdrawAmount, setWithdrawAmount] = useState(0);
	const [withdrawEmail, setWithdrawEmail] = useState("");
	const [emailError, setEmailError] = useState("");


	useEffect(() => {
		dispatch(getMyStore()).unwrap().then(
			(res) => {
				if (res.status !== 200) {
					navigate("/401");
					return;
				}
				setResponse(res.data);
			}
		);
	}, []);

	const validateEmail = (email) => {
		const re = /\S+@\S+\.\S+/;
		return re.test(email);
	};

	const handleWithdraw = () => {
		const loadingToastId = toast({
			title: 'Cập nhật...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(withdrawPayPal({ email: withdrawEmail, amount: withdrawAmount })).unwrap().then(
			(res) => {
				toast.close(loadingToastId);
				if (res.status !== 200) {
					navigate("/401");
					toast({
						title: 'Thất bại!',
						description: "Rút tiền thất bại",
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
					return;
				}
				toast({
					title: 'Thành công!',
					description: "Cập nhật thành công",
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
				navigate("/valid-withdraw")
			}
		).catch(() => {
			toast.close(loadingToastId);
			toast({
				title: 'Thất bại!',
				description: "Rút tiền thất bại",
				status: 'error',
				duration: 2000,
				isClosable: true,
				position: "top-right",
			})
		});
	}

	return (
		<div>
			<DashboardPageHeader
				title="Ví shop"
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>
			{response && (
				<Box p={4} bg="white" boxShadow="lg" borderRadius="md">
					<Heading size="md" mb={4}>Rút tiền</Heading>
					<Box my="6px">
						<Chip p="0.5rem 1.5rem" bg="red">
							<Small textAlign="center" color="white" fontWeight="bold" fontSize="lg">Số dư: {response.eWallet.toLocaleString('vi-VN')}₫</Small>
						</Chip>
					</Box>
					<FormControl id="withdrawEmail" mb={4} w={"50%"}>
						<FormLabel fontSize="lg" color="blue.700">Nhập email tài khoản paypal</FormLabel>
						<Input
							value={withdrawEmail}
							onChange={(e) => {
								setWithdrawEmail(e.target.value);
								if (e.target.value === "") {
									setEmailError("");
									return
								}
								if (!validateEmail(e.target.value)) {
									setEmailError("Không đúng định dạng email");
								} else {
									setEmailError("");
								}
							}}
						/>
						{emailError && <FormHelperText color="red.500">{emailError}</FormHelperText>}

					</FormControl>
					<FormControl id="withdrawAmount" mb={4} w={"50%"}>
						<FormLabel fontSize="lg" color="blue.700">Nhập số tiền bạn muốn rút từ ví</FormLabel>
						<Input
							type="number"
							value={withdrawAmount}
							min={1}
							onChange={(e) => {
								if (parseFloat(e.target.value) > response.eWallet)
									return;
								setWithdrawAmount(parseFloat(e.target.value))
							}}
						/>
					</FormControl>
					<Button
						colorScheme="blue"
						onClick={handleWithdraw}
						disabled={withdrawAmount === 0 || withdrawEmail === "" || emailError !== ""}
						size="lg"
						w="full"
						mt={4}
						bg="green"
						color="white"
					>
						Xác nhận rút tiền
					</Button>
				</Box>
			)
			}
		</div >
	);
};



export default BankVendor;
