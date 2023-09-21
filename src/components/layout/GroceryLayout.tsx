import GroceryHeader from "../header/GroceryHeader";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Navbar2 from "../navbar/Navbar2";
import Sticky from "../sticky/Sticky";
import React from "react";
import StyledAppLayout from "./AppLayoutStyle";

type Props = {
  title?: string;
  navbar?: React.ReactChild;
  children?: any;
};

const GroceryLayout: React.FC<Props> = ({
  children,
  title = "React Next.js Ecommerce Template",
}) => (
  <StyledAppLayout>
    <header>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </header>

    <Sticky fixedOn={0}>
      <GroceryHeader />
    </Sticky>

    <div className="section-after-sticky">
      <Navbar2 />
    </div>

    {children}

    <MobileNavigationBar />
  </StyledAppLayout>
);

export default GroceryLayout;
