import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

class Modal extends Component {
  render() {
    const { open, title, onClose, loading, onSubmit } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>{this.props.children}</DialogContent>
        <DialogActions>
          {loading ? (
            <Box m={2}>
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button onClick={onSubmit} color="primary" autoFocus>
                Submit
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Modal;
