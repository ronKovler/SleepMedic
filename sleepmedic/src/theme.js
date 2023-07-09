import { createTheme } from "@mui/material";
import { colors } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
           //main: colors.red[900]
           //main: '#2ebcdb'     //darker baby blue, used with baby blue and water blue
           //main: '#6ad5cb'  //<-- Yunhan
           main:'#7293a0'       //<-- Yunhan #2 //chosen button color
           //main: '#92CCD8'    //<-- Ron#1
           //main: '#436FAB'      //<--- Ron#2
            //main: '#1976d2'
            //main: '#4ab0c7'
            //main: '#64B5F6'
            //main: '#0b5465'
        },
        secondary: {
            main: colors.red[50]
            //main: '#0b5465'
            //main: '#1976d2'
        },
        info: {
            //main: '#64B5F6'
            main: '#b39ddb'
        },
        /*error: {

        },
        warning: {

        },
        info: {

        },
        success: {

        },*/
    },
})

export default theme;