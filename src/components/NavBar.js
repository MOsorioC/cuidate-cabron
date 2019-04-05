import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {Toolbar, AppBar, IconButton, Typography, Button} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class NavBar extends Component {
  

  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props

    return(
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.grow} variant="h6" color="inherit">
              Cuídate Cabron
            </Typography>
            <Button href="/login" color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    )
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
