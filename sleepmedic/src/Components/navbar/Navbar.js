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
import { useSignOut } from "react-auth-kit";
import navLogo from '../../logo_text_white.svg'
import LanguageSelector from "./LanguageSelector";


import styles from './Navbar.module.css';

const barTheme = createTheme({
    palette: {
      primary: {
        light: '#D9D3E4',
        main: '#7293A0',
        //main: '#2ebcdb',    //darker baby blue, used with baby blue and water blue
        //main: '#58aff5',      //baby blue, used with darker baby blue and water blue
        //main: '#5b6ff5',        //purple-blue, used with muted purple
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
    const logOut = useSignOut();
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        await logOut();
        navigate("/login");
    }
    return (
        <AppBar position="static" theme={barTheme} >
            <Toolbar>
                {/* PUT settings here? */}
                <LanguageSelector/>
                {/* When more buttons added, probably use ButtonGroup for better UI */}
                <IconButton href="/statistics" size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white'}}>
                    <LegendToggleIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white'}} textAlign={'center'}>
                    <Link to="/home" className={styles['noDecorTitles']}>
                        <img src={navLogo} alt="Sleep-Medic Logo" className="logo" style={{height: "3rem", width: "auto", paddingTop: '10px'}}/>
                    </Link>
                </Typography>
                <IconButton href="/profilepage" size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }}>
                    <AccountBoxIcon />
                </IconButton>
                <IconButton size="large" edge="start" aria-label="menu" sx={{ mr: 2, color: 'white' }} onClick={(e) => handleLogout(e)}>
                    <LogoutIcon /> {/* Hide Logout to left menu button??? */}
                </IconButton>    
            </Toolbar>
        </AppBar>
    )
}