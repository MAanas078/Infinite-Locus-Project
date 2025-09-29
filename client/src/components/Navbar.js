import React, { useState } from 'react';
import { setConstraint } from '../constraints';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { Button, Menu, MenuItem, Stack, useMediaQuery, useTheme, IconButton, Drawer, Box, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

function Navbar() {
  const token = window.localStorage.getItem('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const signout = () => {
    setConstraint(false);
    console.log('Signed out !');
    localStorage.clear();
    window.location.href = '/log-in';
  };

  const buttonStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'none',
    color: 'black',
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: 'primary.main',
      backgroundColor: 'transparent',
    },
    '&:focus': {
      color: 'primary.main',
    },
  };

  const drawerContent = (
    <Box sx={{ width: 250, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MuiLink component={RouterLink} to="/" underline="none" sx={{ ...buttonStyle, fontSize: '1.2rem' }} onClick={toggleDrawer(false)}>Home</MuiLink>
      <MuiLink component={RouterLink} to={token ? '/LostItems' : '/log-in'} underline="none" sx={{ ...buttonStyle, fontSize: '1.2rem' }} onClick={toggleDrawer(false)}>Lost Items</MuiLink>
      <MuiLink component={RouterLink} to={token ? '/FoundItems' : '/log-in'} underline="none" sx={{ ...buttonStyle, fontSize: '1.2rem' }} onClick={toggleDrawer(false)}>Found Items</MuiLink>
      {token && <MuiLink component={RouterLink} to="/postitem" underline="none" sx={{ ...buttonStyle, fontSize: '1.2rem' }} onClick={toggleDrawer(false)}>Post Item</MuiLink>}
      {token && <MuiLink component={RouterLink} to="/mylistings" underline="none" sx={{ ...buttonStyle, fontSize: '1.2rem' }} onClick={toggleDrawer(false)}>My Listings</MuiLink>}
      {token ? (
        <Button variant="contained" onClick={signout} sx={{ mt: 2, textTransform: 'none' }}>Logout</Button>
      ) : (
        <>
          <MuiLink component={RouterLink} to="/admin" underline="none" sx={{ ...buttonStyle, fontSize: '1.2rem' }} onClick={toggleDrawer(false)}>Admin</MuiLink>
          <Button variant="contained" component={RouterLink} to="/log-in" sx={{ mt: 2, textTransform: 'none' }}>Login</Button>
          <Button variant="contained" component={RouterLink} to="/sign-up" sx={{ textTransform: 'none' }}>Sign Up</Button>
        </>
      )}
    </Box>
  );

  return (
    <Stack
      width="100%"
      maxWidth="1440px"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="0 0 20px 20px"
      px={{ xs: 2, sm: 5, md: 5 }}
      zIndex={20}
      sx={{ backgroundColor: '#F6F8F8' }}
      mb="10px"
    >
      <RouterLink to="/">
        <Stack maxWidth="180px">
          <img
            src="https://i.ibb.co/G2851XX/Main-Logo-1.png"
            alt="logo"
            width="100%"
          />
        </Stack>
      </RouterLink>

      {isMobile ? (
        <>
          <IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Stack direction="row" gap="38px" alignItems="center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4 }}>
            <Button component={RouterLink} to="/" sx={buttonStyle} disableRipple>Home</Button>
          </motion.div>

          <Stack>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4 }}>
              <Button
                id="items-browser-button"
                aria-controls={open ? 'items-browser-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={buttonStyle}
                endIcon={<BsFillCaretDownFill size="15px" />}
                disableRipple
              >
                Items Browser
              </Button>
            </motion.div>
            <Menu
              id="items-browser-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'items-browser-button' }}
            >
              <MenuItem component={RouterLink} to={token ? '/LostItems' : '/log-in'} onClick={handleClose}>
                Lost Items
              </MenuItem>
              <MenuItem component={RouterLink} to={token ? '/FoundItems' : '/log-in'} onClick={handleClose}>
                Found Items
              </MenuItem>
            </Menu>
          </Stack>

          {token ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4 }}>
                <Button component={RouterLink} to="/postitem" sx={buttonStyle} disableRipple>Post Item</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.4 }}>
                <Button component={RouterLink} to="/mylistings" sx={buttonStyle} disableRipple>My Listings</Button>
              </motion.div>
              <Button variant="contained" onClick={signout} sx={{ textTransform: 'none', px: '30px' }} disableRipple>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="contained" component={RouterLink} to="/admin" sx={{ textTransform: 'none', px: '30px' }} disableRipple>Admin</Button>
              <Button variant="contained" component={RouterLink} to="/log-in" sx={{ textTransform: 'none', px: '30px' }} disableRipple>Login</Button>
              <Button variant="contained" component={RouterLink} to="/sign-up" sx={{ textTransform: 'none', px: '30px' }} disableRipple>Sign Up</Button>
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export default Navbar;