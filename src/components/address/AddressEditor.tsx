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

const AddressEditor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppThunkDispatch>();
  const [address, setAddress] = useState<UserAddress>(null);

  const provinces: Province[] = provincesData as unknown as Province[];
  const districts: District[] = districtsData as unknown as District[];
  const wards: Ward[] = wardsData as unknown as Ward[];

  const checkoutSchema = yup.object().shape({
    contactName: yup.string().required("required"),
    phone: yup.string().required("required").test(/^[0-9]{10}$/),
    detailAddress: yup.string().required("required"),
    cityOrProvince: yup.string().required("required"),
    district: yup.string().required("required"),
    ward: yup.string().required("required"),
  });

  useEffect(() => {
    dispatch(getMyAddressById(id)).unwrap().then((res) => {
      if (res.status.toString().startsWith('2'))
        setAddress(res.data)
      else {
        window.location.href = '/404'
      }
    })
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

  };

  const handleWardChange = (event) => {
    const selectedWard = JSON.parse(event.target.value);
    setAddress({
      ...address,
      wardId: selectedWard.code, districtId: null, wardName: selectedWard.name, districtName: ''
    });
  };

  const handleDistrictChange = (event) => {
    const selectedDistrict = JSON.parse(event.target.value);
    setAddress({
      ...address,
      wardId: null, districtId: selectedDistrict.code, wardName: '', districtName: selectedDistrict.name
    });
  };

  const filteredDistricts = Object.values(districts).filter((d) => address && d.parent_code === address.cityOrProvinceId);
  const filteredWards = Object.values(wards).filter((w) => address && w.parent_code === address.districtId);

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
        <Formik
          initialValues={address}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box mb="30px">
                <TextField
                  name="contactName"
                  label="Contact Name"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contactName || ""}
                  errorText={touched.contactName && errors.contactName}
                  required
                />
              </Box>
              {/*               
              <Box mb="30px">
                <TextField
                  name="phone"
                  label="Phone"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone || ""}
                  errorText={touched.phone && errors.phone}
                  pattern="[0-9]{10}"
                  required
                />
              </Box>

              <Box mb="30px">
                <TextField
                  name="province"
                  label="City/Province Name"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleProvinceChange}
                  value={JSON.stringify(values.province)}
                  errorText={touched.province && errors.province}
                  required
                >
                  <option value="">Select a province</option>
                  {Object.values(provinces).map((p) => (
                    <option key={p.code} value={JSON.stringify(p)}>
                      {p.name_with_type}
                    </option>
                  ))}
                </TextField>
              </Box>

              <Box mb="30px">
                <TextField
                  name="district"
                  label="District Name"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleDistrictChange}
                  value={JSON.stringify(values.district)}
                  errorText={touched.district && errors.district}
                  required
                  disabled={!values.province}
                >
                  <option value="">Select a district</option>
                  {filteredDistricts.map((d) => (
                    <option key={d.code} value={JSON.stringify(d)}>
                      {d.name_with_type}
                    </option>
                  ))}
                </TextField>
              </Box>

              <Box mb="30px">
                <TextField
                  name="ward"
                  label="Ward Name"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleWardChange}
                  value={JSON.stringify(values.ward)}
                  errorText={touched.ward && errors.ward}
                  required
                  disabled={!values.district}
                >
                  <option value="">Select a ward</option>
                  {filteredWards.map((w) => (
                    <option key={w.code} value={JSON.stringify(w)}>
                      {w.name_with_type}
                    </option>
                  ))}
                </TextField>
              </Box>

              <Box mb="30px">
                <TextField
                  name="detailAddress"
                  label="Detail Address"
                  fullwidth
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.detailAddress}
                  errorText={touched.detailAddress && errors.detailAddress}
                  required
                />
              </Box> */}

              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </div>
  );
};




export default AddressEditor;
