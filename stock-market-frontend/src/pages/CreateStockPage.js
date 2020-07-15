import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import PageHeader from '../components/PageHeader';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import api from '../utils/api';

class CreateStockPage extends Component {
  state = {
    stock: {
      name: '',
      ticker: '',
      marketPrice: 0,
      numberOfShares: 0,
      costBasis: 0,
    },
    submitting: false,
    portfolio: 0,
  };

  componentDidMount() {
    const { match } = this.props;
    this.setState({
      portfolio: match.params.id,
    });
  }

  onInputChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      stock: { ...prevState.stock, [e.target.name]: e.target.value },
    }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { history } = this.props;

    this.setState({
      submitting: true,
    });

    api.post('/portfolio/' + this.state.portfolio + '/stocks', this.state.stock).then(() => {
      history.push('/portfolio/' + this.state.portfolio);
    });
  };

  render() {
    const { history } = this.props;
    const { stock, submitting } = this.state;
    return (
      <div>
        <NavBar />
        <Box m={2}>
          <Container>
            <PageHeader title="Add a stock" history={history} />
            <Card>
              <form onSubmit={this.onSubmit}>
                <Box m={2}>
                  <TextField
                    value={stock.name}
                    label="Name"
                    required
                    fullWidth
                    margin="normal"
                    name="name"
                    onChange={this.onInputChange}
                  />
                  <TextField
                    value={stock.ticker}
                    label="Ticker"
                    required
                    fullWidth
                    margin="normal"
                    name="ticker"
                    onChange={this.onInputChange}
                  />
                  <TextField
                    value={stock.marketPrice}
                    label="Market Price"
                    fullWidth
                    margin="normal"
                    name="marketPrice"
                    type="number"
                    onChange={this.onInputChange}
                  />
                  <TextField
                    value={stock.numberOfShares}
                    label="Number of shares"
                    type={'number'}
                    fullWidth
                    margin="normal"
                    name="numberOfShares"
                    onChange={this.onInputChange}
                  />
                  <TextField
                    value={stock.costBasis}
                    type="number"
                    label="Cost Basis"
                    fullWidth
                    margin="normal"
                    name="costBasis"
                    onChange={this.onInputChange}
                  />
                  <Grid justify="center" container>
                    <Button color="primary" variant="contained" type="submit" disabled={submitting}>
                      Add Stock
                    </Button>
                  </Grid>
                </Box>
              </form>
            </Card>
          </Container>
        </Box>
      </div>
    );
  }
}

export default CreateStockPage;
