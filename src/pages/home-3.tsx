import Box from "../../src/components/Box";
import Section10 from "../../src/components/home-3/Section10";
import Section11 from "../../src/components/home-3/Section11";
import Section6 from "../../src/components/home-3/Section6";
import Section7 from "../../src/components/home-3/Section7";
import Section8 from "../../src/components/home-3/Section8";
import Section9 from "../../src/components/home-3/Section9";
import Navbar from "../../src/components/navbar/Navbar";
import { Fragment } from "react";
import Section1 from "../components/home-3/Section1";
import AppLayout from "../components/layout/AppLayout";

const Home3 = () => {
  return (
    <Fragment>
      <Navbar />

      <Box my="2rem">
        <Section1 />
        <Section6 />
        <Section7 />
        <Section8 />
        <Section9 />
        <Section10 />
        <Section11 />
      </Box>
    </Fragment>
  );
};

Home3.layout = AppLayout;

export default Home3;
