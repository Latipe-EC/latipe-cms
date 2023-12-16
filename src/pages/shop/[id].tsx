import {useDispatch} from "react-redux";
import Grid from "../../../src/components/grid/Grid";
import NavbarLayout from "../../../src/components/layout/NavbarLayout";
import ShopIntroCard from "../../../src/components/shop/ShopIntroCard";
import {AppThunkDispatch} from "store/store";
import {useEffect, useState} from "react";
import {getProductStore, getStoreById} from "../../store/slices/stores-slice";
import {PagedResultResponse} from "../../api/interface/PagedResultResponse";
import {ProductStoreResponse, StoreResponse} from "../../api/interface/store";
import StoreProductListCard from "../../components/products/StoreProductCardList";
import {useParams} from "react-router-dom";

const Shop = () => {

  const dispatch = useDispatch<AppThunkDispatch>();
  const [result, setResult] = useState<PagedResultResponse<ProductStoreResponse>>();
  const [currentPage, setCurrentPage] = useState(0);
  const [profileStore, setProfileStore] = useState<StoreResponse>(null);
  const {id} = useParams<{ id: string }>();


  useEffect(() => {
    dispatch(getProductStore(
        {
          id,
          params: {
            skip: currentPage * 12,
            limit: 12,
          }
        })).unwrap().then((res) => {
      if (res.status.toString().startsWith('2')) {
        setResult(res.data);
        return;
      }

    });
    dispatch(getStoreById(id)).unwrap().then((res) => {
      if (res.status.toString().startsWith('2')) {
        setProfileStore(res.data);
        return;
      }

    });
  }, [currentPage]);

  const handlePageChange = (data: number) => {
    setCurrentPage(data);
  };

  return (
      <div>
        {profileStore &&
            <ShopIntroCard store={profileStore}/>}
        <Grid container spacing={6}>
          <Grid item md={12} xs={12}>
            {result &&
                <StoreProductListCard
                    data={result}
                    onChange={handlePageChange}
                />}
          </Grid>
        </Grid>
      </div>
  );
};

Shop.layout = NavbarLayout;

export default Shop;
