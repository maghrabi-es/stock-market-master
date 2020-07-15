import React, { Component } from 'react';
import NavBar from '../components/NavBar';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import api, { getError } from '../utils/api';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { formatDate } from '../utils/Tools';
import PageHeader from '../components/PageHeader';
import { Delete, Edit } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import ConfirmModal from '../components/ConfirmModal';
import ErrorMessage from '../components/ErrorMessage';
import RenamePortfolio from '../components/RenamePortfolio';

class HomePage extends Component {
  state = {
    portfolios: null,
    deletePortfolioId: null,
    deletingPortfolio: false,
    errorMessage: null,
    editPortfolioId: null,
  };
  componentDidMount() {
    this.fetchPortfolios();
  }

  /**
   * Get the list of all portfolios
   */
  fetchPortfolios = () => {
    api
      .get('/portfolio')
      .then(({ data }) => {
        this.setState({
          portfolios: data.data,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: getError(error),
        });
      });
  };

  deletePortfolio = () => {
    this.setState({
      deletingPortfolio: true,
    });
    api
      .delete('/portfolio/' + this.state.deletePortfolioId)
      .then(() => {
        this.setState(
          {
            deletingPortfolio: false,
            deletePortfolioId: null,
          },
          this.fetchPortfolios
        );
      })
      .catch((error) => {
        this.setState({
          errorMessage: getError(error),
          deletingPortfolio: false,
          deletePortfolioId: null,
        });
      });
  };

  displayPortfolios = (portfolios) => {
    return portfolios.length ? (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Portfolio ID</TableCell>
              <TableCell>Portfolio Name</TableCell>
              <TableCell align="right">Total Market Value</TableCell>
              <TableCell align="right">Date Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolios.map((portfolio) => (
              <TableRow hover key={portfolio.id}>
                <TableCell component="th">{portfolio.id}</TableCell>
                <TableCell
                  component="th"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.props.history.push('/portfolio/' + portfolio.id);
                  }}
                >
                  {portfolio.name}
                </TableCell>
                <TableCell align="right">{portfolio.marketValue}</TableCell>
                <TableCell align="right">{formatDate(portfolio.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      this.setState({
                        deletePortfolioId: portfolio.id,
                      });
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      this.setState({
                        editPortfolioId: portfolio.id,
                      });
                    }}
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box m={6}>No portfolios have been created</Box>
    );
  };

  render() {
    const { portfolios } = this.state;
    const { history } = this.props;
    return (
      <div>
        <NavBar />
        <Box m={2}>
          <Container>
            <PageHeader
              title="Portfolios"
              actionButton="Add Portfolio"
              onActionButtonClicked={() => {
                history.push('/createPortfolio');
              }}
            />
            <Grid>
              <Box m={4}>
                <Grid container justify="center">
                  {portfolios ? this.displayPortfolios(portfolios) : <CircularProgress />}
                </Grid>
              </Box>
            </Grid>
          </Container>
          <ConfirmModal
            title="Delete Portfolio"
            description="Are you sure you want to delete this portfolio?"
            open={!!this.state.deletePortfolioId}
            loading={this.state.deletingPortfolio}
            onReject={() => {
              this.setState({
                deletePortfolioId: null,
              });
            }}
            onAccept={this.deletePortfolio}
          />
          <ErrorMessage
            message={this.state.errorMessage}
            onClose={() => {
              this.setState({
                errorMessage: '',
              });
            }}
          />
          <RenamePortfolio
            id={this.state.editPortfolioId}
            onSuccess={() => {
              this.setState({
                editPortfolioId: null,
              });
              this.fetchPortfolios();
            }}
          />
        </Box>
      </div>
    );
  }
}

export default HomePage;
