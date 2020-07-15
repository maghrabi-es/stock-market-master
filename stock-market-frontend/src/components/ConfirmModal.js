import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

class ConfirmModal extends Component {
  render() {
    const { title, description, open, onReject, onAccept, loading } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <div>
            <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <Box m={2}>
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <Button onClick={onReject} color="primary">
                No
              </Button>
              <Button onClick={onAccept} color="primary" autoFocus>
                Yes
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onReject: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default ConfirmModal;
