import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ArrowBack, HistoryToggleOff } from '@mui/icons-material';

import useStyles from './styles';
import { useGetActorsDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import { MovieList, Pagination } from '..';

const Actors = () => {
  const { id } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const { data, isFetching, error } = useGetActorsDetailsQuery(id);
  const { data: actorMovies, isFetching: loading } = useGetMoviesByActorIdQuery({ id, page });

  // LOADING
  if (isFetching || loading) {
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
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4}>
          {/* ACTOR IMAGE */}
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
            alt={data.name}
          />
        </Grid>
        <Grid
          item
          lg={7}
          xl={8}
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        >
          {/* ACTOR NAME */}
          <Typography variant="h2" gutterBottom>
            {data?.name}
          </Typography>
          {/* ACTOR BIRTHDAY DATE */}
          <Typography variant="h5" gutterBottom>
            Born: {new Date(data?.birthday).toDateString()}
          </Typography>
          {/* ACTOR  BIOGRAPHY */}
          <Typography variant="body1" align="justify" paragraph>
            {data?.biography || 'Sorry, no biography yet ...'}
          </Typography>

          <Box marginTop="2rem" display="flex" justifyContent="space-around">
            {/* BUTTON TO IMDB ACTOR'S PAGE */}
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href={`https://www.imdb.com/name/${data?.imdb_id}`}
            >
              IMDB
            </Button>
            {/* return to MovieInformation */}
            <Button startIcon={<ArrowBack />} onClick={() => history.goBack()} color="primary">
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* MOVIES THAT CURRENT ACTOR WORKED */}
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom align="center">
          Movies
        </Typography>
        {actorMovies && <MovieList movies={actorMovies} numberOfMovies={12} />}
        {/* PAGINATION */}
        <Pagination currentPage={page} setPage={setPage} totalPages={actorMovies?.total_pages} />
      </Box>
    </>
  );
};

export default Actors;
