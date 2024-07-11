import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { useDispatch } from "react-redux";
import { createAuthenticationToken } from "@stores/slices/auth-slice";
import { AppThunkDispatch } from "@stores/store";
import { Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { handleApiCallWithToast } from "@/utils/utils";
import { ContentToast, TitleToast } from "@/utils/constants";

const Login: React.FC = () => {
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const toast = useToast()
	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisibility((visible) => !visible);
	}, []);
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleFormSubmit = async (values) => {

		handleApiCallWithToast(dispatch,
			createAuthenticationToken,
			{
				username: values.email,
				password: values.password
			},
			null,
			TitleToast.LOGIN,
			TitleToast.SUCCESS,
			ContentToast.LOGIN_SUCCESS,
			TitleToast.ERROR,
			ContentToast.LOGIN_ERROR,
			null,
			toast,
			<Spinner />,
			(res) => {
				setTimeout(() => {
					localStorage.setItem("Sid", res.data.sid);
					if (res.data.role === "ADMIN") {
						navigate("/admin");
						return;
					} else if (res.data.role === "DELIVERY") {
						navigate("/delivery");
						return;
					}
					navigate("/");
				}, 1000);
			},
			(res) => {
				if (res.data.detail.includes("verified")) {
					navigate("/auth/verify-account")
				}
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
					Chào mừng đến với Latipe
				</H3>
				<H5
					fontWeight="600"
					fontSize="12px"
					color="gray.800"
					textAlign="center"
					mb="2.25rem"
				>
					Đăng nhập với email và password
				</H5>

				<TextField
					mb="0.75rem"
					name="email"
					placeholder="exmple@mail.com"
					label="Email hoặc Điện thoại"
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
					label="Mật khẩu"
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
					Đăng nhập
				</Button>

				<FlexBox justifyContent="center" mb="1.25rem">
					<SemiSpan>Chưa có tài khoản?</SemiSpan>
					<a href="/signup">
						<H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
							Đăng ký
						</H6>
					</a>
				</FlexBox>
			</form>

			<FlexBox justifyContent="center" bg="gray.200" py="19px"
				cursor="pointer"
			>
				<SemiSpan>Quên mật khẩu?</SemiSpan>
				<H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900"
					cursor="pointer"
					onClick={() => navigate("/forgot-password")}>
					Lấy lại ngay
				</H6>
			</FlexBox>
		</StyledSessionCard>
	);
};

const initialValues = {
	email: "",
	password: "",
};

const formSchema = yup.object().shape({
	email: yup.string().email("Email không đúng định dạng").required("${path} is required"),
	password: yup.string().required("${path} is required"),
});

export default Login;
