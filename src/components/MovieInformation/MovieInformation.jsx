import React from 'react';

import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useStyles from './styles';

import { useGetMovieQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';

const MovieInformation = () => {
  // to get the id from the url that is coming from movie.id in  Movie Component
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const classes = useStyles();
  console.log(data);

  // LOADING
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  // error fetching
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something has gone wrong go back. </Link>
      </Box>
    );
  }

  // to get only the first 2 number of rating details its 3 because "."
  function getFirstNDigits(number, n) {
    return Number(String(number).slice(0, n));
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4}>
        {/* IMAGE */}
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>

      <Grid item container direction="column" lg={7}>
        {/* MOVIE TITLE AND RELEASE YEAR */}
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]}){/* split to show only the year */}
        </Typography>
        {/* MOVIE TAGLINE */}
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>

        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            {/* RATING in stars */}
            <Rating readOnly value={data.vote_average / 2} />
            {/* RATING in number */}
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {getFirstNDigits(data?.vote_average, 3)} / 10
            </Typography>
          </Box>
          {/* MOVIE LENGTH and MOVIE LANGUAGE */}
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}min
            {data?.spoken_languages.length > 0 ? `/ ${data?.spoken_languages[0].name}` : ''}
          </Typography>
        </Grid>

        {/* GENRES IMAGE AND NAME LINKS */}
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link key={genre.name} className={classes.links} to="/" onClick={() => {}}>
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                className={classes.genreImage}
                height={30}
              />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MovieInformation;
