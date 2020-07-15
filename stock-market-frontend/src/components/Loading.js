import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

class Loading extends Component {
  render() {
    return (
      <Grid container justify={'center'} alignItems="center" alignContent="center">
        <Box m={6}>
          <CircularProgress />
        </Box>
      </Grid>
    );
  }
}

export default Loading;
