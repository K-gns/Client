import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("Все товары");
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery("(min-width:600px)");
  const [favorite, setfavorite] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItems() {
    const items = await fetch(
      "https://getprice.up.railway.app/api/items?populate=image",
      //"http://localhost:1337/api/items?populate=image",
      { method: "GET" }
    );
    const itemsJson = await items?.json();
    dispatch(setItems(itemsJson.data));
  }

  async function getFavorite() {
    const items = await fetch(
      "https://getprice.up.railway.app/api/favourited-items",
      //"http://localhost:1337/api/items?populate=image",
      { method: "GET" }
    );
    const itemsJson = await items?.json();
    setfavorite(itemsJson.data);
  }

  useEffect(() => {
    getItems();
    getFavorite();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const smartphoneItems = items.filter(
    (item) => favorite.find((fav) => fav.attributes?.itemID === item.id) != undefined);
  const appliancesItems = items.filter(
    (item) => item.attributes.category === "Бытовая техника"
  );
  const laptopItems = items.filter(
    (item) => item.attributes.category === "Ноутбуки"
  );

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        Ваши <b>любимые</b> товары
      </Typography>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        <Tab label="Все товары" value="Все товары" />
        <Tab label="Смартфоны" value="Смартфоны" />
        <Tab label="Бытовая техника" value="Бытовая техника" />
        <Tab label="Ноутбуки" value="Ноутбуки" />
      </Tabs>
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === "Все товары" &&
          items.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "Смартфоны" &&
          smartphoneItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "Бытовая техника" &&
          appliancesItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "Ноутбуки" &&
          laptopItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
      </Box>
    </Box>
  );
};

export default ShoppingList;