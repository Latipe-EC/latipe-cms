import Button from "../../../src/components/buttons/Button";
import IconButton from "../../../src/components/buttons/IconButton";
import Card from "../../../src/components/Card";
import FlexBox from "../../../src/components/FlexBox";
import Icon from "../../../src/components/icon/Icon";
import DashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import Pagination from "../../../src/components/pagination/Pagination";
import TableRow from "../../../src/components/TableRow";
import Typography, { H5 } from "../../../src/components/Typography";

const AddressList = () => {
  return (
    <div>
      <DashboardPageHeader
        title="Payment Methods"
        iconName="credit-card_filled"
        button={
          <a href="/payment-methods/add">
            <a>
              <Button color="primary" bg="primary.light" px="2rem">
                Add New Payment Method
              </Button>
            </a>
          </a>
        }
      />

      {orderList.map((item) => (
        <TableRow my="1rem" padding="6px 18px">
          <FlexBox alignItems="center" m="6px">
            <Card width="42px" height="28px" mr="10px" elevation={4}>
              <img
                width="100%"
                src={`/assets/images/payment-methods/${item.payment_method}.svg`}
                alt={item.payment_method}
              />
            </Card>
            <H5 className="pre" m="6px">
              Ralf Edward
            </H5>
          </FlexBox>
          <Typography className="pre" m="6px">
            {item.card_no}
          </Typography>
          <Typography className="pre" m="6px">
            {item.exp}
          </Typography>

          <Typography className="pre" textAlign="center" color="text.muted">
            <a href="/payment-methods/xkssThds6h37sd">
              <Typography
                as="a"
                href="/payment-methods/xkssThds6h37sd"
                color="inherit"
              >
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
    exp: "08 / 2022",
    payment_method: "Amex",
    card_no: "1234 **** **** ****",
  },
  {
    orderNo: "1050017AS",
    exp: "10 / 2025",
    payment_method: "Mastercard",
    card_no: "1234 **** **** ****",
  },
  {
    orderNo: "1050017AS",
    exp: "N/A",
    payment_method: "PayPal",
    card_no: "ui-lib@email.com",
  },
  {
    orderNo: "1050017AS",
    exp: "08 / 2022",
    payment_method: "Visa",
    card_no: "1234 **** **** ****",
  },
];

AddressList.layout = DashboardLayout;

export default AddressList;
