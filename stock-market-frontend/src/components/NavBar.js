import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { TrendingUp } from '@material-ui/icons';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Grid direction="row" container justify="space-between">
            <div>
              <Grid direction="row" container alignItems="center">
                <TrendingUp />
                <Typography
                  style={{ marginLeft: '1em', cursor: 'pointer' }}
                  variant="h6"
                  onClick={() => {
                    window.location.href = '/';
                  }}
                >
                  Stock Portfolio Management System
                </Typography>
              </Grid>
            </div>
            <Button color="inherit">
              <Link to="/reports" style={{ textDecoration: 'none', color: 'white' }}>
                Reports
              </Link>
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
