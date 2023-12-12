import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Spinner, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppThunkDispatch } from '../store/store';
import { useState } from 'react';
import { forgotPassword } from '../store/slices/auth-slice';

const ForgotPassword = () => {

	const dispatch = useDispatch<AppThunkDispatch>();
	const [email, setEmail] = useState('');
	const navigate = useNavigate();
	const toast = useToast();


	const handleSubmit = (event) => {
		event.preventDefault();
		const loadingToastId = toast({
			title: 'Đang gửi email...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		// handle the form submission here
		dispatch(forgotPassword({
			email
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Thất bại !',
					status: 'error',
					duration: 1500,
					isClosable: true,
					position: 'top-right',
				})
			} else {
				toast({
					title: 'Gửi mail thành công',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setTimeout(() => {
					navigate("/success-forgot-password")
				}, 2000);
			}
		}).catch(() => {
			toast.close(loadingToastId);
		});

	};

	return (
		<Flex
			p={8}
			direction="column"
			justifyContent="center"
			alignItems="center"

		>
			<Box mx="auto" my="2rem" p={4} boxShadow="lg" borderRadius="md">
				<Heading textAlign="center" mb={6}> Quên mật khẩu</Heading>
				<Box as="form" onSubmit={handleSubmit} p={4}>
					<FormControl id="email" isRequired mt={2}>
						<FormLabel>Nhập email</FormLabel>
						<Input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
							focusBorderColor="blue.500"
							width={300}
						/>
					</FormControl>
					<Button
						mt={2}
						onClick={handleSubmit}
						isDisabled={email === ''}
						colorScheme="blue"
						type="submit"
						size="lg"
						width="full"
					>
						Reset Password
					</Button>
				</Box>
			</Box>
		</Flex>
	);
};

export default ForgotPassword;