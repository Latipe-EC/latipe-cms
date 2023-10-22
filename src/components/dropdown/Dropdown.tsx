import { useState, useEffect } from "react";
import _ from "lodash";
import {
  Input,

} from "@chakra-ui/react";
import Card from "../Card";
import MenuItem from "../MenuItem";
import { Span } from "../Typography";
import { Api } from "../../api/AxiosClient";
import SearchBoxStyle from "../search-box/SearchBoxStyle";

const Dropdown =
  ({ value, onChange, }) => {
    const api = new Api();
    const [options, setOptions] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
      const getCategory = async () => {
        const category = await api.category.getCategory(value.id);
        setName(category.data.name);
      };
      if (value) {
        getCategory();
      }
    });

    const handleSelect = (item) => {
      onChange(item);
      setName(item.name);
      setOptions([]);
    }

    const handleTextChange = _.debounce(async (text) => {
      setName(text);
      if (text.length !== 0) {
        const categories = await api.category.getCategories({
          skip: 0,
          limit: 5,
          name: text,
        })
        setOptions(categories.data.data);
        return;
      }
    });

    return (
      <SearchBoxStyle>
        <Input
          type={"text"}
          value={name}
          autoComplete="off"
          onChange={async (e) => await handleTextChange(e.target.value)}
          id={"dropdownId"}
        />
        {options && !!options.length && (
          <Card
            position="absolute"
            top="100%"
            py="0.5rem"
            width="100%"
            boxShadow="large"
            zIndex={99}
          >
            {options.map((item) => (
              <MenuItem key={item.id} onClick={() => handleSelect(item)}>
                <Span fontSize="14px">{item.name}</Span>
              </MenuItem>
            ))}
          </Card>
        )}
      </SearchBoxStyle>
    );


  }


Dropdown.displayName = "Dropdown";

export default Dropdown;
