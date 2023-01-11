import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, useMediaQuery, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { useGetMoviesQuery } from '../../services/TMDB';
import { MovieList } from '..';

const Movies = () => {
  const { data, error, isFetching } = useGetMoviesQuery();

  // para não ocorrer um erro precisa ter loading enquanto esta buscando os dados.
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  // if dont have data
  if (!data.results.length) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <Typography variant="h4">
          No movies that match that name. <br />
          Please search for something else.
        </Typography>
      </Box>
    );
  }

  // error
  if (error) return 'An error has occured';

  return (
    <div>
      <MovieList movies={data} />
    </div>
  );
};

export default Movies;
