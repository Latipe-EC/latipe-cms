import Card from "../Card";
import {Span} from "../Typography";
import {debounce} from "lodash";
import React, {useCallback, useEffect, useState} from "react";
import Box from "../Box";
import Icon from "../icon/Icon";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import StyledSearchBox from "./SearchBoxStyle";
import {useDispatch} from "react-redux";
import {AppThunkDispatch} from "store/store";
import {autoComplete} from "../../store/slices/search-slice";
import {useNavigate} from "react-router-dom";

export interface SearchBoxProps {
}

const SearchBox: React.FC<SearchBoxProps> = () => {
  const [resultList, setResultList] = useState([]);
  const dispatch = useDispatch<AppThunkDispatch>();
  const navigate = useNavigate();
  const search = debounce((e) => {
    const value = e.target?.value;

    dispatch(autoComplete({keyword: value})).unwrap().then((res) => {
      return setResultList(res.data.productNames);
    });
  }, 200);

  const hanldeSearch = useCallback((event) => {
    event.persist();
    search(event);
  }, []);

  const handleDocumentClick = () => {
    setResultList([]);
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
      <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
        <StyledSearchBox>
          <Icon className="search-icon" size="18px">
            search
          </Icon>
          <TextField
              className="search-field"
              placeholder="Tìm kiếm sản phẩm"
              fullwidth
              onChange={hanldeSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?keyword=${e.target.value}`)
                }
              }}
          />


        </StyledSearchBox>

        {!!resultList.length && (
            <Card
                position="absolute"
                top="100%"
                py="0.5rem"
                width="100%"
                boxShadow="large"
                zIndex={99}
            >
              {resultList.map((item) => (
                  <a href={`/search?keyword=${item.name}`} key={item.name}>
                    <MenuItem key={item}>
                      <Span fontSize="14px">{item.name}</Span>
                    </MenuItem>
                  </a>
              ))}
            </Card>
        )}
      </Box>
  );
};


export default SearchBox;
