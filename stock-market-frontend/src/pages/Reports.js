import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import api from '../utils/api';
import PageHeader from '../components/PageHeader';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { ExpandMore } from '@material-ui/icons';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Accordion from '@material-ui/core/Accordion';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

class Reports extends Component {
  state = {
    reports: null,
  };

  componentDidMount() {
    this.fetchReports();
  }

  fetchReports = () => {
    api.get('/statistics').then(({ data }) => {
      this.setState({
        reports: data.data,
      });
    });
  };

  renderPortfolios = () => {
    const {
      reports: { portfolios },
    } = this.state;

    return (
      <div>
        {portfolios.map((portfolio) => {
          return (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>{portfolio.name}</AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'grid', width: '100%' }}>
                  <Box m={2}>
                    <h5>Stocks</h5>
                    {portfolio.stocks.length ? (
                      <Card>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Ticker</TableCell>
                              <TableCell>Total Earnings</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {portfolio.stocks.map((stock) => {
                              return (
                                <TableRow>
                                  <TableCell>{stock.name}</TableCell>
                                  <TableCell>{stock.ticker}</TableCell>
                                  <TableCell>{Number(stock.totalEarnings).toFixed(2)}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Card>
                    ) : (
                      <p>There are no stocks in this portfolio yet</p>
                    )}
                  </Box>
                  <div style={{ display: 'grid', gridAutoFlow: 'column' }}>
                    <Box m={2}>
                      <h5>Market Value</h5>
                      <p>{Number(portfolio.marketValue).toFixed(2)}</p>
                    </Box>
                    <Box m={2}>
                      <h5>Total Earnings</h5>
                      <p>{Number(portfolio.totalEarnings).toFixed(2)}</p>
                    </Box>
                    <Box m={2}>
                      <h5>Amount Invested</h5>
                      <p>{Number(portfolio.amountInvested).toFixed(2)}</p>
                    </Box>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  };

  renderDividends = () => {
    const {
      reports: { annualDividends },
    } = this.state;

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return (
      <div>
        {Object.keys(annualDividends).map((year) => {
          return (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <span>{year}</span>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{display: 'grid'}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {months.map((month) => (
                          <TableCell>{month}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        {months.map((month) => (
                          <TableCell>{annualDividends[year].months[month] || 0}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Box m={2}>
                    <h5>Total Dividends</h5>
                    <p>{Number(annualDividends[year].totalDividends).toFixed(2)}</p>
                  </Box>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  };

  render() {
    const { reports } = this.state;
    return (
      <div>
        <NavBar />
        {reports ? (
          <Box m={2}>
            <Container>
              <PageHeader title="Reports" history={this.props.history} />
              <Box m={2}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                  <Box m={2}>
                    <Card>
                      <Box m={2}>
                        <h4>Amount Invested</h4>
                        <h1>{reports.amountInvested}</h1>
                      </Box>
                    </Card>
                  </Box>
                  <Box m={2}>
                    <Card>
                      <Box m={2}>
                        <h4>Total Earnings</h4>
                        <h1>{reports.totalEarnings}</h1>
                      </Box>
                    </Card>
                  </Box>
                  <Box m={2}>
                    <Card>
                      <Box m={2}>
                        <h4>Dividends Collected</h4>
                        <h1>{reports.dividendCollected}</h1>
                      </Box>
                    </Card>
                  </Box>
                  <Box m={2}>
                    <Card>
                      <Box m={2}>
                        <h4>Current Yield</h4>
                        <h1>{Number(reports.currentYield).toFixed(2)}</h1>
                      </Box>
                    </Card>
                  </Box>
                </div>
              </Box>
              <Box m={2}>
                <h1>Portfolios</h1>
                {reports.portfolios.length ? this.renderPortfolios() : <p>You have not created any portfolios</p>}
              </Box>
              <Box m={2}>
                <h1>Annual Dividends</h1>
                {Object.keys(reports.annualDividends).length ? (
                  this.renderDividends()
                ) : (
                  <p>You have not any dividends</p>
                )}
              </Box>
            </Container>
          </Box>
        ) : (
          <Loading />
        )}
      </div>
    );
  }
}

export default Reports;
