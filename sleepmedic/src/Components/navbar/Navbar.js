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
import { yellow } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';

const barTheme = createTheme({
    palette: {
      primary: {
        main: yellow[700],
      },
    },
});

// TOOD: add button event listeners

export default function Navbar() {
    return (
        <AppBar position="static" theme={barTheme} sx={{fontStyle: 'italic'}}>
            <Toolbar>
                {/* PUT settings here? */}
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Sleep Medic
                </Typography>
                
                {/* When more buttons added, probably use ButtonGroup for better UI */}
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <SignalCellularAltIcon />
                </IconButton>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <LogoutIcon /> {/* Hide Logout to left menu button??? */}
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}