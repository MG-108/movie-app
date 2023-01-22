import React from 'react';
import { Typography, Grid, Grow, Tooltip, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

import useStyles from './styles';

const Movie = ({ movie, i }) => {
  const classes = useStyles();

  // Grid:  para ocupar a tela toda 12, metade da tela 6, 1/3 da tela 4,...
  // xl 2 X 6 = 12 to show 6 columns of movies
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} className={classes.movie}>
      {/* ANIMATION TO LOAD BY ONE (grow component) */}
      <Grow in key={i} timeout={(i + 1) * 250}>
        <Link className={classes.links} to={`/movie/${movie.id}`}>
          {/* MOVIE IMAGE */}
          <img
            alt={movie.title}
            className={classes.image}
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : ''}
          />
          {/* MOVIE TITLE */}
          <Typography className={classes.title} variant="h5">
            {movie.title}
          </Typography>
          {/* MOVIE RATING / 2 to show only up to 5 stars */}
          <Tooltip disableTouchListener title={`${movie.vote_average} / 10`}>
            <div>
              <Rating readOnly value={movie.vote_average / 2} precision={0.1} />
            </div>
          </Tooltip>
        </Link>
      </Grow>
    </Grid>
  );
};

export default Movie;
