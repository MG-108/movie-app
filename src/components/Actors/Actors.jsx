import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ArrowBack, HistoryToggleOff } from '@mui/icons-material';
import useStyles from './styles';

import { useGetActorsDetailsQuery } from '../../services/TMDB';

const Actors = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();

  const { data, isFetching, error } = useGetActorsDetailsQuery(id);
  console.log(data);

  // LOADING
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  // error fetching
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button startIcon={<ArrowBack />} onClick={() => history.goBack()} color="primary">
          Go back
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={5} xl={4}>
        <img
          className={classes.image}
          src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
          alt={data.name}
        />
      </Grid>
    </Grid>
  );
};

export default Actors;
