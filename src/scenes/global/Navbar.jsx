import React, { useState, useRef, Component } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, IconButton, Button, TextField, Typography } from "@mui/material";
import {
  PersonOutline,
  ShoppingBagOutlined,
  MenuOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { shades } from "../../theme";
import { setIsCartOpen } from "../../state";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const valueRef = useRef('')
  const [data, setData] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const sendValue = () => {
    return console.log(valueRef.current.value) //on clicking button accesing current value of TextField and outputing it to console 
  }

  const goSearch = () => {
    return console.log(valueRef.current.value) //on clicking button accesing current value of TextField and outputing it to console 
  }

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000/search/${valueRef.current.value}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();

      const itemId=result.data?.id
      console.log(itemId);

      window.location.replace(`http://127.0.0.1:3000/item/${itemId}`);

      //setData(result);
    } catch (err) {
      console.log("хуй хуй")
      //setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      height="60px"
      backgroundColor="rgba(255, 255, 255, 0.95)"
      color="black"
      position="fixed"
      top="0"
      left="0"
      zIndex="1"
    >
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          onClick={() => navigate("/")}
          sx={{ "&:hover": { cursor: "pointer" } }}
          color={shades.secondary[500]}
        >
          <a fontFamily='Verdana' fontSize="50px">ЦЕННИК.РФ</a>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          columnGap="20px"
          zIndex="2"
        >
          <Box >
            <Popup trigger=
              {<Button variant="contained"> Добавить свой товар </Button>}
              modal nested>
              {
                close => (
                  <Box>
                    <Box className='content' sx={{
                      marginTop: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <Typography variant="h3">
                        Введите название товара (можно с характеристиками):
                      </Typography>
                      <TextField
                        required
                        margin="normal"
                        id="outlined-password-input"
                        label="Название товара"
                        autoComplete="current-password"
                        inputRef={valueRef}
                      />
                      <Button type="submit" variant="contained"
                        sx={{ mt: 3, mb: 2 }} onClick={handleClick}>
                        Добавить
                      </Button>
                      <Button variant="outlined" sx={{ mt: 0, mb: 2 }} onClick=
                        {() => close()}>
                        Закрыть
                      </Button>
                      {isLoading && <h2>Loading...</h2>}
                    </Box>
                  </Box>
                )
              }
            </Popup>
          </Box>


          <IconButton sx={{ color: "black" }}>
            <SearchOutlined />
          </IconButton>
          <IconButton sx={{ color: "black" }}>
            <PersonOutline />
          </IconButton>
          <Badge
            badgeContent={cart.length}
            color="secondary"
            invisible={cart.length === 0}
            sx={{
              "& .MuiBadge-badge": {
                right: 5,
                top: 5,
                padding: "0 4px",
                height: "14px",
                minWidth: "13px",
              },
            }}
          >
          </Badge>
          <IconButton sx={{ color: "black" }}>
            <MenuOutlined />
          </IconButton>

        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;