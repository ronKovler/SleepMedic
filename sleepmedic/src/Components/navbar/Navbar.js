/*
 * The navigation bar on top of the app
 */


import {Link} from "react-router-dom";
import AppBar from "@mui/material/AppBar"
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { yellow } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';

const barTheme = createTheme({
    palette: {
      primary: {
        light: '#ff7961',
        main: '#ba000d',
        dark: '#ba000d',
        contrastText: '#000',
      },
      info: {
        light: '#000000',
        main: '#000000',
        dark: '#000000',
        contrastText: '#000000',
      }
    },
});

// TOOD: add button event listeners

export default function Navbar() {
    return (
        <AppBar position="static" theme={barTheme} sx={{fontStyle: 'italic',}}>
            <Toolbar>
                {/* PUT settings here? */}
                <IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white'}}>
                    Sleep Medic
                </Typography>
                
                {/* When more buttons added, probably use ButtonGroup for better UI */}
                <IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white'}}>
                    <SignalCellularAltIcon />
                </IconButton>
                <IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }}>
                    <LogoutIcon /> {/* Hide Logout to left menu button??? */}
                </IconButton>

                <IconButton href="/profilepage" size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }}>
                    <AccountBoxIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}