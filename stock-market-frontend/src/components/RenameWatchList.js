import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import TextField from '@material-ui/core/TextField/TextField';
import Box from '@material-ui/core/Box';
import api from '../utils/api';

class RenameWatchList extends Component {
  state = {
    name: '',
    submitting: false,
    open: false,
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.id) {
      this.setState({
        open: !!nextProps.id,
      });
    }
  }

  submitForm = () => {
    this.setState({
      submitting: true,
    });

    api
      .put('/watch-lists/' + this.props.id, {
        name: this.state.name,
      })
      .then(() => {
        this.setState(
          {
            open: false,
          },
          this.props.onSuccess
        );
      });
  };

  render() {
    const { open, name, submitting } = this.state;
    return (
      <div>
        <Modal
          title="Rename watch list"
          open={open}
          onClose={() => {
            this.setState({ open: false });
            this.props.onCancel();
          }}
          onSubmit={this.submitForm}
          loading={submitting}
        >
          <Box m={2}>
            <TextField
              name="name"
              label="Name"
              margin="normal"
              fullWidth
              value={name}
              onChange={(e) => {
                e.persist();
                this.setState((prevState) => {
                  return {
                    name: e.target.value,
                  };
                });
              }}
            />
          </Box>
        </Modal>
      </div>
    );
  }
}

RenameWatchList.propTypes = {
  id: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default RenameWatchList;
