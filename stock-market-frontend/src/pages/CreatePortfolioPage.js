import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import api from '../utils/api';
import PageHeader from '../components/PageHeader';

class CreatePortfolioPage extends Component {
  state = {
    name: '',
    submitting: false,
  };

  submitForm = (e) => {
    e.preventDefault();
    const { history } = this.props;

    this.setState({
      submitting: true,
    });

    api.post('/portfolio', { name: this.state.name }).then(() => {
      history.push('/');
    });
  };

  render() {
    const { name, submitting } = this.state;
    return (
      <div>
        <NavBar />
        <Box m={2}>
          <Container>
            <PageHeader title="Create Portfolio" history={this.props.history} />
            <Card>
              <Box m={2}>
                <form onSubmit={this.submitForm}>
                  <TextField
                    label="Name"
                    value={name}
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => {
                      this.setState({
                        name: e.target.value,
                      });
                    }}
                  />
                  <Grid
                    justify="space-between"
                    direction="row"
                    container
                    style={{
                      marginTop: '2em',
                    }}
                  >
                    <Button color="primary" variant="contained" type="submit" disabled={submitting}>
                      Submit
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        this.props.history.push('/');
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </form>
              </Box>
            </Card>
          </Container>
        </Box>
      </div>
    );
  }
}

export default CreatePortfolioPage;
