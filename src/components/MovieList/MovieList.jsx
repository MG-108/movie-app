import React from 'react';
import { Grid } from '@mui/material';
import { Movie } from '..';

import useStyles from './styles';

const MovieList = ({ movies }) => {
  const classes = useStyles();
  console.log('movie');

  return (
    <Grid container className={classes.movieContainer}>
      {movies.results.map((movie, index) => (
        <Movie key={index} movie={movie} i={index} />
      ))}
    </Grid>
  );
};

export default MovieList;
