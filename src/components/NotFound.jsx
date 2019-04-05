import React, {Fragment, Component} from 'react'
import PropTypes from 'prop-types'
import {Grid, withStyles, Button} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'

import dead_link from '../img/dead_link.png'

const styles = {
  content: {
    padding: 20
  }
};

class NotFound extends Component {
  constructor(props) {
    super(props)
  }

  goBack = () => {
    window.history.back()
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>
        <Grid container spacing={16} justify="center" alignItems="center" className={classes.content}>
          <Grid item xs={6} justify="center" alignItems="center">
            <Typography variant="h1" component="h1">
              Ops! 404
            </Typography>
            <Typography variant="h3" gutterBottom>
              You found a dead link :(
            </Typography>
            <img src={dead_link} alt="dead link" />
            <Button onClick={this.goBack} variant="outlined" size="large" color="primary">
                  Go Back
            </Button>
          </Grid>
        </Grid>
      </Fragment>
    )
  }
  
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound)