import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class ErrorMessage extends Component {
  state = {
    open: true,
  };

  componentDidMount() {
    this.setState({
      open: !!this.props.message,
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.message) {
      this.setState({
        open: true,
      });
    }
  }

  render() {
    const { open } = this.state;
    const { message } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={() => {
            this.setState({
              open: false,
            });
          }}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => {
                  this.setState({
                    open: false,
                  });
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        >
          <Alert
            elevation={0}
            variant="filled"
            onClose={() => {
              this.setState({ open: false });
            }}
            severity="error"
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorMessage;
