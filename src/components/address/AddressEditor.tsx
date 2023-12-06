import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import DashboardPageHeader from "../layout/DashboardPageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppThunkDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { getMyAddressById, updateMyAddress } from "../../store/slices/user-slice";
import provincesData from '../../data/province.json';
import districtsData from '../../data/district.json';
import wardsData from '../../data/ward.json';
import { District, Province, UserAddress, Ward } from "api/interface/user";
import { Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, useToast } from "@chakra-ui/react";

const AddressEditor = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppThunkDispatch>();
	const [address, setAddress] = useState<UserAddress>({
		contactName: '',
		detailAddress: '',
		phone: '',
		cityOrProvinceName: '',
		districtName: '',
		wardName: '',
	});
	const toast = useToast();
	const provinces: Province[] = provincesData as unknown as Province[];
	const districts: District[] = districtsData as unknown as District[];
	const wards: Ward[] = wardsData as unknown as Ward[];
	const [province, setProvince] = useState<Province>(null);
	const [district, setDistrict] = useState<District>(null);
	const [ward, setWard] = useState<Ward>(null);
	const [phoneError, setPhoneError] = useState("");
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getMyAddressById(id)).unwrap().then((res) => {
			if (res.status.toString().startsWith('2')) {
				setAddress(res.data)
				setProvince(Object.values(provinces).find(d => d.code == res.data.cityOrProvinceId));
				setDistrict(Object.values(districts).find(d => d.code == res.data.districtId));
				setWard(Object.values(wards).find(w => w.code == res.data.wardId));

				console.log(res.data.wardId);
				console.log(Object.values(wardsData).find(w => parseInt(w.code) == 107));
			}
			else {
				window.location.href = '/404'
			}
		});
	}, []);

	const handleFormSubmit = async (event: { preventDefault: () => void; }) => {
		event.preventDefault();

		const loadingToastId = toast({
			title: 'Adding address.',
			description: "Loading...",
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})

		dispatch(updateMyAddress(address))
			.unwrap()
			.then((res) => {
				toast.close(loadingToastId)
				if (res.status.toString().includes("20")) {
					toast({
						title: 'Success!',
						description: "Update address success",
						status: 'success',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				} else {
					toast({
						title: 'Error!',
						description: "Update address failed",
						status: 'error',
						duration: 2000,
						isClosable: true,
						position: "top-right",
					})
				}
			})
	};

	const handleProvinceChange = (event: { target: { value: string; }; }) => {
		const selectedProvince = JSON.parse(event.target.value);
		setAddress({
			...address, cityOrProvinceName: selectedProvince.name,
			wardId: null, districtId: null, wardName: '', districtName: '', cityOrProvinceId: selectedProvince.code
		});
		setProvince(selectedProvince);
		setDistrict(null);
		setWard(null);

	};

	const handleWardChange = (event: { target: { value: string; }; }) => {
		const selectedWard = JSON.parse(event.target.value);
		setAddress({
			...address,
			wardId: selectedWard.code, wardName: selectedWard.name
		});
		setWard(selectedWard);

	};

	const handleDistrictChange = (event: { target: { value: string; }; }) => {
		const selectedDistrict = JSON.parse(event.target.value);
		setAddress({
			...address,
			wardId: null, districtId: selectedDistrict.code, wardName: '', districtName: selectedDistrict.name
		});
		setDistrict(selectedDistrict);
		console.log(selectedDistrict);
		setWard(null);

	};

	const handleContactNameChange = (event: { target: { value: string; }; }) => {
		setAddress({ ...address, contactName: event.target.value });
	};

	const handlePhoneChange = (event: { target: { value: string; }; }) => {
		const phoneRegex = /^[0-9]{10}$/;
		const isValid = phoneRegex.test(event.target.value);
		setAddress({ ...address, phone: event.target.value });
		setPhoneError(isValid ? "" : "Phone number must be 10 digits");
	};

	useEffect(() => {
		const phoneRegex = /^[0-9]{10}$/;
		setIsSaveDisabled(
			address.contactName === "" ||
			!phoneRegex.test(address.phone) ||
			province == null ||
			district == null ||
			ward == null ||
			province.name === "" ||
			district.name === "" ||
			ward.name === "" ||
			address.detailAddress === ""
		);
	}, [address.contactName, address.phone, province, district, ward, address.detailAddress]);


	const handleDetailAddressChange = (event: { target: { value: string; }; }) => {
		setAddress({ ...address, detailAddress: event.target.value });
	};

	const filteredDistricts = Object.values(districts).filter((d) => address && d.parent_code == address.cityOrProvinceId);
	const filteredWards = Object.values(wards).filter((w) => address && w.parent_code == address.districtId);

	const backToAddresses = () => {
		navigate(-1);
	}

	return (
		<div>
			<DashboardPageHeader
				iconName="pin_filled"
				title="Edit Address"
				button={
					<Button color="primary" bg="primary.light" px="2rem" onClick={backToAddresses}>
						Quay lại
					</Button>
				}
			/>

			<Card1>
				<form onSubmit={handleFormSubmit}>
					<FormControl isRequired isInvalid={address.contactName === ""} mb={4}>
						<FormLabel>Contact Name</FormLabel>
						<Input value={address.contactName} onChange={handleContactNameChange} required />
						<FormErrorMessage>contact name is required</FormErrorMessage>
					</FormControl>

					<FormControl isRequired isInvalid={phoneError !== ""} mb={4}>
						<FormLabel>Phone</FormLabel>
						<Input pattern="[0-9]{10}" value={address.phone} onChange={handlePhoneChange} required />
						<FormErrorMessage>{phoneError}</FormErrorMessage>
					</FormControl>

					<FormControl isRequired isInvalid={province === null} mb={4}>
						<FormLabel>City/Province Name</FormLabel>
						<Select value={JSON.stringify(province)} onChange={handleProvinceChange} required>
							<option value="">Select a province</option>
							{Object.values(provinces).map((p) => (
								<option key={p.code} value={JSON.stringify(p)}>
									{p.name_with_type}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl isRequired isInvalid={district === null} mb={4}>
						<FormLabel>District Name</FormLabel>
						<Select value={JSON.stringify(district)} onChange={handleDistrictChange} required>
							<option value="">Select a district</option>
							{filteredDistricts.map((d) => (
								<option key={d.code} value={JSON.stringify(d)}>
									{d.name_with_type}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl isRequired isInvalid={ward === null} mb={4}>
						<FormLabel>Ward Name</FormLabel>
						<Select value={JSON.stringify(ward)} onChange={handleWardChange} required>
							<option value="">Select a ward</option>
							{filteredWards.map((w) => (
								<option key={w.code} value={JSON.stringify(w)}>
									{w.name_with_type}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl isRequired isInvalid={address.detailAddress === ''} mb={4}>
						<FormLabel>Detail Address</FormLabel>
						<Input value={address.detailAddress} onChange={handleDetailAddressChange} required />
						<FormErrorMessage>
							detail address is required
						</FormErrorMessage>
					</FormControl>

					<Flex justifyContent="flex-end" mt="auto">
						<Button type="submit" variant="contained" color="primary" disabled={isSaveDisabled}>
							Save Changes
						</Button>
					</Flex>
				</form>
			</Card1>
		</div>
	);
};


export default AddressEditor;
