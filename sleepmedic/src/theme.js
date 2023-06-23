import { createTheme } from "@mui/material";
import { colors } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: colors.red[900]
        },
        secondary: {
            main: colors.red[50]
        },
    },
})

export default theme;