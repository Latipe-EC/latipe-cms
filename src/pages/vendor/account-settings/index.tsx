import Avatar from "../../../components/avatar/Avatar";
import Box from "../../../components/Box";
import Button from "../../../components/buttons/Button";
import { Card1 } from "../../../components/Card1";
import Grid from "../../../components/grid/Grid";
import Hidden from "../../../components/hidden/Hidden";
import Icon from "../../../components/icon/Icon";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import TextField from "../../../components/text-field/TextField";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "store/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyStore, updateMyStore } from "../../../store/slices/stores-slice";
import { GetMyStoreResponse } from "api/interface/store";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormControl, FormErrorMessage, FormLabel, Input, Select, useToast } from "@chakra-ui/react";
import { District, Province, Ward } from "api/interface/user";
import provincesData from '../../../data/province.json';
import districtsData from '../../../data/district.json';
import wardsData from '../../../data/ward.json';
import './index.css'
import Typography, { H3, Small } from "../../../components/Typography";
import FlexBox from "../../../components/FlexBox";
import { Chip } from "../../../components/Chip";

const AccountSettings = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();

	const [store, setStore] = useState<GetMyStoreResponse>();
	const [logoFile, setLogoFile] = useState<File>(null);
	const [coverFile, setCoverFile] = useState<File>(null);
	const toast = useToast();
	const provinces: Province[] = provincesData as unknown as Province[];
	const districts: District[] = districtsData as unknown as District[];
	const wards: Ward[] = wardsData as unknown as Ward[];
	const [province, setProvince] = useState<Province>(null);
	const [district, setDistrict] = useState<District>(null);
	const [ward, setWard] = useState<Ward>(null);
	const [phoneError, setPhoneError] = useState("");
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);


	useEffect(() => {
		if (!store)
			return
		const phoneRegex = /^[0-9]{10}$/;
		setIsSaveDisabled(
			store.address.contactName === "" ||
			!phoneRegex.test(store.address.phone) ||
			province == null ||
			district == null ||
			ward == null ||
			province.name === "" ||
			district.name === "" ||
			ward.name === "" ||
			store.address.detailAddress === ""
		);
	}, [store]);


	useEffect(() => {
		dispatch(getMyStore()).unwrap().then(
			(res) => {
				if (res.status !== 200) {
					navigate("/401");
					return;
				}
				setStore(res.data);
				setProvince(Object.values(provinces).find(d => d.code == res.data.address.cityOrProvinceId));
				setDistrict(Object.values(districts).find(d => d.code == res.data.address.districtId));
				setWard(Object.values(wards).find(w => w.code == res.data.address.wardId));
			}
		);

	}, []);

	const getSourceLogo = () => {
		if (logoFile) {
			return URL.createObjectURL(logoFile);
		}
		if (store.logo) {
			return store.logo;
		}
		return "/assets/images/avatars/avatar-1.png";
	}

	const getSourceCover = () => {
		if (coverFile) {
			return URL.createObjectURL(coverFile);
		}
		if (store.cover) {
			return store.cover;
		}
		return "/assets/images/banners/banner-10.png";
	}

	const handleUpdate = () => {
		const loadingToastId = toast({
			title: 'Updating store.',
			description: "Loading...",
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		dispatch(updateMyStore({
			...store, logoFile, coverFile
		}))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status.toString().includes("20")) {
					toast({
						title: 'Success!',
						description: "Update store success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
				else {
					toast({
						title: 'Error!',
						description: "Update store failed",
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			})
			.catch(() => {
				toast.close(loadingToastId)
				toast({
					title: 'Error!',
					description: "Update store failed",
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
			});
	};


	const filteredDistricts = Object.values(districts).filter((d) => store && d.parent_code == store.address.cityOrProvinceId);
	const filteredWards = Object.values(wards).filter((w) => store && w.parent_code == store.address.districtId);

	const handleProvinceChange = (event: { target: { value: string; }; }) => {
		const selectedProvince = JSON.parse(event.target.value);
		setStore({
			...store, address: {
				...store.address, cityOrProvinceName: selectedProvince.name,
				wardId: null, districtId: null, wardName: '', districtName: '', cityOrProvinceId: selectedProvince.code
			}
		});
		setProvince(selectedProvince);
		setDistrict(null);
		setWard(null);

	};

	const handleWardChange = (event: { target: { value: string; }; }) => {
		const selectedWard = JSON.parse(event.target.value);

		setStore({
			...store, address: {
				...store.address, wardId: selectedWard.code, wardName: selectedWard.name
			}
		});
		setWard(selectedWard);

	};

	const handleDistrictChange = (event: { target: { value: string; }; }) => {
		const selectedDistrict = JSON.parse(event.target.value);
		setStore({
			...store, address: {
				...store.address, wardId: null, districtId: selectedDistrict.code, wardName: '', districtName: selectedDistrict.name
			}
		});

		setDistrict(selectedDistrict);
		console.log(selectedDistrict);
		setWard(null);
	};

	const handlePhoneChange = (event: { target: { value: string; }; }) => {
		const phoneRegex = /^[0-9]{10}$/;
		const isValid = phoneRegex.test(event.target.value);
		setStore({ ...store, address: { ...store.address, phone: event.target.value } });
		setPhoneError(isValid ? "" : "Phone number must be 10 digits");
	};


	return (
		<div>
			<DashboardPageHeader title="Account" iconName="settings_filled" />

			{store && <Card1 p="24px 30px">
				<Box
					borderRadius="10px"
					overflow="hidden"
					height="173px"
					mb="1.5rem"
					position="relative"
					style={{
						background: `url(${getSourceCover()}) center/cover`,
					}}
				>
					<Box
						display="flex"
						alignItems="flex-end"
						position="absolute"
						bottom="20px"
						left="24px"
					>

						<Avatar
							src={getSourceLogo()}
							size={80}
							border="4px solid"
							borderColor="gray.100"
						/>

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
								onChange={(e) => setLogoFile(e.target.files[0])}
								id="profile-image"
								accept=".png, .jpg, .jpeg"
								type="file"
							/>
						</Hidden>

						<Box m="6px">
							<Chip p="0.25rem 1rem" bg="green">
								<Small textAlign="center" color="white" fontWeight="bold">Số dư: {store.eWallet.toLocaleString('vi-VN')}₫</Small>
							</Chip>
						</Box>
					</Box>

					<Box
						display="flex"
						alignItems="flex-end"
						position="absolute"
						top="20px"
						right="24px"
					>
						<label htmlFor="cover-image">
							<Button
								as="span"
								size="small"
								bg="primary.light"
								color="secondary"
								height="auto"
								p="6px"
								borderRadius="50%"
							>
								<Icon color="primary">camera</Icon>
							</Button>
						</label>
						<Hidden>
							<input
								className="hidden"
								onChange={(e) => setCoverFile(e.target.files[0])}
								id="cover-image"
								accept=".png, .jpg, .jpeg"
								type="file"
							/>
						</Hidden>
					</Box>
				</Box>
				<Box mb="30px">
					<Grid container horizontal_spacing={6} vertical_spacing={4}>
						<Grid item md={6} xs={12} xl={12}>
							<TextField
								name="name"
								label="Tên shop"
								fullwidth
								onChange={(e) => { setStore({ ...store, name: e.target.value }) }}
								value={store.name}
								errorText={store.name === ""}
							/>
						</Grid>
						<Grid item md={6} xs={12} xl={12} >
							<CKEditor
								editor={ClassicEditor}
								data={store.description}
								onChange={(_, editor) => {
									setStore({ ...store, description: editor.getData() });
								}}
							/>
						</Grid>
						<Grid item md={6} xs={12} xl={12}>
							<FormControl isRequired isInvalid={store.address.contactName === ""} mb={4}>
								<FormLabel>Người đại diện</FormLabel>
								<Input value={store.address.contactName}
									onChange={(e) => {
										const newStore = { ...store };
										newStore.address.contactName = e.target.value;
										setStore(newStore);
									}}
									required />
								<FormErrorMessage>contact name is required</FormErrorMessage>
							</FormControl>
						</Grid>

						<Grid item md={6} xs={12} xl={12}>
							<FormControl isRequired isInvalid={phoneError !== ""} mb={4}>
								<FormLabel>Số điện thoại</FormLabel>
								<Input pattern="[0-9]{10}" value={store.address.phone}
									onChange={handlePhoneChange}
									required />
								<FormErrorMessage>{phoneError}</FormErrorMessage>
							</FormControl>
						</Grid>

						<Grid item md={6} xs={12} xl={12}>
							<FormControl isRequired isInvalid={province === null} mb={4}>
								<FormLabel>Thành phố/tỉnh</FormLabel>
								<Select value={JSON.stringify(province)} onChange={handleProvinceChange} required>
									<option value="">chọn tỉnh/thành phố</option>
									{Object.values(provinces).map((p) => (
										<option key={p.code} value={JSON.stringify(p)}>
											{p.name_with_type}
										</option>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item md={6} xs={12} xl={12}>
							<FormControl isRequired isInvalid={district === null} mb={4}>
								<FormLabel>Quận/Huyện</FormLabel>
								<Select value={JSON.stringify(district)} onChange={handleDistrictChange} required>
									<option value="">chọn quận/huyện</option>
									{filteredDistricts.map((d) => (
										<option key={d.code} value={JSON.stringify(d)}>
											{d.name_with_type}
										</option>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item md={6} xs={12} xl={12}>
							<FormControl isRequired isInvalid={ward === null} mb={4}>
								<FormLabel>Xã</FormLabel>
								<Select value={JSON.stringify(ward)} onChange={handleWardChange} required>
									<option value="">Chọn xã</option>
									{filteredWards.map((w) => (
										<option key={w.code} value={JSON.stringify(w)}>
											{w.name_with_type}
										</option>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item md={6} xs={12} xl={12}>
							<FormControl isRequired isInvalid={store.address.detailAddress === ''} mb={4}>
								<FormLabel>Địa chỉ chi tiết</FormLabel>
								<Input value={store.address.detailAddress}
									onChange={(e) => {
										const newStore = { ...store };
										newStore.address.detailAddress = e.target.value;
										setStore(newStore);
									}} required />
								<FormErrorMessage>
									detail address is required
								</FormErrorMessage>
							</FormControl>
						</Grid>

					</Grid>
				</Box>

				<Button onClick={handleUpdate} variant="contained" color="primary"
					disabled={isSaveDisabled}
				>
					Lưu thay đổi
				</Button>
			</Card1>}
		</div>
	);
};


AccountSettings.layout = VendorDashboardLayout;

export default AccountSettings;
