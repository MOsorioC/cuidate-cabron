import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Toolbar, AppBar, IconButton, Typography, Button, SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Divider} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import MapIcon from '@material-ui/icons/Map'
import PlaceIcon from '@material-ui/icons/Place'
import { userActions } from '../actions/'

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
  list: {
    width: 250,
  }
};


class NavBar extends Component {

  state = {
    left: false,
    goHome: false
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(userActions.logout());
    window.location = '/'
  }

  _goHome = () => {
    window.location = '/'
  }

  _goToProfile = () => {
    window.location = '/user/dashboard/profile'
  }

  _goToMap = () => {
    window.location = '/user/dashboard/'
  }

  _goToMyReports = () => {
    window.location = '/user/dashboard/my-reports'
  }

  _goToNewReport = () => {
    window.location = '/user/dashboard/new-report'
  }



  render() {
    const { classes, user } = this.props

    const sideList = user && (
      <div className={classes.list}>
        <List>
          <ListItem>
            <ListItemText primary={`Hola ${user.nombre}`} />
          </ListItem>
          <ListItem button onClick={this._goToProfile}>
            <ListItemIcon>
              <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary={'Mi Perfil'} />
          </ListItem>
          <ListItem button onClick={this._goToMap}>
            <ListItemIcon>
            <MapIcon/>
            </ListItemIcon>
            <ListItemText primary={'Mapa General'} />
          </ListItem>
          <ListItem button onClick={this._goToNewReport}>
            <ListItemIcon>
              <AddLocationIcon />
            </ListItemIcon>
            <ListItemText primary={'Nuevo Reporte'} />
          </ListItem>
          <ListItem button onClick={this._goToMyReports}>
            <ListItemIcon>
              <PlaceIcon />
            </ListItemIcon>
            <ListItemText primary={'Mis Reportes'} />
          </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button onClick={this.handleLogout}>
              <ListItemIcon><ExitIcon/></ListItemIcon>
            <ListItemText primary='Cerrar Sesión' />
            </ListItem>
        </List>
      </div>
    );

    return(
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            {localStorage.getItem('user') && (<IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer('left', true)}>
              <MenuIcon />
            </IconButton>)}
            <Typography className={classes.grow} variant="h6" color="inherit" noWrap onClick={this._goHome}>
              Cuídate Cabron
            </Typography>
            {localStorage.getItem('user') ? <div></div> : <Button href="/login" color="inherit">Login</Button>}
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    )
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const NavBarPage = withStyles(styles)(NavBar)

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user
  };
}

const connectedNavBarPage = connect(mapStateToProps)(NavBarPage)
export { connectedNavBarPage as NavBar}
