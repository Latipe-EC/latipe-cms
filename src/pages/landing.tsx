import Box from "../../src/components/Box";
import Footer from "../../src/components/landing/Footer";
import Section1 from "../../src/components/landing/Section1";
import Section2 from "../../src/components/landing/Section2";
import Section3 from "../../src/components/landing/Section3";
import Section4 from "../../src/components/landing/Section4";
import Section5 from "../../src/components/landing/Section5";

const IndexPage = () => {
  return (
    <Box id="top" overflow="hidden" bg="gray.white">
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </Box>
  );
};

export default IndexPage;
