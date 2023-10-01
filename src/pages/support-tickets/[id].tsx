import Avatar from "../../../src/components/avatar/Avatar";
import Box from "../../../src/components/Box";
import Button from "../../../src/components/buttons/Button";
import Divider from "../../../src/components/Divider";
import FlexBox from "../../../src/components/FlexBox";
import DashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import TextArea from "../../../src/components/textarea/TextArea";
import { H5, SemiSpan } from "../../../src/components/Typography";
import { format } from "date-fns";

const PaymentMethodEditor = () => {
  const handleFormSubmit = async (values) => {
    console.log(values);
  };

  return (
    <div>
      <DashboardPageHeader
        iconName="support"
        title="Support Ticket"
        button={
          <a href="/support-tickets">
            <Button color="primary" bg="primary.light" px="2rem">
              Back to Support Ticket
            </Button>
          </a>
        }
      />

      {messageList.map((item, ind) => (
        <FlexBox mb="30px" key={ind}>
          <Avatar src={item.imgUrl} mr="1rem" />
          <Box>
            <H5 fontWeight="600" mt="0px" mb="0px">
              {item.name}
            </H5>
            <SemiSpan>
              {format(new Date(item.date), "hh:mm:a | dd MMM yyyy")}
            </SemiSpan>
            <Box borderRadius="10px" bg="gray.200" p="1rem" mt="1rem">
              {item.text}
            </Box>
          </Box>
        </FlexBox>
      ))}

      <Divider mb="2rem" bg="gray.300" />

      <TextArea
        placeholder="Write your message here..."
        rows={8}
        borderRadius={8}
        fullwidth
        mb="1.5rem"
      />

      <Button
        variant="contained"
        color="primary"
        ml="auto"
        onClick={handleFormSubmit}
      >
        Post message
      </Button>
    </div>
  );
};

const messageList = [
  {
    imgUrl: "/assets/images/faces/face-7.jpg",
    name: "Esther Howard",
    date: "2020-12-14T08:39:58.219Z",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum velit amet, aliquam massa tellus. Condimentum sit at pharetra, congue. Sit mattis amet nec pharetra odio. Interdum lorem vestibulum et amet et duis placerat. Ac mattis massa duis mi tellus sed. Mus eget in fames urna, ornare nunc, tincidunt tincidunt interdum. Amet aliquet pharetra rhoncus scelerisque pulvinar dictumst at sit. Neque tempor tellus ac nullam. Etiam massa tempor eu risus fusce aliquam.",
  },
  {
    imgUrl: "/assets/images/faces/10.jpg",
    name: "Ralph Edwards",
    date: "2021-01-05T05:39:58.219Z",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum velit amet, aliquam massa tellus. Condimentum sit at pharetra, congue. Sit mattis amet nec pharetra odio. Interdum lorem vestibulum et amet et duis placerat.",
  },
  {
    imgUrl: "/assets/images/faces/face-7.jpg",
    name: "Esther Howard",
    date: "2021-01-14T08:39:58.219Z",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nunc, lectus mi ornare. Bibendum proin euismod nibh tellus, phasellus.",
  },
];

PaymentMethodEditor.layout = DashboardLayout;

export default PaymentMethodEditor;
