import Button from "../../../src/components/buttons/Button";
import IconButton from "../../../src/components/buttons/IconButton";
import FlexBox from "../../../src/components/FlexBox";
import Icon from "../../../src/components/icon/Icon";
import DashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import Pagination from "../../../src/components/pagination/Pagination";
import TableRow from "../../../src/components/TableRow";
import Typography from "../../../src/components/Typography";

const AddressList = () => {
  return (
    <div>
      <DashboardPageHeader
        title="My Addresses"
        iconName="pin_filled"
        button={
          <Button color="primary" bg="primary.light" px="2rem">
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
