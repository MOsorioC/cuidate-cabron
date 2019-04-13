import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import HeatMap from './Maps/HeatMap'

import Image from '../img/header-map.jpg'


const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  heroUnit: {
    backgroundImage: `url(${Image})`,
    height: 450,
  },
  heroContent: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 10,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

function loginPage(){
  window.location.href = "/login"
}

function signupPage(){
  window.location.href = "/signup"
}

function HomePage(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography variant="h3" align="left">
              CUIDATE CABRON
            </Typography>
            <Typography variant="h5" align="left" color="textSecondary" paragraph>
              No sabemos cuando será nuestra última fotografía o nuestra última sonrisa.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <Button variant="contained" size="large" color="secondary" onClick={signupPage}>
                    Registrarme
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" size="large" color="secondary" onClick={loginPage}>
                    Ya tengo una cuenta
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={40}>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Localiza la zonas más inseguras del pais
            </Typography>
            <HeatMap />
          </Grid>
        </div>
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Cuidate Cabron
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Por que la vida no la tenemos comprada!
        </Typography>
      </footer>
    </React.Fragment>
  );
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);