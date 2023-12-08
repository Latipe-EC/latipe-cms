import { useParams } from "react-router-dom";
import Avatar from "../../../components/avatar/Avatar";
import Box from "../../../components/Box";
import Button from "../../../components/buttons/Button";
import IconButton from "../../../components/buttons/IconButton";
import Card from "../../../components/Card";
import Divider from "../../../components/Divider";
import FlexBox from "../../../components/FlexBox";
import Grid from "../../../components/grid/Grid";
import Icon from "../../../components/icon/Icon";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import Select from "../../../components/Select";
import TableRow from "../../../components/TableRow";
import TextField from "../../../components/text-field/TextField";
import TextArea from "../../../components/textarea/TextArea";
import Typography, { H5, H6 } from "../../../components/Typography";
import { format } from "date-fns";
import ProductReview from "components/products/ProductReview";

const RatingVendor = () => {
	const { id } = useParams();

	return (
		<div>
			<DashboardPageHeader
				title="Order Details"
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>
			{product && <ProductReview
				selectedStar={selectedStar}
				setSelectedStar={setSelectedStar}
				rating={product.ratings}
			/>}
		</div>
	);
};



export default RatingVendor;
