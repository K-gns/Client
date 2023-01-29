import { Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material"; //, Button, IconButton,
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
//import DataTable, { createTheme } from "react-data-table-component";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Item from "../../components/Item";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Popup from 'reactjs-popup';
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import axios from "axios";

import { useAuthContext } from "../../context/AuthContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// const images = [{
//   mvideo_icon,
//   eldorado_icon,
//   dns_icon,
//   citilink_icon
// }]


const ItemDetails = () => {
  //const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState("description");
  //const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  //const [itemPrice, setItemPrice] = useState([]);
  const [itemPriceArr, setItemPriceArr] = useState([]);
  const [itemMinPrices, setItemMinPrices] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false)
  const [problem, SetProblem] = useState(null)
  const [problemDesc, SetProblemDesc] = useState(null)

  const { user } = useAuthContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItem() {
    const item = await fetch(
      `https://getprice.up.railway.app/api/items/${itemId}?populate=image`,
      {
        method: "GET",
      }
    );
    const itemJson = await item.json();
    setItem(itemJson.data);
    //console.log(itemJson)
    setIsFavorite(itemJson.data?.attributes?.isFavorite);
  }

  async function getItems() {
    const items = await fetch(
      `https://getprice.up.railway.app/api/items?populate=image`,
      {
        method: "GET",
      }
    );
    const itemsJson = await items.json();
    setItems(itemsJson.data);
  }

  async function getItemPrice() {
    const item = await fetch(
      `https://getprice.up.railway.app/api/item-shop-prices/${itemId}?populate=image`,
      {
        method: "GET",
      }
    );

    const itemPriceJson = await item.json();
    //console.log(itemPriceJson)
    //setItemPrice(itemPriceJson.data);

    const arr = [];
    Object.keys(itemPriceJson.data).forEach(key => arr.push({ name: key, value: itemPriceJson.data[key] }))
    const arr2 = arr.slice(1);

    const priceArray = [
      {
        "shop": "MVIDEO",
        "price": arr2[0].value?.mvideoPrice,
        "link": arr2[0].value?.mvideoLink
      },
      {
        "shop": "ELDORADO",
        "price": arr2[0].value?.eldoradoPrice,
        "link": arr2[0].value?.eldoradoLink
      },
      {
        "shop": "DNS",
        "price": arr2[0].value?.dnsPrice,
        "link": arr2[0].value?.dnsLink
      },
      {
        "shop": "CITILINK",
        "price": arr2[0].value?.citilinkPrice,
        "link": arr2[0].value?.citilinkLink
      }, {
      "shop": "SPCOMPUTER",
        "price": arr2[0].value?.spcomputerPrice,
        "link": arr2[0].value?.spcomputerLink
      }, {
      "shop": "ESMART",
        "price": arr2[0].value?.esmartPrice,
        "link": arr2[0].value?.esmartLink
      }
    ]

    const priceArraySorted = [...priceArray].sort((a, b) => ((a.price < b.price) && (a.price > 0) ? -1 : 1));
    setItemPriceArr(priceArraySorted);
    //console.log("price array=", priceArraySorted);

    //Фетч и график минимальных цен
    const item2 = await fetch(
      `https://getprice.up.railway.app/api/item-time-min-prices/${itemId}?populate=image`,
      {
        method: "GET",
      }
    );

    const itemPriceJson2 = await item2.json();
    const arr3 = [];
    Object.keys(itemPriceJson2.data).forEach(key => arr3.push({ name: key, value: itemPriceJson2.data[key] }))
    const arr4 = arr3.slice(1);

    const current = new Date();
    const today = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

    //console.log("today=", today);


    var priceMinArray = [
      {
        "time": arr4[0].value?.time1,
        "price": arr4[0].value?.price1,
      },
      {
        "time": arr4[0].value?.time3,
        "price": arr4[0].value?.price2
      },
      {
        "time": arr4[0].value?.time2,
        "price": arr4[0].value?.price3
      },
      {
        "time": today,
        "price": priceArraySorted[0]?.price
      }
    ]

    priceMinArray.sort((a, b) => a.time > b.time ? 1 : -1)

    setItemMinPrices(priceMinArray);
  }

  const valueRef = useRef('')
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {

    try {
      axios.post('https://getprice.up.railway.app/api/reports',
        {
          "data": {
            type: problem,
            detailed: problemDesc,
            itemID: itemId
          }
        }
      )
        .then(response => {
          //console.log(response);
        });


    } catch {
      console.log("Ошибка при отправке!")
    } finally {
      setIsLoading(true);
      console.log(isLoading);
    }
  };




  useEffect(() => {
    getItem();
    getItemPrice();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Цена за последнее время:',
      },
    },
    scales: {
      y:
      {
        min: (itemMinPrices[0]?.price * 0.8 / 1000).toFixed() * 1000,
        max: (itemMinPrices[0]?.price * 1.3 / 1000).toFixed() * 1000,
      },
      x:
      {

      },
    },
  };

  //const labels = ['0', '1', '2'];

  const data = {
    labels: itemMinPrices?.map(row => row?.time),
    datasets: [
      {
        label: 'Цена, руб.',
        data: itemMinPrices?.map(row => row?.price),
        fill: true,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',

      }
    ]

  };

  async function addItemToFavourite() {
    console.log("userid", user?.id )
    try {
      axios.post('https://getprice.up.railway.app/api/favourited-items',
        {
          "data": {
            itemID: itemId,
            userID: user?.id,
            isActive: true
          }
        }
      )
        .then(response => {
          console.log(response);
        });

    } catch {
      console.log("Ошибка при отправке!")
    } finally {
      console.log("Добавлелнлнл");
      setIsFavorite(!isFavorite);
    }    
  }


  return (
    <Box width="80%" m="80px auto" >
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        {/* IMAGES */}
        <Box flex="1 1 40%" mb="40px">
          <img
            alt={item?.name}
            width="100%"
            height="100%"
            src={`https://getprice.up.railway.app${item?.attributes?.image?.data?.attributes?.url}`}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* ACTIONS */}
        <Box flex="1 1 50%" mb="40px">
          <Box display="flex" justifyContent="space-between">
            <Box>Главная/Товар</Box>
          </Box>

          <Box m="65px 0 25px 0">
            <Typography variant="h2">{item?.attributes?.name}</Typography>
            <Typography variant="h4" sx={{ mt: "20px" }}>
              {item?.attributes?.longDescription}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3"><b>ЦЕНЫ</b></Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h4"><b>Название магазина</b></Typography></TableCell>
                  <TableCell><Typography variant="h4"><b>Цена</b></Typography></TableCell>
                  <TableCell><Typography variant="h4"><b>Купить (ссылка)</b></Typography></TableCell>
                </TableRow>
              </TableHead>
              {(itemPriceArr.length > 0) ?
                <TableBody>
                  {itemPriceArr.map((item) => (
                    <TableRow key={item.shop}>
                      <TableCell><Typography variant="h4">{item.shop}</Typography></TableCell>
                      <TableCell><Typography variant="h4">{(item.price === 0 || item.price === null) ? "Нет данных" : item.price === 1 ? "Нет в наличии" : item.price}</Typography></TableCell>
                      <TableCell> <a href={item.link}>
                        <img src={require(`../../assets/${item.shop}_icon.png`)} alt="ShopLogo" width="auto" height="50" style={{ maxWidth: 120 }} />
                      </a>
                      </TableCell>
                    </TableRow> 
                  ))}
                </TableBody> :
                <TableBody><TableRow><TableCell><Typography variant="h3" color="red">Данные недоступны</Typography></TableCell></TableRow></TableBody>}
            </Table>

            <br />
            <Box >
              <Popup trigger=
                {<Button style={{ float: 'right' }} variant="text"> Ошибка в данных? Сообщите нам! </Button>}
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
                        <Typography variant="h3" style={{ marginBottom: 30 }}>
                          С чем именно проблема?
                        </Typography>
                        <FormControl style={{ minWidth: 350 }} >
                          <InputLabel id="demo-simple-select-label" style={{ marginTop: 10 }} >Проблема в ...</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value=""
                            label="error"
                            onChange={(e) => {
                              SetProblem(e.target.value);
                            }}
                            style={{ maxWidth: 200 }}

                          >
                            <MenuItem value="price">Цена товара</MenuItem>
                            <MenuItem value="link">Ссылка на товар</MenuItem>
                            <MenuItem value="desc">Описание</MenuItem>
                            <MenuItem value="feature">Характеристики</MenuItem>
                            <MenuItem value="image">Изображение</MenuItem>
                            <MenuItem value="other">Другое..</MenuItem>
                          </Select>
                          <TextField
                            required
                            margin="normal"
                            id="outlined-password-input"
                            label="Опишите проблему.."
                            autoComplete="current-password"
                            inputRef={valueRef}
                            multiline
                            rows={4}
                            onChange={(e) => {
                              SetProblemDesc(e.target.value);
                            }}
                          />
                        </FormControl>

                        <Button type="submit" variant="contained"
                          sx={{ mt: 3, mb: 2 }} onClick={handleSend}>
                          Отправить
                        </Button>
                        <Button variant="outlined" sx={{ mt: 0, mb: 2 }} onClick=
                          {() => close()}>
                          Закрыть
                        </Button>
                        {isLoading && <h2>Готово!</h2>}
                      </Box>
                    </Box>
                  )
                }
              </Popup>
            </Box>


            <Box paddingBottom={3} paddingTop={3}>
              <Typography variant="h3"><b>График изменения цены</b></Typography>
              <Line options={options} data={data} />
            </Box>
            <Box>
              <Box m="20px 0 5px 0" display="flex"
                onClick={() => addItemToFavourite()} style={{
                  cursor: 'pointer'
                }}>
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                <Typography variant="h3" sx={{ ml: "5px" }}>{isFavorite ? "В избранном" : "Добавить в избранное"}</Typography>
              </Box>
              <br />
              <Typography >Товар в категориях: {item?.attributes?.category}</Typography>


            </Box>
          </Box>
        </Box>

        {/* INFORMATION */}
        <Box m="20px 0" >
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Описание" value="description" />
            <Tab label="Отзывы" value="reviews" />
          </Tabs>
        </Box >
        <Box display="flex" flexWrap="wrap" gap="15px">
          {value === "description" && (
            <div>{item?.attributes?.longDescription}</div>
          )}
          {value === "reviews" && (
            <Box>
              <br /><br /><br /><br /><br />

              ЗДЕСЬ БУДУТ ОТЗЫВЫ! ЗДЕСЬ БУДУТ ОТЗЫВЫ ! ЗДЕСЬ БУДУТ ОТЗЫВЫ!
            </Box>)}
        </Box>

        {/* RELATED ITEMS */}
        <Box mt="50px" width="100%">
          <Typography variant="h3" fontWeight="bold">
            Похожие товары
          </Typography>
          <Box
            mt="20px"
            display="flex"
            flexWrap="wrap"
            columnGap="1.33%"
            justifyContent="space-between"
          >
            {items.slice(0, 4).map((item, i) => (
              <Item key={`${item.name}-${i}`} item={item} />
            ))}
          </Box>
        </Box>
      </Box >
    </Box >
  );
};

export default ItemDetails;