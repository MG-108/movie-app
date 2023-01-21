import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  bigContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  oneContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      margin: '16px 0',
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  button: {
    margin: '30px 2px',
  },

  pageNumber: {
    margin: '0 20px !important',
    color: theme.palette.text.primary,
  },
}));
