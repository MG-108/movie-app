import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider,
  List,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { useGetGenresQuery } from '../../services/TMDB';
import useStyles from './styles';
import genreIcons from '../../assets/genres';

import blueLogo from '../../assets/images/blueLogo.png';
import redLogo from '../../assets/images/redLogo.png';

const categories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
];
const Sidebar = ({ setMobileOpen }) => {
  const { genreIdOrCategoryName } = useSelector((state) => state.currentGenreOrCategory);
  const theme = useTheme();
  const classes = useStyles();
  const { data, isFetching } = useGetGenresQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    setMobileOpen(false);
  }, [genreIdOrCategoryName]);

  // Selected category or genre
  const [selectedName, setSelectedName] = useState('Popular');
  // (category= label or name )    (id = value or id)
  const handleListItemClick = (event, category, id) => {
    setSelectedName(category);
    dispatch(selectGenreOrCategory(id));
  };

  return (
    <>
      {/* Logo */}
      <Link to="/" className={classes.imageLink}>
        <img
          className={classes.image}
          src={theme.palette.mode === 'light' ? blueLogo : redLogo}
          alt="Filmpire logo"
        />
      </Link>
      <Divider />
      {/* Categories Links */}
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to="/">
            {/* User click on a category: using redux to fetch only the category selected */}
            <ListItemButton
              selected={selectedName === label}
              onClick={(event) => handleListItemClick(event, label, value)}
            >
              {/* icons */}
              <ListItemIcon>
                <img
                  src={genreIcons[label.toLowerCase()]}
                  className={classes.genreImage}
                  height={30}
                />
              </ListItemIcon>
              {/* text */}
              <ListItemText primary={label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {/* Genres Links */}
        <ListSubheader>Genres</ListSubheader>
        {/* LOADING */}
        {isFetching ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          data.genres.map(({ name, id }) => (
            <Link key={name} className={classes.links} to="/">
              {/* User click on a category: using redux to fetch only the category selected */}
              <ListItemButton
                selected={selectedName === name}
                onClick={(event) => handleListItemClick(event, name, id)}
              >
                {/* icons */}
                <ListItemIcon>
                  <img
                    src={genreIcons[name.toLowerCase()]}
                    className={classes.genreImage}
                    height={30}
                  />
                </ListItemIcon>
                {/* text */}
                <ListItemText primary={name} />
              </ListItemButton>
            </Link>
          ))
        )}
      </List>
    </>
  );
};
export default Sidebar;
