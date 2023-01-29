import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { shades } from "../../theme";

function Footer() {
  const {
    palette: { neutral },
  } = useTheme();
  return (
    <Box marginTop="70px" padding="40px 0" backgroundColor={neutral.light}>
      <Box
        width="80%"
        margin="auto"
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap="30px"
        columnGap="clamp(20px, 30px, 40px)"
      >
        <Box width="clamp(20%, 30%, 40%)">
          <Typography
            variant="h4"
            fontWeight="bold"
            mb="30px"
            color={shades.secondary[500]}
          >
            Ценник.РФ
          </Typography>
          <div>
          Найди свою лучшую цену
          </div>
        </Box>

        <Box>
          <Typography variant="h4" fontWeight="bold" mb="30px">
            Про нас
          </Typography>
          <Typography mb="30px">Политика конфиденциальности</Typography>
          <Typography mb="30px">Условия пользования</Typography>
        </Box>

        <Box>
          <Typography variant="h4" fontWeight="bold" mb="30px">
            Поддержка
          </Typography>
          <Typography mb="30px">Центр поддержки</Typography>
          <Typography mb="30px">Контакты</Typography>
        </Box>

        <Box width="clamp(20%, 25%, 30%)">
          <Typography variant="h4" fontWeight="bold" mb="30px">
            О нас
          </Typography>
          <Typography mb="30px">
            Екатеринбург, 8 марта, 87
          </Typography>
          <Typography mb="30px" sx={{ wordWrap: "break-word" }}>
            Email: kb465@mail.ru
          </Typography>
          <Typography mb="30px"></Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;