import { useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import Box from "../Box";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import CheckBox from "../CheckBox";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import { H3, H5, H6, SemiSpan, Span } from "../Typography";
import { StyledSessionCard } from "./SessionStyle";
import { FormLabel, Radio, RadioGroup, Spinner, Stack, useToast } from "@chakra-ui/react";
import { registerAccount } from "../../stores/slices/auth-slice";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const togglePasswordVisibility = () => {
		setPasswordVisibility((visible) => !visible);
	};
	const toast = useToast();
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [gender, setGender] = useState("Other")
	const handleFormSubmit = async (values) => {
		const loadingToastId = toast({
			title: 'Đang tạo tài khoản...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		// handle the form submission here
		dispatch(registerAccount({
			...values,
			birthday: values.birthday,
			hashedPassword: values.password,
			gender: gender.toUpperCase()
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Thất bại!',
					status: 'error',
					duration: 1500,
					isClosable: true,
					position: 'top-right',
				})

			} else {
				toast({
					title: 'Tạo tài khoản thành công',
					description: 'Vui lòng kiểm tra email để xác thực tài khoản',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setTimeout(() => {
					navigate("/login")
				}, 2000);
			}
		}).catch(() => {
			toast.close(loadingToastId);
		});

	};

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
					Tạo tài khoản
				</H3>
				<H5
					fontWeight="600"
					fontSize="12px"
					color="gray.800"
					textAlign="center"
					mb="2.25rem"
				>
					Vui lòng điền vào tất cả các biểu mẫu để tiếp tục
				</H5>

				<TextField
					mb="0.75rem"
					name="firstName"
					label="Tên"
					placeholder="firstName"
					fullwidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.firstName || ""}
					errorText={touched.firstName && errors.firstName}
				/>
				<TextField
					mb="0.75rem"
					name="lastName"
					label="Họ"
					placeholder="lastName"
					fullwidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.lastName || ""}
					errorText={touched.lastName && errors.lastName}
				/>
				<TextField
					mb="0.75rem"
					name="phoneNumber"
					placeholder="Số điện thoại"
					label="Số điện thoại"
					pattern="[0-9]{10}"
					fullwidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.phoneNumber || ""}
					errorText={touched.phoneNumber && errors.phoneNumber}
				/>
				<TextField
					mb="0.75rem"
					name="email"
					placeholder="exmple@mail.com"
					label="Email"
					type="email"
					fullwidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.email || ""}
					errorText={touched.email && errors.email}
				/>
				<TextField
					type="date"
					mb="0.75rem"
					name="birthday"
					placeholder="Ngày sinh"
					label="Ngày sinh"
					fullwidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.birthday || ""}
					errorText={touched.birthday && errors.birthday}
				/>
				<FormLabel fontSize="sm">Giới tính</FormLabel>
				<RadioGroup defaultValue="Male" mb="0.75rem" name="Gioi tinh"
					onChange={(e) => { setGender(e) }}
				>
					<Stack direction="row">
						<Radio value="Male">Nam</Radio>
						<Radio value="Female">Nữ</Radio>
						<Radio value="Other">Khác</Radio>
					</Stack>
				</RadioGroup>

				<TextField
					mb="0.75rem"
					name="password"
					placeholder="*********"
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
					pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
				/>
				<TextField
					mb="1rem"
					name="re_password"
					placeholder="*********"
					type={passwordVisibility ? "text" : "password"}
					label="Xác nhận mật khẩu"
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
					value={values.re_password || ""}
					errorText={touched.re_password && errors.re_password}
					pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

				/>
				<CheckBox
					mb="1.75rem"
					name="agreement"
					color="secondary"
					checked={values.agreement}
					onChange={handleChange}
					label={
						<FlexBox>
							<SemiSpan>Đồng ý với </SemiSpan>
							<a href="/" target="_blank" rel="noreferrer noopener">
								<H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
									Điều khoản sử dụng
								</H6>
							</a>
						</FlexBox>
					}
				/>

				<Button
					mb="1.65rem"
					variant="contained"
					color="primary"
					type="submit"
					fullwidth
					onClick={() => handleFormSubmit(values)}
				>
					Tạo tài khoản
				</Button>

				<Box mb="1rem">
					<Divider width="200px" mx="auto" />
					<FlexBox justifyContent="center" mt="-14px">
						<Span color="text.muted" bg="body.paper" px="1rem">
							on
						</Span>
					</FlexBox>
				</Box>

			</form>
			<FlexBox justifyContent="center" bg="gray.200" py="19px">
				<SemiSpan>Đã có tài khoản?</SemiSpan>
				<a href="/login">
					<H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
						Đăng nhập
					</H6>
				</a>
			</FlexBox>
		</StyledSessionCard>
	);
};

const initialValues = {
	firstName: "",
	lastName: "",
	phoneNumber: "",
	email: "",
	password: "",
	re_password: "",
	agreement: false,
	gender: "",
	birthday: "",
};

const formSchema = yup.object().shape({
	name: yup.string().required("${path} is required"),
	email: yup.string().email("invalid email").required("${path} is required"),
	password: yup.string().required("${path} is required"),
	re_password: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required("Please re-type password"),
	agreement: yup
		.bool()
		.test(
			"agreement",
			"You have to agree with our Terms and Conditions!",
			(value) => value === true
		)
		.required("You have to agree with our Terms and Conditions!"),
});

export default Signup;
