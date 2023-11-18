import { useFormik } from "formik";
import React, { useCallback, useState } from "react";
import * as yup from "yup";
import Box from "../Box";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan, Small, Span } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { useDispatch } from "react-redux";
import { createAuthenticationToken } from "../../store/slices/auth-slice";
import { AppThunkDispatch } from "store/store";
import { Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const toast = useToast()
	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisibility((visible) => !visible);
	}, []);
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();

	const handleFormSubmit = async (values) => {
		const loadingToastId = toast({
			title: 'Logging',
			status: 'info',
			description: <Spinner size="sm" />,
			duration: null,
			isClosable: true,
		})

		dispatch(createAuthenticationToken({
			username: values.email,
			password: values.password
		}))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status === 200) {
					toast({
						title: 'Success Login !',
						status: 'success',
						duration: null,
						isClosable: true,
						position: 'top-right',
					})
					setTimeout(() => {
						navigate("/");
					}, 2000);
				} else {
					toast({
						title: 'Error !',
						status: 'error',
						description: res.data.detail,
						duration: 1500,
						isClosable: true,
						position: 'top-right',
					})
				}

			}).catch((err) => {
				toast.close(loadingToastId)
				const error = err.message.includes('404') ? 'Wrong Email or Phone Number!' : 'Wrong password!';
				toast({
					title: 'Error !',
					status: 'error',
					description: error,
					duration: 1500,
					isClosable: true,
					position: 'top-right',
				})
			})


	}

	const {
		values,
		errors,
		touched,
		handleBlur,
		handleChange,
		handleSubmit,
	} = useFormik({
		onSubmit: handleFormSubmit,
		initialValues,
		validationSchema: formSchema,
	});

	return (
		<StyledSessionCard mx="auto" my="2rem" boxShadow="large">
			<form className="content" onSubmit={handleSubmit}>
				<H3 textAlign="center" mb="0.5rem">
					Welcome To Ecommerce
				</H3>
				<H5
					fontWeight="600"
					fontSize="12px"
					color="gray.800"
					textAlign="center"
					mb="2.25rem"
				>
					Log in with email & password
				</H5>

				<TextField
					mb="0.75rem"
					name="email"
					placeholder="exmple@mail.com"
					label="Email or Phone Number"
					type="email"
					fullwidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.email || ""}
					errorText={touched.email && errors.email}
				/>
				<TextField
					mb="1rem"
					name="password"
					placeholder="*********"
					autoComplete="on"
					type={passwordVisibility ? "text" : "password"}
					label="Password"
					fullwidth
					endAdornment={
						<IconButton
							size="small"
							type="button"
							p="0.25rem"
							mr="0.25rem"
							color={passwordVisibility ? "gray.700" : "gray.600"}
							onClick={togglePasswordVisibility}
						>
							<Icon variant="small" defaultcolor="currentColor">
								{passwordVisibility ? "eye-alt" : "eye"}
							</Icon>
						</IconButton>
					}
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.password || ""}
					errorText={touched.password && errors.password}
				/>

				<Button
					mb="1.65rem"
					variant="contained"
					color="primary"
					type="submit"
					fullwidth
				>
					Login
				</Button>

				<Box mb="1rem">
					<Divider width="200px" mx="auto" />
					<FlexBox justifyContent="center" mt="-14px">
						<Span color="text.muted" bg="body.paper" px="1rem">
							on
						</Span>
					</FlexBox>
				</Box>

				<FlexBox
					justifyContent="center"
					alignItems="center"
					bg="#3B5998"
					borderRadius={5}
					height="40px"
					color="white"
					cursor="pointer"
					mb="0.75rem"
				>
					<Icon variant="small" defaultcolor="auto" mr="0.5rem">
						facebook-filled-white
					</Icon>
					<Small fontWeight="600">Continue with Facebook</Small>
				</FlexBox>

				<FlexBox
					justifyContent="center"
					alignItems="center"
					bg="#4285F4"
					borderRadius={5}
					height="40px"
					color="white"
					cursor="pointer"
					mb="1.25rem"
				>
					<Icon variant="small" defaultcolor="auto" mr="0.5rem">
						google-1
					</Icon>
					<Small fontWeight="600">Continue with Google</Small>
				</FlexBox>

				<FlexBox justifyContent="center" mb="1.25rem">
					<SemiSpan>Don’t have account?</SemiSpan>
					<a href="/signup">
						<H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
							Sign Up
						</H6>
					</a>
				</FlexBox>
			</form>

			<FlexBox justifyContent="center" bg="gray.200" py="19px">
				<SemiSpan>Forgot your password?</SemiSpan>
				<a href="/">
					<H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
						Reset It
					</H6>
				</a>
			</FlexBox>
		</StyledSessionCard>
	);
};

const initialValues = {
	email: "",
	password: "",
};

const formSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("${path} is required"),
	password: yup.string().required("${path} is required"),
});

export default Login;
