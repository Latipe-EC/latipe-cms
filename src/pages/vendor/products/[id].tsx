import { useParams } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import Card from "../../../components/Card";
import DropZone from "../../../components/DropZone";
import Grid from "../../../components/grid/Grid";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import Select from "../../../components/Select";
import TextField from "../../../components/text-field/TextField";
import TextArea from "../../../components/textarea/TextArea";
import { Formik } from "formik";
import * as yup from "yup";

const OrderDetails = () => {

  const handleFormSubmit = async (values) => {
    console.log(values);
  };
  
  const { id } = useParams();
  console.log(id);

  return (
    <div>
      <DashboardPageHeader
        title="Edit Product"
        iconName="delivery-box"
        button={
          <a href="/vendor/products">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Product List
            </Button>
          </a>
        }
      />

      <Card p="30px">
        <Formik
          initialValues={initialValues}
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
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="name"
                    label="Name"
                    placeholder="Name"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name || ""}
                    errorText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Select
                    label="Caterogy"
                    placeholder="Select category"
                    options={[]}
                    value={values.tags || "US"}
                    onChange={(country) => {
                      setFieldValue("tags", country);
                    }}
                    errorText={touched.tags && errors.tags}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DropZone
                    onChange={(files) => {
                      console.log(files);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextArea
                    name="description"
                    label="Description"
                    placeholder="Description"
                    rows={6}
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description || ""}
                    errorText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="stock"
                    label="Stock"
                    placeholder="Stock"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stock || ""}
                    errorText={touched.stock && errors.stock}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="tags"
                    label="Tags"
                    placeholder="Tags"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.tags || ""}
                    errorText={touched.tags && errors.tags}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="price"
                    label="Regular Price"
                    placeholder="Regular Price"
                    type="number"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price || ""}
                    errorText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="sale_price"
                    label="Sale Price"
                    placeholder="Sale Price"
                    type="number"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sale_price || ""}
                    errorText={touched.sale_price && errors.sale_price}
                  />
                </Grid>
              </Grid>
              <Button
                mt="25px"
                variant="contained"
                color="primary"
                type="submit"
              >
                Save product
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

const initialValues = {
  name: "",
  stock: "",
  price: "",
  sale_price: "",
  description: "",
  tags: "",
  category: "",
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  category: yup.string().required("required"),
  description: yup.string().required("required"),
  stock: yup.number().required("required"),
  price: yup.number().required("required"),
  sale_price: yup.number().required("required"),
  tags: yup.object().required("required"),
});

OrderDetails.layout = VendorDashboardLayout;

export default OrderDetails;
