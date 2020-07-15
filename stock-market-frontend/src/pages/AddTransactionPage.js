import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import PageHeader from '../components/PageHeader';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import api from '../utils/api';

class AddTransactionPage extends Component {
  state = {
    transaction: {
      date: '',
      transactionType: '',
      numberOfShares: '',
      price: '',
      fees: '',
    },
  };

  componentDidMount() {}

  onSubmit = (e) => {
    e.preventDefault();
    const { transaction } = this.state;
    const {
      match: { params },
      history,
    } = this.props;

    this.setState({
      submitting: true,
    });

    api.post('/stocks/' + params.id + '/transactions', transaction).then(() => {
      history.push('/stocks/' + params.id);
    });
  };

  onInputChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      transaction: { ...prevState.transaction, [e.target.name]: e.target.value },
    }));
  };

  render() {
    const { history } = this.props;
    const { transaction, submitting } = this.state;
    return (
      <div>
        <NavBar />
        <Box m={2}>
          <Container>
            <PageHeader title="Add Transaction" history={history} />
            <Card>
              <Box m={2}>
                <form onSubmit={this.onSubmit}>
                  <TextField
                    value={transaction.date}
                    label="Date"
                    fullWidth
                    type="date"
                    margin="normal"
                    name="date"
                    onChange={this.onInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl style={{ minWidth: '100%' }} fullWidth margin="normal" required>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={transaction.transactionType}
                      name="transactionType"
                      required
                      onChange={this.onInputChange}
                    >
                      <MenuItem value="Buy">Buy</MenuItem>
                      <MenuItem value="Sell">Sell</MenuItem>
                      <MenuItem value="Dividend">Dividend</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    value={transaction.numberOfShares}
                    label="Number of shares"
                    fullWidth
                    type="number"
                    margin="normal"
                    name="numberOfShares"
                    onChange={this.onInputChange}
                  />
                  <TextField
                    value={transaction.price}
                    label="Total Price"
                    fullWidth
                    required
                    type="number"
                    margin="normal"
                    name="price"
                    onChange={this.onInputChange}
                  />
                  <TextField
                    value={transaction.fees}
                    label="Fees"
                    fullWidth
                    type="number"
                    margin="normal"
                    name="fees"
                    onChange={this.onInputChange}
                  />
                  <Grid justify="center" container>
                    <Box m={3}>
                      <Button type="submit" color="primary" variant="contained" disabled={submitting}>
                        Submit
                      </Button>
                    </Box>
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

export default AddTransactionPage;
