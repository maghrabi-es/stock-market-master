import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';
import Loading from '../components/Loading';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import { Delete, Notifications } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import { formatDate } from '../utils/Tools';

class ViewWatchList extends Component {
  state = {
    watchList: null,
  };

  componentDidMount() {
    this.fetchWatchList();
  }

  fetchWatchList = () => {
    const id = this.props.match.params.id;

    api.get('/watch-lists/' + id).then(({ data }) => {
      this.setState({
        watchList: data.data,
      });
    });
  };

  renderWatchListItems = (stocks) => {
    return stocks.length ? (
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Ticker</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Market Value</TableCell>
              <TableCell align="right">Total Gain/Loss</TableCell>
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
                <TableCell align="right">{Number(stock.marketValue).toFixed(2)}</TableCell>
                <TableCell align="right">{Number(stock.totalGainOrLoss).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    ) : (
      <Card>
        <Box m={2}>There are no items in this watch list</Box>
      </Card>
    );
  };

  renderAlerts = (alerts) => {
    return alerts.length ? (
      <div>
        {alerts.map((alert) => {
          return (
            <Card>
              <Box m={2}>
                <Grid container direction="row" alignItems="center">
                  <Notifications style={{ marginRight: '1em' }} />
                  <div>
                    <p>{alert.message}</p>
                    <span style={{ fontSize: '0.7em' }}>{formatDate(alert.createdAt)}</span>
                  </div>
                </Grid>
              </Box>
            </Card>
          );
        })}
      </div>
    ) : (
      <Card>
        <Box m={2}>There are no alerts in this watch list</Box>
      </Card>
    );
  };

  render() {
    const { watchList } = this.state;
    return (
      <div>
        <NavBar />
        {watchList ? (
          <Box m={2}>
            <Container>
              <PageHeader title={'Watch List - ' + watchList.name} history={this.props.history} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '1em' }}>
                <Box m={2}>
                  <Typography variant={'h5'} style={{ marginBottom: '1em' }}>
                    Items
                  </Typography>
                  {this.renderWatchListItems(watchList.stocks)}
                </Box>
                <Box m={2}>
                  <Typography variant={'h5'} style={{ marginBottom: '1em' }}>
                    Alerts
                  </Typography>
                  {this.renderAlerts(watchList.alerts)}
                </Box>
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

export default ViewWatchList;
