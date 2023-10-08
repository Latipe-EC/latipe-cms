import Box from "../Box";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import DashboardPageHeader from "../layout/DashboardPageHeader";
import TextField from "../text-field/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppThunkDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { getMyAddressById } from "../../store/slices/user-slice";
import provincesData from '../../data/province.json';
import districtsData from '../../data/district.json';
import wardsData from '../../data/ward.json';
import { District, Province, UserAddress, Ward } from "api/interface/user";
import { FormControl, FormErrorMessage, FormLabel, Input, Select } from "@chakra-ui/react";

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

  const provinces: Province[] = provincesData as unknown as Province[];
  const districts: District[] = districtsData as unknown as District[];
  const wards: Ward[] = wardsData as unknown as Ward[];
  const [province, setProvince] = useState<Province>(null);
  const [district, setDistrict] = useState<District>(null);
  const [ward, setWard] = useState<Ward>(null);
  const [phoneError, setPhoneError] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);


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

  const handleFormSubmit = async (values) => {
    console.log(values);
  };

  const handleProvinceChange = (event) => {
    const selectedProvince = JSON.parse(event.target.value);
    setAddress({
      ...address, cityOrProvinceName: selectedProvince.name,
      wardId: null, districtId: null, wardName: '', districtName: '', cityOrProvinceId: selectedProvince.code
    });
    setProvince(selectedProvince);
    setDistrict(null);
    setWard(null);

  };

  const handleWardChange = (event) => {
    const selectedWard = JSON.parse(event.target.value);
    setAddress({
      ...address,
      wardId: selectedWard.code, districtId: null, wardName: selectedWard.name, districtName: ''
    });
    setWard(selectedWard);

  };

  const handleDistrictChange = (event) => {
    const selectedDistrict = JSON.parse(event.target.value);
    setAddress({
      ...address,
      wardId: null, districtId: selectedDistrict.code, wardName: '', districtName: selectedDistrict.name
    });
    setDistrict(selectedDistrict);
    console.log(selectedDistrict);
    setWard(null);

  };
  const handleContactNameChange = (event) => {
    setAddress({ ...address, contactName: event.target.value });
  };

  const handlePhoneChange = (event) => {
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

  const checkoutSchema = yup.object().shape({
    contactName: yup.string().required("required"),
    phone: yup.string().required("required").test(/^[0-9]{10}$/),
    detailAddress: yup.string().required("required"),
    cityOrProvince: yup.string().required("required"),
    district: yup.string().required("required"),
    ward: yup.string().required("required"),
  });

  const handleDetailAddressChange = (event) => {
    setAddress({ ...address, detailAddress: event.target.value });
  };

  const filteredDistricts = Object.values(districts).filter((d) => address && d.parent_code == address.cityOrProvinceId);
  const filteredWards = Object.values(wards).filter((w) => address && w.parent_code == address.districtId);

  return (
    <div>
      <DashboardPageHeader
        iconName="pin_filled"
        title="Add New Address"
        button={
          <a href="/address">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Address
            </Button>
          </a>
        }
      />

      <Card1>

        <form onSubmit={handleFormSubmit}>
          <FormControl isRequired isInvalid={address.contactName === ""}>
            <FormLabel>Contact Name</FormLabel>
            <Input value={address.contactName} onChange={handleContactNameChange} required />
            <FormErrorMessage>contact name is required</FormErrorMessage>
          </FormControl >

          <FormControl isRequired isInvalid={phoneError !== ""}>
            <FormLabel>Phone</FormLabel>
            <Input pattern="[0-9]{10}" value={address.phone} onChange={handlePhoneChange} required />
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
            <Select value={JSON.stringify(district)} onChange={handleDistrictChange} required>
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
            <Select value={JSON.stringify(ward)} onChange={handleWardChange} required>
              <option value="">Select a ward</option>
              {filteredWards.map((w) => (
                <option key={w.code} value={JSON.stringify(w)}>
                  {w.name_with_type}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired isInvalid={address.detailAddress === ''}>
            <FormLabel>Detail Address</FormLabel>
            <Input value={address.detailAddress} onChange={handleDetailAddressChange} required />
            <FormErrorMessage>
              detail address is required
            </FormErrorMessage>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>


      </Card1>
    </div>
  );
};




export default AddressEditor;
