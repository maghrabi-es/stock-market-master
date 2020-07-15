import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import TextField from '@material-ui/core/TextField';
import api from '../utils/api';

class RenamePortfolio extends Component {
  state = {
    open: false,
    name: '',
    submitting: false,
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      open: !!nextProps.id,
      submitting: false,
      name: '',
    });
  }

  submitForm = () => {
    this.setState({
      submitting: true,
    });

    api
      .put('/portfolio/' + this.props.id, {
        name: this.state.name,
      })
      .then(() => {
        this.setState(
          {
            open: false,
            submitting: false,
            name: '',
          },
          this.props.onSuccess
        );
      });
  };

  render() {
    return (
      <div>
        <Modal
          loading={this.state.submitting}
          title="Rename portfolio"
          open={this.state.open}
          onClose={() => {
            this.setState({
              open: false,
            });
          }}
          onSubmit={this.submitForm}
        >
          <form>
            <TextField
              name="name"
              label="Portfolio name"
              margin="normal"
              value={this.state.name}
              onChange={(e) => {
                this.setState({
                  name: e.target.value,
                });
              }}
            />
          </form>
        </Modal>
      </div>
    );
  }
}

RenamePortfolio.propTypes = {
  id: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};

export default RenamePortfolio;
