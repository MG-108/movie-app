import React from 'react';
import { Typography, Button } from '@mui/material';

import useStyles from './styles';

const Pagination = ({ currentPage, totalPages, setPage }) => {
  const classes = useStyles();

  // dont have pages
  if (totalPages === 0) return null;

  const handlePrev = () => {
    if (currentPage !== 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage !== totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePageOne = () => {
    if (typeof currentPage === 'number') {
      setPage((prevPage) => 1);
    }
  };

  return (
    <div className={classes.bigContainer}>
      <div className={classes.oneContainer}>
        <Button
          onClick={handlePageOne}
          variant="contained"
          color="primary"
          type="button"
          disabled={currentPage === 1}
          style={{ padding: '4px' }}
        >
          Page&nbsp;1
        </Button>
      </div>
      <div className={classes.paginationContainer}>
        <Button
          onClick={handlePrev}
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Typography variant="h4" className={classes.pageNumber}>
          {currentPage}
        </Typography>
        <Button
          onClick={handleNext}
          className={classes.button}
          variant="contained"
          color="primary"
          type="button"
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
