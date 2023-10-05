import React, { useEffect, useState } from "react";
import Button from "../../../src/components/buttons/Button";
import IconButton from "../../../src/components/buttons/IconButton";
import FlexBox from "../../../src/components/FlexBox";
import Icon from "../../../src/components/icon/Icon";
import DashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import Pagination from "../../../src/components/pagination/Pagination";
import TableRow from "../../../src/components/TableRow";
import Typography from "../../../src/components/Typography";
import { ModalHeader } from "react-bootstrap";
import { FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Select, Toast, useToast } from "@chakra-ui/react";
import provincesData from '../../data/province.json';
import districtsData from '../../data/district.json';
import wardsData from '../../data/ward.json';
import { AppThunkDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { addMyAddress } from "../../store/slices/user-slice";
import { District, Province, Ward } from "api/Interface";


const AddressList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const dispatch = useDispatch<AppThunkDispatch>();

  // Data
  const provinces: Province[] = provincesData;
  const districts: District[] = districtsData;
  const wards: Ward[] = wardsData;

  const [province, setProvince] = useState<Province>(null);
  const [district, setDistrict] = useState<District>(null);
  const [ward, setWard] = useState<Ward>(null);

  const toast = useToast()

  const handleProvinceChange = (event) => {
    const selectedProvince = JSON.parse(event.target.value);
    setProvince(selectedProvince);
    setDistrict(null);
    setWard(null);
  };

  const handleDistrictChange = (event) => {
    const selectedDistrict = JSON.parse(event.target.value);
    console.log(selectedDistrict);
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
    setPhone(event.target.value);
  };


  const handleDetailAddressChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setDetailAddress(event.target.value);
  };

  const saveAddress = () => {

    const loadingToastId = toast({
      title: 'Adding address.',
      description: "Loading...",
      status: 'info',
      duration: null,
      isClosable: true,
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
      .then((res) => {
        toast.close(loadingToastId)
        if (!res.error) {
          toast({
            title: 'Success!',
            description: "Add address success",
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: "top-right",
          })
          setContactName("");
          setPhone("");
          setDetailAddress("");
          setProvince(null);
          setDistrict(null);
          setWard(null);
        } else {
          // handle error here
          toast({
            title: 'Error!',
            description: "Some thing went wrong",
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

      {orderList.map(() => (
        <TableRow my="1rem" padding="6px 18px">
          <Typography className="pre" m="6px" textAlign="left">
            Ralf Edward
          </Typography>
          <Typography flex="1 1 260px !important" m="6px" textAlign="left">
            777 Brockton Avenue, Abington MA 2351
          </Typography>
          <Typography className="pre" m="6px" textAlign="left">
            +1927987987498
          </Typography>

          <Typography className="pre" textAlign="center" color="text.muted">
            <a href="/address/xkssThds6h37sd">
              <Typography as="a" href="/address/xkssThds6h37sd" color="inherit">
                <IconButton size="small">
                  <Icon variant="small" defaultcolor="currentColor">
                    edit
                  </Icon>
                </IconButton>
              </Typography>
            </a>
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
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
            fontWeight: 'bold', fontSize: '20px', color: 'gray.800', textAlign: "center", marginTop: '20px'
          }}>
            Add New Address
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Contact Name</FormLabel>
              <Input value={contactName} onChange={handleContactNameChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input value={phone} onChange={handlePhoneChange} />
            </FormControl>
            <FormControl>
              <FormLabel>City/Province Name</FormLabel>
              <Select value={JSON.stringify(province)} onChange={handleProvinceChange}>
                <option value="">Select a province</option>
                {Object.values(provinces).map((p) => (
                  <option key={p.code} value={JSON.stringify(p)}>
                    {p.name_with_type}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>District Name</FormLabel>
              <Select value={JSON.stringify(district)} onChange={handleDistrictChange} disabled={!province}>
                <option value="">Select a district</option>
                {filteredDistricts.map((d) => (
                  <option key={d.code} value={JSON.stringify(d)}>
                    {d.name_with_type}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Ward Name</FormLabel>
              <Select value={JSON.stringify(ward)} onChange={handleWardChange} disabled={!district}>
                <option value="">Select a ward</option>
                {filteredWards.map((w) => (
                  <option key={w.code} value={JSON.stringify(w)}>
                    {w.name_with_type}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Detail Address</FormLabel>
              <Input value={detailAddress} onChange={handleDetailAddressChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' color="red" mr={3} onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button variant='ghost' color='green' onClick={saveAddress}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={5}
          onChange={(data) => {
            console.log(data.selected);
          }}
        />
      </FlexBox>

    </div>
  );
};

const orderList = [
  {
    orderNo: "1050017AS",
    status: "Pending",
    purchaseDate: new Date(),
    price: 350,
  },
  {
    orderNo: "1050017AS",
    status: "Processing",
    purchaseDate: new Date(),
    price: 500,
  },
  {
    orderNo: "1050017AS",
    status: "Delivered",
    purchaseDate: "2020/12/23",
    price: 700,
  },
  {
    orderNo: "1050017AS",
    status: "Delivered",
    purchaseDate: "2020/12/23",
    price: 700,
  },
  {
    orderNo: "1050017AS",
    status: "Cancelled",
    purchaseDate: "2020/12/15",
    price: 300,
  },
];

AddressList.layout = DashboardLayout;

export default AddressList;
