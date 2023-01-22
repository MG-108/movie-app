import React, { useState, useEffect, useContext } from 'react';
import { AppBar, IconButton, Toolbar, Drawer, Button, Avatar, useMediaQuery } from '@mui/material';
import { Menu, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';

import { ColorModeContext } from '../../utils/ToggleColorMode';
import { setUser, userSelector } from '../../features/auth';
import { Search, Sidebar } from '..';
import { fetchToken, createSessionId, moviesApi } from '../../utils';
import useStyles from './styles';

const NavBar = () => {
  const { isAuthenticated, user } = useSelector(userSelector);

  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:600px)'); // mediaquery from MUI
  const theme = useTheme();
  const dispatch = useDispatch();

  const colorMode = useContext(ColorModeContext);

  const token = localStorage.getItem('request_token');
  const sessionIdFromLocalStorage = localStorage.getItem('session_id');

  useEffect(() => {
    const logInUser = async () => {
      if (token) {
        if (sessionIdFromLocalStorage) {
          const { data: userData } = await moviesApi.get(
            `/account?session_id=${sessionIdFromLocalStorage}`
          );

          dispatch(setUser(userData));
        } else {
          // the first time is this part, we dont have the sessionIdFromLocalStorage yet
          const sessionId = await createSessionId();

          const { data: userData } = await moviesApi.get(`/account?session_id=${sessionId}`);

          dispatch(setUser(userData));
        }
      }
    };

    logInUser();
  }, [token]);

  return (
    <>
      {/* {NavBar SECTION} */}
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {/* MOBILE DEVICES OPEN MENU BUTTON */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              style={{ outline: 'none' }}
              onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          )}

          {/* THEME BUTTON LIGHT OR DARK */}
          <IconButton color="inherit" sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* search on MD and LG devices */}
          {!isMobile && <Search />}

          {/* lOGIN SECTION */}
          <div>
            {!isAuthenticated ? (
              <Button color="inherit" onClick={fetchToken}>
                Login &nbsp; <AccountCircle />
                {/* red is for have a space */}
              </Button>
            ) : (
              <Button
                color="inherit"
                component={Link}
                // id from userSelector
                to={`/profile/${user.id}`}
                className={classes.linkButton}
                onClick={() => {}}
              >
                {/* isAuthenticated on MD and LG devices */}
                {!isMobile && <>My Movies &nbsp;</>}

                <Avatar
                  style={{ width: 30, height: 30 }}
                  alt="Profile"
                  // eslint-disable-next-line max-len
                  src={`https://image.tmdb.org/t/p/original/${user?.avatar?.tmdb?.avatar_path}`}
                />
              </Button>
            )}
          </div>
          {/* search on mobile devices */}
          {isMobile && <Search />}
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <div>
        <nav className={classes.drawer}>
          {/* MOBILE ||| MD and LG devices */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          ) : (
            <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          )}
        </nav>
      </div>
    </>
  );
};

export default NavBar;
