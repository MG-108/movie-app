import React, { useState, useEffect } from 'react';
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  Rating,
  useMediaQuery,
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

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';

import { MovieList } from '..';
import { userSelector } from '../../features/auth';

const MovieInformation = () => {
  // to get the id from the url that is coming from movie.id in  Movie Component
  const { id } = useParams();
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const classes = useStyles();
  const isMobileOrTablet = useMediaQuery('(max-width:900px)'); // mediaquery from MUI

  const buttonSpacing = isMobileOrTablet ? { marginTop: '20px' } : null;
  const [open, setOpen] = useState(false);

  // data fetching
  const { data, isFetching, error } = useGetMovieQuery(id);

  const { data: recommendations, isFetching: isRecommendationsFetching } =
    useGetRecommendationsQuery({
      list: '/recommendations',
      movie_id: id,
    });

  const { data: favoriteMovies } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const { data: watchlistMovies } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchListed, setIsMovieWatchListed] = useState(false);

  // find if current movie is favorited or not (!! to return a true or false value)
  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  // find if current movie is in watchlisted or not
  useEffect(() => {
    setIsMovieWatchListed(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addMovieTofavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      {
        media_type: 'movie',
        media_id: id,
        favorite: !isMovieFavorited,
      }
    );

    setIsMovieFavorited((prevIsMovieFavorited) => !prevIsMovieFavorited);
  };

  const addMovieToWatchList = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      {
        media_type: 'movie',
        media_id: id,
        watchlist: !isMovieWatchListed,
      }
    );

    setIsMovieWatchListed((prevIsMovieWatchListed) => !prevIsMovieWatchListed);
  };

  // LOADING
  if (isFetching || isRecommendationsFetching) {
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
          {data?.title} ({data?.release_date.split('-')[0]}){/* split to show only the year */}
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
            {data?.runtime}min | Language: {data?.spoken_languages[0]?.name}
          </Typography>
        </Grid>

        {/* GENRES LINKS IMAGE AND NAME  */}
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link
              key={genre?.name}
              className={classes.links}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
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
        {/* OVERVIEW SECTION */}
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>{data?.overview}</Typography>
        {/* TOPCAST SECTION */}
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        {/* Cast --- to only show the characters that got img (character.profile_path &&+ */}
        <Grid item container spacing={2}>
          {data &&
            data.credits?.cast
              ?.map(
                (character, i) =>
                  character.profile_path && (
                    <Grid
                      key={i}
                      item
                      xs={4}
                      md={2}
                      component={Link}
                      to={`/actors/${character.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      {/* CAST IMAGE */}
                      <img
                        className={classes.castImage}
                        src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        alt={character?.name}
                      />
                      {/* CAST NAME */}
                      <Typography color="textPrimary"> {character?.name}</Typography>
                      {/* MOVIE CHARACTER */}
                      <Typography color="textSecondary">
                        {character.character.split('/')[0]}
                      </Typography>
                    </Grid>
                  )
              )
              .slice(0, 6)}
          {/* JUST THE FIRST 6  */}
        </Grid>

        {/* BUTTONS SECTION */}
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="small" variant="outlined">
                {/* MOVIE WEBSITE PAGE */}
                <Button
                  target="_blank"
                  rel="noopener_noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}
                  disabled={!data.homepage}
                >
                  Website
                </Button>
                {/* MOVIE IMDB PAGE */}
                <Button
                  target="_blank"
                  rel="noopener_noreferrer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                {/* MOVIE TRAILER */}
                <Button
                  onClick={() => setOpen(true)}
                  href="#"
                  endIcon={<Theaters />}
                  disabled={!data?.videos?.results}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            {/* BUTTONS SECTION */}
            <Grid item xs={12} sm={6} className={classes.buttonsContainer} style={buttonSpacing}>
              <ButtonGroup size="small" variant="outlined">
                {/* FAVORITE or unFAVORITE */}
                <Button
                  onClick={addMovieTofavorites}
                  endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}
                >
                  {isMovieFavorited ? 'unFavorite' : 'Favorite'}
                </Button>
                {/* WATCHLIST */}
                <Button
                  onClick={addMovieToWatchList}
                  endIcon={isMovieWatchListed ? <Remove /> : <PlusOne />}
                >
                  Watchlist
                </Button>
                {/* BACK */}
                <Button
                  component={Link}
                  to="/"
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}
                >
                  <Typography
                    style={{ textDecoration: 'none' }}
                    color="inherit"
                    variant="subtitle2"
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      {/* MOVIE RECOMENDATION SECTION */}
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {/* reusing MovieList component, passing the new data */}
        {recommendations ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box>Sorry nothing was found.</Box>
        )}
      </Box>
      {/* WHEN TRAILER BUTTON IS CLIKED */}
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results ? (
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${data?.videos?.results[0]?.key}`}
            allow="autoplay"
          />
        ) : null}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
