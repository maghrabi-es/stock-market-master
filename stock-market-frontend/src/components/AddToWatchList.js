import React, { Component } from 'react';
import Modal from './Modal';
import PropTypes from 'prop-types';
import api from '../utils/api';
import Loading from './Loading';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { Check, Done, DoneOutline } from '@material-ui/icons';
import ListItemIcon from '@material-ui/core/ListItemIcon';

class AddToWatchList extends Component {
  state = {
    open: false,
    watchLists: null,
    selectedWatchList: null,
  };
  componentDidMount() {
    this.getWatchLists();
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.stockId) {
      this.setState({
        open: !!nextProps.stockId,
      });
    }
    if (nextProps.currentWatchList) {
      this.setState({
        selectedWatchList: nextProps.currentWatchList.id,
      });
    }
  }

  getWatchLists = () => {
    const { portfolioId } = this.props;

    api.get('/portfolio/' + portfolioId + '/watch-lists').then(({ data }) => {
      this.setState({
        watchLists: data.data,
        selectedWatchList: data.data && data.data.length ? data.data[0].id : null,
      });
    });
  };

  submitForm = () => {
    const { selectedWatchList } = this.state;
    api
      .post('/watch-lists/' + selectedWatchList, {
        stockId: this.props.stockId,
      })
      .then(() => {
        this.setState({
          open: false,
        });
        this.props.onSuccess();
      });
  };

  render() {
    const { open, watchLists, selectedWatchList } = this.state;
    return (
      <div>
        <Modal
          title="Choose Watch list"
          open={open}
          onClose={() => {
            this.setState({
              open: false,
            });
            this.props.onClose();
          }}
          onSubmit={this.submitForm}
        >
          {watchLists ? (
            <List>
              {watchLists.map((watchList) => (
                <ListItem
                  button
                  style={{ minWidth: '400px' }}
                  onClick={() => {
                    this.setState({
                      selectedWatchList: watchList.id,
                    });
                  }}
                >
                  <ListItemIcon>
                    {selectedWatchList === watchList.id ? <DoneOutline color="primary" /> : <Done color="disabled" />}
                  </ListItemIcon>
                  <ListItemText primary={watchList.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Loading />
          )}
        </Modal>
      </div>
    );
  }
}

AddToWatchList.propTypes = {
  portfolioId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  stockId: PropTypes.func.isRequired,
  currentWatchList: PropTypes.number.isRequired,
};

export default AddToWatchList;
