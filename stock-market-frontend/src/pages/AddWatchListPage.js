import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import PageHeader from '../components/PageHeader';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import api from '../utils/api';

class AddWatchListPage extends Component {
  state = {
    watchList: {
      name: '',
      maxAlertStockPrice: 0,
    },
    submitting: false,
  };

  submitForm = (e) => {
    e.preventDefault();

    this.setState({
      submitting: true,
    });

    api
      .post('/portfolio/' + this.props.match.params.id + '/watch-lists', {
        ...this.state.watchList,
      })
      .then(() => {
        this.props.history.push('/portfolio/' + this.props.match.params.id);
      });
  };

  render() {
    const { watchList, submitting } = this.state;
    return (
      <div>
        <NavBar />
        <Box m={2}>
          <Container>
            <PageHeader title="Add Watch List" history={this.props.history} />
            <Card>
              <Box m={2}>
                <form onSubmit={this.submitForm}>
                  <TextField
                    name="name"
                    label="Name"
                    margin="normal"
                    fullWidth
                    value={watchList.name}
                    onChange={(e) => {
                      e.persist();
                      this.setState((prevState) => {
                        return {
                          watchList: { ...prevState.watchList, name: e.target.value },
                        };
                      });
                    }}
                  />
                  <TextField
                    name="maxAlertStockPrice"
                    label="Alert if stock reaches this market value"
                    margin="normal"
                    fullWidth
                    type="number"
                    value={watchList.maxAlertStockPrice}
                    onChange={(e) => {
                      e.persist();
                      this.setState((prevState) => {
                        return {
                          watchList: { ...prevState.watchList, maxAlertStockPrice: e.target.value },
                        };
                      });
                    }}
                  />
                  <Box m={2}>
                    <Grid justify="center" container>
                      <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                        Create
                      </Button>
                    </Grid>
                  </Box>
                </form>
              </Box>
            </Card>
          </Container>
        </Box>
      </div>
    );
  }
}

export default AddWatchListPage;
