import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

class PageHeader extends Component {
  render() {
    const { history, actionButton, title, onActionButtonClicked } = this.props;
    return (
      <Grid justify="space-between" container direction="row">
        <div style={{ position: 'relative' }}>
          {history && (
            <IconButton
              style={{ position: 'absolute', left: '-70px', bottom: '0' }}
              onClick={() => {
                history.goBack();
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h4">{title}</Typography>
        </div>
        {actionButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (onActionButtonClicked) {
                onActionButtonClicked();
              }
            }}
          >
            {actionButton}
          </Button>
        )}
      </Grid>
    );
  }
}

PageHeader.propTypes = {
  actionButton: PropTypes.string,
  title: PropTypes.string.isRequired,
  onActionButtonClicked: PropTypes.string,
};

export default PageHeader;
