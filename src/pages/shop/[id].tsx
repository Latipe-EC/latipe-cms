import FlexBox from "../../../src/components/FlexBox";
import Grid from "../../../src/components/grid/Grid";
import Hidden from "../../../src/components/hidden/Hidden";
import Icon from "../../../src/components/icon/Icon";
import NavbarLayout from "../../../src/components/layout/NavbarLayout";
import ProductCardList from "../../../src/components/products/ProductCard1List";
import ProductFilterCard from "../../../src/components/products/ProductFilterCard";
import ShopIntroCard from "../../../src/components/shop/ShopIntroCard";
import Sidenav from "../../../src/components/sidenav/Sidenav";
import useWindowSize from "../../hooks/useWindowSize";

const Shop = () => {
  const size = useWindowSize();
  const isTablet = size.width < 1025;

  return (
    <div>
      <ShopIntroCard />
      <Grid container spacing={6}>
        <Hidden as={Grid} item md={3} xs={12} down={1024}>
          <ProductFilterCard />
        </Hidden>

        <Grid item md={9} xs={12}>
          {isTablet && (
            <Sidenav
              position="left"
              scroll={true}
              handle={
                <FlexBox justifyContent="flex-end" mb="12px">
                  <Icon>options</Icon>
                </FlexBox>
              }
            >
              <ProductFilterCard />
            </Sidenav>
          )}
          <ProductCardList />
        </Grid>
      </Grid>
    </div>
  );
};

Shop.layout = NavbarLayout;

export default Shop;
