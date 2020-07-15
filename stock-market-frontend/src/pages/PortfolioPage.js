import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Loading from '../components/Loading';
import api from '../utils/api';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody';
import PageHeader from '../components/PageHeader';
import Card from '@material-ui/core/Card';
import { Delete, Edit, Visibility, VisibilityOff } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { formatDate } from '../utils/Tools';
import ConfirmModal from '../components/ConfirmModal';
import RenameWatchList from '../components/RenameWatchList';
import AddToWatchList from '../components/AddToWatchList';

class PortfolioPage extends Component {
  state = {
    portfolio: null,
    stocks: null,
    watchLists: null,
    stockToRemove: null,
    watchListToDelete: null,
    watchListToRename: null,
    stockToAddToWatchList: null,
  };

  componentDidMount() {
    this.getPortfolio();
  }

  getPortfolio = async () => {
    const { match } = this.props;
    const portfolio = await api.get('/portfolio/' + match.params.id).then(({ data }) => data.data);
    this.setState(
      {
        portfolio,
      },
      () => {
        this.getStocks();
        this.getWatchLists();
      }
    );
  };

  getStocks = () => {
    if (this.state.portfolio) {
      api.get('/portfolio/' + this.state.portfolio.id + '/stocks').then(({ data }) => {
        this.setState({
          stocks: data.data,
        });
      });
    }
  };

  getWatchLists = () => {
    if (this.state.portfolio) {
      api.get('/portfolio/' + this.state.portfolio.id + '/watch-lists').then(({ data }) => {
        this.setState({
          watchLists: data.data,
        });
      });
    }
  };

  deleteStock = () => {
    api.delete('/stocks/' + this.state.stockToRemove).then(this.getPortfolio);
    this.setState({
      portfolio: null,
      stockToRemove: null,
    });
  };

  deleteWatchList = () => {
    api.delete('/watch-lists/' + this.state.watchListToDelete).then(this.getPortfolio);
    this.setState({
      portfolio: null,
      watchListToDelete: null,
    });
  };

  displayStocks = (stocks) => {
    return (
      <div>
        <div style={{ marginBottom: '2em' }}>These are the available stocks in your portfolio</div>
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Ticker</TableCell>
                <TableCell align="right">Shares</TableCell>
                <TableCell align="right">Cost Basis</TableCell>
                <TableCell align="right">Market Value</TableCell>
                <TableCell align="right">Market Weight</TableCell>
                <TableCell align="right">Dividends</TableCell>
                <TableCell align="right">Total Gain/Loss</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.id} hover>
                  <TableCell>{stock.id}</TableCell>
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      this.props.history.push('/stocks/' + stock.id);
                    }}
                  >
                    {stock.name}
                  </TableCell>
                  <TableCell>{stock.ticker}</TableCell>
                  <TableCell align="right">{stock.numberOfShares}</TableCell>
                  <TableCell align="right">{Number(stock.costBasis).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(stock.marketValue).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(stock.marketWeight).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(stock.dividends).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(stock.totalGainOrLoss).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        this.setState({
                          stockToRemove: stock.id,
                        });
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      title="Watch list"
                      onClick={() => {
                        this.setState({
                          stockToAddToWatchList: stock,
                        });
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  };

  renderWatchLists = (watchLists) => {
    const { history } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Alert when market value exceeds</TableCell>
            <TableCell align="right">Date created</TableCell>
            <TableCell align="right">Number of Items</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {watchLists.map((watchList) => {
            return (
              <TableRow hover>
                <TableCell>{watchList.id}</TableCell>
                <TableCell
                  align="right"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    history.push('/watchList/' + watchList.id);
                  }}
                >
                  {watchList.name}
                </TableCell>
                <TableCell align="right">{Number(watchList.maxAlertStockPrice).toFixed(2)}</TableCell>
                <TableCell align="right">{formatDate(watchList.createdAt)}</TableCell>
                <TableCell align="right">{watchList.stocks ? watchList.stocks.length : 0}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      this.setState({
                        watchListToDelete: watchList.id,
                      });
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      this.setState({
                        watchListToRename: watchList.id,
                      });
                    }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  render() {
    const { history } = this.props;
    const { portfolio, stocks, watchLists, stockToAddToWatchList } = this.state;
    return (
      <div>
        <NavBar />
        <Box m={2}>
          {!portfolio ? (
            <Loading />
          ) : (
            <Box m={2}>
              <Container>
                <PageHeader
                  title={portfolio.name}
                  actionButton="Add Stock"
                  history={history}
                  onActionButtonClicked={() => {
                    history.push('/portfolio/' + portfolio.id + '/addStock');
                  }}
                />
                <Grid>
                  <h2>Stocks</h2>
                  <Box m={4}>
                    {stocks && stocks.length ? (
                      this.displayStocks(stocks)
                    ) : (
                      <Card>
                        <Box m={4}>
                          <div>There are no stocks added in this portfolio</div>
                        </Box>
                      </Card>
                    )}
                  </Box>
                  <PageHeader
                    title="Watch Lists"
                    actionButton="Add watch list"
                    onActionButtonClicked={() => {
                      history.push('/portfolio/' + portfolio.id + '/addWatchList');
                    }}
                  />
                  <Box m={4}>
                    {watchLists && watchLists.length ? (
                      this.renderWatchLists(watchLists)
                    ) : (
                      <Card>
                        <Box m={4}>
                          <div>There are no watch lists added in this portfolio</div>
                        </Box>
                      </Card>
                    )}
                  </Box>
                </Grid>
              </Container>
              <AddToWatchList
                portfolioId={portfolio.id}
                currentWatchList={stockToAddToWatchList ? stockToAddToWatchList.watchList : null}
                onClose={() => {
                  this.setState({
                    stockToAddToWatchList: null,
                  });
                }}
                onSuccess={() => {
                  this.setState({
                    stockToAddToWatchList: null,
                  });
                  this.getWatchLists();
                }}
                stockId={stockToAddToWatchList ? stockToAddToWatchList.id : null}
              />
            </Box>
          )}
        </Box>
        <ConfirmModal
          title="Remove Watch List"
          description="Are you sure you want to remove this watch list?"
          open={this.state.watchListToDelete}
          onReject={() => {
            this.setState({
              watchListToDelete: null,
            });
          }}
          onAccept={this.deleteWatchList}
        />
        <ConfirmModal
          title="Remove Stock"
          description="Are you sure you want to remove this stock?"
          open={this.state.stockToRemove}
          onReject={() => {
            this.setState({
              stockToRemove: null,
            });
          }}
          onAccept={this.deleteStock}
        />
        <RenameWatchList
          id={this.state.watchListToRename}
          onSuccess={() => {
            this.setState({
              watchListToRename: null,
            });
            this.getWatchLists();
          }}
          onCancel={() => {
            this.setState({
              watchListToRename: null,
            });
          }}
        />
      </div>
    );
  }
}

export default PortfolioPage;
