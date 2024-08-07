import React, { useEffect, useRef, useState } from "react";
import Button from "@components/buttons/Button";
import IconButton from "@components/buttons/IconButton";
import FlexBox from "@components/FlexBox";
import Icon from "@components/icon/Icon";
import DashboardLayout from "@components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import Pagination from "@components/pagination/Pagination";
import TableRow from "@components/TableRow";
import Typography from "@components/Typography";
import { ModalHeader, Spinner } from "react-bootstrap";
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Select,
	useToast
} from "@chakra-ui/react";
import provincesData from '../../data/province.json';
import districtsData from '../../data/district.json';
import wardsData from '../../data/ward.json';
import { AppThunkDispatch, RootState, useAppSelector } from "@stores/store";
import { useDispatch } from "react-redux";
import { addMyAddress, deleteMyAddress, getMyAddress } from "@stores/slices/user-slice";
import { District, Province, Ward } from "@interfaces/user";
import { useNavigate } from "react-router-dom";
import { generateUUID } from "@/utils/utils";


const AddressList = () => {

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [contactName, setContactName] = useState(null);
	const [phone, setPhone] = useState(null);
	const [detailAddress, setDetailAddress] = useState(null);
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const dispatch = useDispatch<AppThunkDispatch>();
	const addresses = useAppSelector((state: RootState) => state.user.dataAddress);
	const totalPage = useAppSelector((state: RootState) => state.user.paginationAddress.total);
	const formRef = useRef(null);
	const navigate = useNavigate();

	// Data
	const provinces: Province[] = provincesData as unknown as Province[];
	const districts: District[] = districtsData as unknown as District[];
	const wards: Ward[] = wardsData as unknown as Ward[];

	const [province, setProvince] = useState<Province>(null);
	const [district, setDistrict] = useState<District>(null);
	const [ward, setWard] = useState<Ward>(null);
	const [phoneError, setPhoneError] = useState("");

	const toast = useToast();

	useEffect(() => {
		// get my address
		dispatch(getMyAddress({
			page: 1,
			size: 5
		}));
	}, []);

	const handleProvinceChange = (event) => {
		const selectedProvince = JSON.parse(event.target.value);
		setProvince(selectedProvince);
		setDistrict(null);
		setWard(null);
	};

	const handleDistrictChange = (event) => {
		const selectedDistrict = JSON.parse(event.target.value);
		setDistrict(selectedDistrict);
		setWard(null);
	};

	const handleWardChange = (event) => {
		const selectedWard = JSON.parse(event.target.value);
		setWard(selectedWard);
	};

	const filteredDistricts = Object.values(districts).filter((d) => province && d.parent_code === province.code);
	const filteredWards = Object.values(wards).filter((w) => district && w.parent_code === district.code);

	const handleContactNameChange = (event) => {
		setContactName(event.target.value);
	};

	const handlePhoneChange = (event) => {
		const phoneRegex = /^[0-9]{10}$/;
		const isValid = phoneRegex.test(event.target.value);
		setPhone(event.target.value);
		setPhoneError(isValid ? "" : "Phone number must be 10 digits");
	};

	useEffect(() => {
		const phoneRegex = /^[0-9]{10}$/;
		setIsSaveDisabled(
			contactName === "" ||
			!phoneRegex.test(phone) ||
			province == null ||
			district == null ||
			ward == null ||
			province.name === "" ||
			district.name === "" ||
			ward.name === "" ||
			detailAddress === ""
		);
	}, [contactName, phone, province, district, ward, detailAddress]);

	const handleRemoveAddress = (value: string) => {

		const loadingToastId = toast({
			title: 'Deleting address.',
			description: <Spinner></Spinner>,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		dispatch(deleteMyAddress(value))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status.toString().includes("20")) {
					toast({
						title: 'Success!',
						description: "Delete address success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				} else {
					const errMsg = res.data.detail.includes("10 addresses") ? "You can only add up to 10 addresses" : "Some thing went wrong"
					toast({
						title: 'Error!',
						description: errMsg,
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			})

	}
	const handleRedirectAddress = (value: string) => {
		navigate(`/address/${value}`)
	}

	const handleDetailAddressChange = (event: {
		target: { value: React.SetStateAction<string>; };
	}) => {
		setDetailAddress(event.target.value);
	};

	const saveAddress = () => {

		const loadingToastId = toast({
			title: 'Adding address.',
			description: "Loading...",
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		dispatch(addMyAddress({
			contactName: contactName,
			phone: phone,
			detailAddress: detailAddress,
			cityOrProvinceId: province.code.toString(),
			cityOrProvinceName: province.name,
			districtId: district.code.toString(),
			districtName: district.name,
			wardId: ward.code.toString(),
			wardName: ward.name,
			countryId: 84,
			countryName: "VietNam"
		}))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status.toString().includes("20")) {
					toast({
						title: 'Success!',
						description: "Add address success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
					setContactName(null);
					setPhone(null);
					setDetailAddress(null);
					setProvince(null);
					setDistrict(null);
					setWard(null);
					setPhoneError(null);
					setIsSaveDisabled(true);
					formRef.current.reset();
				} else {
					const errMsg = res.data.detail.includes("10 addresses") ? "You can only add up to 10 addresses" : "Some thing went wrong"
					toast({
						title: 'Error!',
						description: errMsg,
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			})

		setIsDialogOpen(false);
	}

	return (
		<div>
			<DashboardPageHeader
				title="Địa chỉ của tôi"
				iconName="pin_filled"
				button={
					<Button color="primary" bg="primary.light" px="2rem"
						onClick={() => setIsDialogOpen(!isDialogOpen)}>
						Thêm địa chỉ mới
					</Button>
				}
			/>

			{addresses.map((address) => (
				<TableRow key={generateUUID()} my="1rem" padding="6px 18px">
					<Typography className="pre" m="6px" textAlign="left">
						{address.contactName}
					</Typography>
					<Typography flex="1 1 260px !important" m="6px" textAlign="left">
						{address.detailAddress}
					</Typography>
					<Typography className="pre" m="6px" textAlign="left">
						{address.phone}
					</Typography>

					<Typography className="pre" textAlign="center" color="text.muted">
						<IconButton size="small" onClick={() => handleRedirectAddress(address.id)}>
							<Icon variant="small" defaultcolor="currentColor">
								edit
							</Icon>
						</IconButton>
						<IconButton size="small" onClick={() => handleRemoveAddress(address.id)}>
							<Icon variant="small" defaultcolor="currentColor">
								delete
							</Icon>
						</IconButton>
					</Typography>
				</TableRow>
			))}
			<Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader style={{
						fontWeight: 'bold',
						fontSize: '20px',
						color: 'gray.800',
						textAlign: "center",
						marginTop: '20px'
					}}>
						Thêm địa chỉ mới
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody ref={formRef}>

						<FormControl isRequired isInvalid={contactName === ""}>
							<FormLabel>Tên</FormLabel>
							<Input value={contactName} onChange={handleContactNameChange} required />
							<FormErrorMessage>tên không được trống</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={phoneError !== ""}>
							<FormLabel>Số điện thoại</FormLabel>
							<Input pattern="[0-9]{10}" value={phone} onChange={handlePhoneChange} required />
							<FormErrorMessage>{phoneError}</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={province === null}>
							<FormLabel>Tỉnh/Thành phố</FormLabel>
							<Select value={JSON.stringify(province)} onChange={handleProvinceChange} required>
								<option value="">Chọn tỉnh hoặc thành phố</option>
								{Object.values(provinces).map((p) => (
									<option key={p.code} value={JSON.stringify(p)}>
										{p.name_with_type}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl isRequired isInvalid={district === null}>
							<FormLabel>Tên quận/huyện</FormLabel>
							<Select value={JSON.stringify(district)} onChange={handleDistrictChange}
								disabled={!province} required>
								<option value="">Chọn quận/huyện</option>
								{filteredDistricts.map((d) => (
									<option key={d.code} value={JSON.stringify(d)}>
										{d.name_with_type}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl isRequired isInvalid={ward === null}>
							<FormLabel>Tên xã</FormLabel>
							<Select value={JSON.stringify(ward)} onChange={handleWardChange}
								disabled={!district} required>
								<option value="">Chọn xã</option>
								{filteredWards.map((w) => (
									<option key={w.code} value={JSON.stringify(w)}>
										{w.name_with_type}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl isRequired isInvalid={detailAddress === ''}>
							<FormLabel>Địa chỉ chi tiết</FormLabel>
							<Input value={detailAddress} onChange={handleDetailAddressChange} required />
							<FormErrorMessage>
								Địa chỉ chi tiết không được để trống
							</FormErrorMessage>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' color="red" mr={3} onClick={() => setIsDialogOpen(false)}>
							Close
						</Button>
						<Button variant='ghost' color='green'
							onClick={saveAddress}
							disabled={isSaveDisabled}
						>Save</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<FlexBox justifyContent="center" mt="2.5rem">
				<Pagination
					pageCount={Math.ceil(totalPage / 5)}
					onChange={(data) => {
						dispatch(getMyAddress({
							page: +data + 1,
							size: 5
						}));
					}}
				/>
			</FlexBox>

		</div>
	);
};


AddressList.layout = DashboardLayout;

export default AddressList;
