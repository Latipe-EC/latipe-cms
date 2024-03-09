import { useEffect, useState } from "react";
import Avatar from "@components/avatar/Avatar";
import Box from "@components/Box";
import Button from "@components/buttons/Button";
import FlexBox from "@components/FlexBox";
import Grid from "@components/grid/Grid";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import Typography, { H5 } from "@components/Typography";
import { format } from "date-fns";
import { UserResponse } from "@interfaces/user";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { getMyProfile, updateProfile, updateUsername } from "@stores/slices/user-slice";
import {
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Radio,
	RadioGroup,
	Spinner,
	Stack,
	Text,
	useToast
} from "@chakra-ui/react";
import Icon from "@components/icon/Icon";
import Hidden from "@components/hidden/Hidden";
import { vi } from "date-fns/locale";

const Profile = () => {

	const dispatch = useDispatch<AppThunkDispatch>();
	const toast = useToast();

	const [profile, setProfile] = useState<UserResponse>();
	const [avatarFile, setAvatarFile] = useState<File>(null);
	useEffect(() => {
		dispatch(getMyProfile()).unwrap().then((res) => {
			setProfile(res.data);

		});
	}, []);

	const handleUpdateProfile = () => {

		const loadingToastId = toast({
			title: 'Cập nhật...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		dispatch(updateProfile({
			firstName: profile.firstName,
			lastName: profile.lastName,
			displayName: profile.firstName + " " + profile.lastName,
			birthday: profile.birthday,
			gender: profile.gender,
			phoneNumber: profile.phoneNumber,
			avatar: profile.avatar,
			avatarFile
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status.toString().includes("20")) {
				toast({
					title: 'Thành công!',
					description: "Cập nhật thành công",
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
			} else {
				toast({
					title: 'Thất bại!',
					description: "Cập nhật thất bại",
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
			}
		});
	};

	const handleUpdateUsername = () => {

		const loadingToastId = toast({
			title: 'Cập nhật...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		dispatch(updateUsername({
			username: profile.username
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status.toString().includes("20")) {
				toast({
					title: 'Thành công!',
					description: "Cập nhật thành công",
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
				setProfile({ ...profile, isChangeUsername: true });
			} else {
				toast({
					title: 'Thất bại!',
					description: "Cập nhật thất bại",
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
			}
		});
	};

	const handleCheckDisable = () => {
		if (
			profile.username === "" ||
			profile.firstName === "" ||
			profile.lastName === "" ||
			profile.email === "" ||
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(profile.email) ||
			profile.phoneNumber.length < 10 || profile.phoneNumber.length > 11 ||
			new Date().getFullYear() - new Date(profile.birthday).getFullYear() < 13
		) {
			return true;
		}
		return false;
	}

	const getSourceAvatar = () => {
		if (avatarFile) {
			return URL.createObjectURL(avatarFile);
		}
		if (profile.avatar) {
			return profile.avatar;
		}
		return "/assets/images/faces/ralph.png";
	}


	return (
		<div>
			<DashboardPageHeader
				iconName="user_filled"
				title="Hồ Sơ Của Tôi"
			/>

			{profile &&
				<Box mb="30px">
					<Box mb="30px" display="flex">
						<Box flex="4">
							<Grid templateColumns={{ md: "repeat(2, 1fr)", sm: "repeat(1, 1fr)" }} gap={6}>
								<FormControl my={4}>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0" textAlign="right">Tên đăng nhập:</FormLabel>
										</Box>
										{!profile.isChangeUsername ?
											(
												<Flex width="80%">
													<Input
														placeholder="First Name"
														isDisabled={profile.isChangeUsername}
														value={profile.username}
														onChange={(e) => setProfile({
															...profile,
															username: e.target.value
														})}
														flex="1"
													/>
													<Button ml={2} color="green" bg="#e6ebf2"
														onClick={handleUpdateUsername}>Lưu</Button>
												</Flex>
											) : <Text>{profile.username}</Text>}
									</Flex>
								</FormControl>

								<FormControl my={4}>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0px" textAlign="right">Họ:</FormLabel>
										</Box>
										<Input placeholder="Họ" width="80%" value={profile.lastName}
											onChange={(e) => setProfile({
												...profile,
												lastName: e.target.value
											})} />
									</Flex>
								</FormControl>

								<FormControl my={4}>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0" textAlign="right">Tên:</FormLabel>
										</Box>
										<Input placeholder="Tên" width="80%"
											value={profile.firstName}
											onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
										/>
									</Flex>
								</FormControl>

								<FormControl my={4}
									isInvalid={profile.email === "" || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(profile.email)}>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0" textAlign="right">Email:</FormLabel>
										</Box>
										<Input placeholder="Email" width="80%" value={profile.email}
											isDisabled={true}
											pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
											onChange={(e) => setProfile({ ...profile, email: e.target.value })}
										/>
									</Flex>
									<FormErrorMessage ml={"30%"}>Không phải email</FormErrorMessage>
								</FormControl>

								<FormControl my={4}
									isInvalid={profile.phoneNumber.length < 10 || profile.phoneNumber.length > 11}
								>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0" textAlign="right">Số điện thoại:</FormLabel>
										</Box>
										<Input placeholder="First Name" width="80%"
											type="number"
											value={profile.phoneNumber}
											onChange={(e) => setProfile({
												...profile,
												phoneNumber: e.target.value
											})}
											pattern="\d{10,11}"
										/>
									</Flex>
									<FormErrorMessage ml={"30%"}>Số điện thoại phải có 10-11 chữ
										số</FormErrorMessage>
								</FormControl>

								<FormControl my={4}>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0" textAlign="right">Giới tính:</FormLabel>
										</Box>
										<RadioGroup defaultValue={
											profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase()
										} width="80%"
											onChange={(value) =>
												setProfile({ ...profile, gender: value })}
										>
											<Stack direction="row">
												<Radio value="Male">Male</Radio>
												<Radio value="Female">Female</Radio>
												<Radio value="Other">Other</Radio>
											</Stack>
										</RadioGroup>
									</Flex>
								</FormControl>

								<FormControl my={4}
									isInvalid={new Date().getFullYear() - new Date(profile.birthday).getFullYear() < 13}>
									<Flex alignItems="flex-end">
										<Box width="30%">
											<FormLabel mb="0" textAlign="right">Năm sinh:</FormLabel>
										</Box>
										<Input type="date" id="birth-date" defaultValue={
											profile.birthday ? format(new Date(profile.birthday), "yyyy-MM-dd", { locale: vi }) : format(new Date(), "yyyy-MM-dd", { locale: vi })
										} width="80%"
											onChange={(e) => {
												setProfile({ ...profile, birthday: new Date(e.target.value) })
											}}
										/>
									</Flex>
									<FormErrorMessage ml={"30%"}>You must be at least 13 years
										old</FormErrorMessage>

								</FormControl>
							</Grid>
						</Box>

						<Box flex="2">
							<FlexBox justifyContent="center" alignItems="center" height="100%">
								<Box>
									<FlexBox alignItems="flex-end" mb="22px">
										<Avatar src={getSourceAvatar()} size={64} />

										<Box ml="-20px" zIndex={1}>
											<label htmlFor="profile-image">
												<Button
													as="span"
													size="small"
													bg="gray.300"
													color="secondary"
													height="auto"
													p="6px"
													borderRadius="50%"
												>
													<Icon>camera</Icon>
												</Button>
											</label>
										</Box>
										<Hidden>
											<input
												className="hidden"
												onChange={(e) => setAvatarFile(e.target.files[0])}
												id="profile-image"
												accept="image/*"
												type="file"
											/>
										</Hidden>
									</FlexBox>
									<Box ml="12px" flex="1 1 0">
										<FlexBox
											justifyContent="center"
											alignItems="center"
											flexWrap="wrap"
										>
											<div>
												<H5 my="0px">{profile.displayName}</H5>
												<FlexBox alignItems="center">
													<Typography fontSize="14px" color="text.hint">
														Số dư:
													</Typography>
													<Typography ml="4px" fontSize="14px" color="primary.main">
														{profile.eWallet ? profile.eWallet.toLocaleString('vi-VN') : 0} đ
													</Typography>
												</FlexBox>
											</div>
										</FlexBox>
									</Box>
								</Box>
							</FlexBox>
						</Box>
					</Box>
					<Flex justifyContent="flex-end">
						<Button color="red" bg="primary.light" variant="ghost"
							disabled={handleCheckDisable()}
							onClick={handleUpdateProfile}
						>Lưu</Button>
					</Flex>
				</Box>}

		</div>
	);
};

export default Profile;
