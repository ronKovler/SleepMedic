/*
 * The navigation bar on top of the app
 */


import {Link, useNavigate} from "react-router-dom";
import AppBar from "@mui/material/AppBar"
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { yellow } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';
import {useCookies} from 'react-cookie';


import styles from './Navbar.module.css';

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
    const [cookies, setCookie, removeCookie] = useCookies(["_auth_state"]);
    const navigate = useNavigate();
    const handleLogout = (e) => {
        removeCookie("_auth_storage");
        removeCookie("_auth_state");
        removeCookie("_auth_type");
        removeCookie("_auth");
        navigate("/login")
    }
    return (
        <AppBar position="static" theme={barTheme} sx={{fontStyle: 'italic',}}>
            <Toolbar>
                {/* PUT settings here? */}
                <IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white'}}>
                    <Link to="/home" className={styles['noDecorTitles']}>Sleep Medic</Link>
                </Typography>
                
                {/* When more buttons added, probably use ButtonGroup for better UI */}
                <IconButton href="/statistics" size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white'}}>
                    <LegendToggleIcon />
                </IconButton>
                <IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }} onClick={(e) => handleLogout(e)}>
                    <LogoutIcon /> {/* Hide Logout to left menu button??? */}
                </IconButton>

                <IconButton href="/profilepage" size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }}>
                    <AccountBoxIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}