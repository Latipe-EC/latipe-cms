import CheckoutForm2 from "../../src/components/checkout/CheckoutForm2";
import CheckoutSummary2 from "../../src/components/checkout/CheckoutSummary2";
import Container from "../../src/components/Container";
import GroceryLayout from "../../src/components/layout/GroceryLayout";
import Grid from "../components/grid/Grid";

const CheckoutAlternative = () => {
  return (
    <Container my="1.5rem">
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          <CheckoutForm2 />
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <CheckoutSummary2 />
        </Grid>
      </Grid>
    </Container>
  );
};

CheckoutAlternative.layout = GroceryLayout;

export default CheckoutAlternative;
