import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import PageHeader from '../components/PageHeader';
import Loading from '../components/Loading';
import Container from '@material-ui/core/Container';
import api from '../utils/api';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Card from '@material-ui/core/Card';
import TableHead from '@material-ui/core/TableHead';
import { formatDate } from '../utils/Tools';
import Button from '@material-ui/core/Button';

class ViewStockPage extends Component {
  state = {
    stock: null,
  };
  componentDidMount() {
    this.fetchStock();
  }

  fetchStock = () => {
    const { match } = this.props;
    api.get('/stocks/' + match.params.id).then(({ data }) => {
      this.setState({
        stock: data.data,
      });
    });
  };

  render() {
    const { stock } = this.state;
    const { history } = this.props;
    return (
      <div>
        <NavBar />
        {stock ? (
          <Box m={2}>
            <Container>
              <PageHeader
                history={history}
                title={stock.name}
                actionButton="Add Transaction"
                onActionButtonClicked={() => {
                  history.push('/stocks/' + stock.id + '/addTransaction');
                }}
              />
              <div style={{ marginTop: '2em', display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '1em' }}>
                <div>
                  <Typography variant="h5">Stock Information</Typography>
                  <Card>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th">
                            <b>Tinker</b>
                          </TableCell>
                          <TableCell>{stock.ticker}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Market Price</b>
                          </TableCell>
                          <TableCell>{Number(stock.marketPrice).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Number of Shares</b>
                          </TableCell>
                          <TableCell>{stock.numberOfShares}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Cost Basis</b>
                          </TableCell>
                          <TableCell>{Number(stock.costBasis).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Market Value</b>
                          </TableCell>
                          <TableCell>{Number(stock.marketValue).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Market Weight</b>
                          </TableCell>
                          <TableCell>{Number(stock.marketWeight).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Cost per share</b>
                          </TableCell>
                          <TableCell>{Number(stock.costPerShare).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Unrealized Gain or Loss</b>
                          </TableCell>
                          <TableCell>{Number(stock.unrealizedGainOrLoss).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Percentage Unrealized Gain or Loss</b>
                          </TableCell>
                          <TableCell>{Number(stock.unrealizedGainOrLossPercentage).toFixed(2)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Realized Gain or Loss</b>
                          </TableCell>
                          <TableCell>{Number(stock.realizedGainOrLoss).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Percentage realized gain or loss</b>
                          </TableCell>
                          <TableCell>{Number(stock.realizedGainOrLossPercentage).toFixed(2)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Dividends Collected</b>
                          </TableCell>
                          <TableCell>{Number(stock.dividends).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Total Gain or Loss</b>
                          </TableCell>
                          <TableCell>{Number(stock.totalGainOrLoss).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">
                            <b>Dividends %</b>
                          </TableCell>
                          <TableCell>{Number(stock.dividendsPercentage).toFixed(2)}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                </div>
                <div>
                  <Typography variant="h5">Transactions</Typography>
                  <Card>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Shares</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Fees</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stock.transactions.map((transaction) => (
                          <TableRow>
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{transaction.transactionType}</TableCell>
                            <TableCell>{transaction.numberOfShares || '--'}</TableCell>
                            <TableCell>{Number(transaction.price).toFixed(2)}</TableCell>
                            <TableCell>{Number(transaction.fees).toFixed(2)}</TableCell>
                            <TableCell>{formatDate(transaction.date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </div>
            </Container>
          </Box>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

export default ViewStockPage;
