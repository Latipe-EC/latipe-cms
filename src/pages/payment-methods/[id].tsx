import { useParams } from "react-router-dom";
import Box from "@components/Box";
import Button from "@components/buttons/Button";
import { Card1 } from "@components/Card1";
import Grid from "@components/grid/Grid";
import DashboardLayout from "@components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import TextField from "@components/text-field/TextField";
import { Formik } from "formik";

import * as yup from "yup";

const PaymentMethodEditor = () => {

	const { id } = useParams();

	const handleFormSubmit = async (values) => {
		console.log(values);
	};

	return (
		<div>
			<DashboardPageHeader
				iconName="credit-card_filled"
				title={`${id === "add" ? "Add New" : "Edit"} Payment Method`}
				button={
					<a href="/payment-methods">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>

			<Card1>
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
					}) => (
						<form onSubmit={handleSubmit}>
							<Box mb="30px">
								<Grid container horizontal_spacing={6} vertical_spacing={4}>
									<Grid item md={6} xs={12}>
										<TextField
											name="card_no"
											label="Card Number"
											fullwidth
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.card_no || ""}
											errorText={touched.card_no && errors.card_no}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											name="name"
											label="Name on Card"
											fullwidth
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.name || ""}
											errorText={touched.name && errors.name}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											name="exp"
											label="Exp. Date"
											fullwidth
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.exp || ""}
											errorText={touched.exp && errors.exp}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextField
											name="cvc"
											label="CVC"
											fullwidth
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.cvc || ""}
											errorText={touched.cvc && errors.cvc}
										/>
									</Grid>
								</Grid>
							</Box>

							<Button type="submit" variant="contained" color="primary">
								Lưu thay đổi
							</Button>
						</form>
					)}
				</Formik>
			</Card1>
		</div>
	);
};

const initialValues = {
	card_no: "",
	name: "",
	exp: "",
	cvc: "",
};

const checkoutSchema = yup.object().shape({
	name: yup.string().required("required"),
	card_no: yup.string().required("required"),
	exp: yup.string().required("required"),
	cvc: yup.string().required("required"),
});

PaymentMethodEditor.layout = DashboardLayout;

export default PaymentMethodEditor;
