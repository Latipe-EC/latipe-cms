import React, {useEffect, useRef, useState} from "react";
import Button from "../../../src/components/buttons/Button";
import IconButton from "../../../src/components/buttons/IconButton";
import FlexBox from "../../../src/components/FlexBox";
import Icon from "../../../src/components/icon/Icon";
import DashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import Pagination from "../../../src/components/pagination/Pagination";
import TableRow from "../../../src/components/TableRow";
import Typography from "../../../src/components/Typography";
import {ModalHeader, Spinner} from "react-bootstrap";
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
import {AppThunkDispatch, RootState, useAppSelector} from "../../store/store";
import {useDispatch} from "react-redux";
import {addMyAddress, deleteMyAddress, getMyAddress} from "../../store/slices/user-slice";
import {District, Province, Ward} from "api/interface/user";
import {useNavigate} from "react-router-dom";


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
      cityOrProvinceId: province.code,
      cityOrProvinceName: province.name,
      districtId: district.code,
      districtName: district.name,
      wardId: ward.code,
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
            title="My Addresses"
            iconName="pin_filled"
            button={
              <Button color="primary" bg="primary.light" px="2rem"
                      onClick={() => setIsDialogOpen(!isDialogOpen)}>
                Add New Address
              </Button>
            }
        />

        {addresses.map((address) => (
            <TableRow my="1rem" padding="6px 18px">
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
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader style={{
              fontWeight: 'bold',
              fontSize: '20px',
              color: 'gray.800',
              textAlign: "center",
              marginTop: '20px'
            }}>
              Add New Address
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody ref={formRef}>

              <FormControl isRequired isInvalid={contactName === ""}>
                <FormLabel>Contact Name</FormLabel>
                <Input value={contactName} onChange={handleContactNameChange} required/>
                <FormErrorMessage>contact name is required</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={phoneError !== ""}>
                <FormLabel>Phone</FormLabel>
                <Input pattern="[0-9]{10}" value={phone} onChange={handlePhoneChange} required/>
                <FormErrorMessage>{phoneError}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={province === null}>
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

              <FormControl isRequired isInvalid={district === null}>
                <FormLabel>District Name</FormLabel>
                <Select value={JSON.stringify(district)} onChange={handleDistrictChange}
                        disabled={!province} required>
                  <option value="">Select a district</option>
                  {filteredDistricts.map((d) => (
                      <option key={d.code} value={JSON.stringify(d)}>
                        {d.name_with_type}
                      </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={ward === null}>
                <FormLabel>Ward Name</FormLabel>
                <Select value={JSON.stringify(ward)} onChange={handleWardChange}
                        disabled={!district} required>
                  <option value="">Select a ward</option>
                  {filteredWards.map((w) => (
                      <option key={w.code} value={JSON.stringify(w)}>
                        {w.name_with_type}
                      </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={detailAddress === ''}>
                <FormLabel>Detail Address</FormLabel>
                <Input value={detailAddress} onChange={handleDetailAddressChange} required/>
                <FormErrorMessage>
                  detail address is required
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
