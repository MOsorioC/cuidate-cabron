import React, { Component, Fragment} from 'react'
import { ReportServices } from '../../services/ReportServices'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import Divider from '@material-ui/core/Divider'
import PlaceIcon from '@material-ui/icons/Place'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress'
import MySnackbarContent from '../MySnackbarContent'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    with:'100%'
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    with: '100%'
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  fabButton: {
    margin: theme.spacing.unit
  },
  listItem: {
    margin: theme.spacing.unit * 2
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ReportList extends Component {
  state = {
    myReportList: [],
    err: false,
    success: false,
    message: '',
    dense: false,
    secondary: false,
    open: false,
    reportSelected: null,
    key: null
  }

  _getReportList = () => {
    ReportServices.getList().then(response => {
      if (response.success) {
        this.setState({ err: false, message: '', success: true, myReportList: response.reportList })
      } else {
        this.setState({ err: true, message: response.message, success: false })  
      }
    }).catch(err => {
      this.setState({err: true, message: err.message, success: false})
    })
  }

  _onClickDeleteReport = () => {
    //obtenemos el valor en la lista
    const { reportSelected} = this.state

    if (reportSelected) {
      ReportServices.delete(reportSelected._id).then(response => {
        console.log(response)
        if (response.success) {
          const tempList = this.state.myReportList

          tempList.splice(this.state.key, 1)

          this.setState({ err: false, message: 'Reporte eliminado', success: true, myReportList: tempList, reportSelected: null, key: null})
        } else {
          this.setState({ err: true, message: response.message, success: false, reportSelected: null, key: null })
        }
      }).catch(err => {
        this.setState({ err: true, message: err.message, success: false, reportSelected: null, key: null })
      })
    }
  }

  _onShowModalReport = (e, key) => {
    //obtenemos el valor en la lista
    const report = this.state.myReportList[key]

    if (report) {
      this.setState({open: true, reportSelected: report, key: key})
    }
  }

  _onClickShowReport = (e, key) => {
    const report = this.state.myReportList[key]

    if (report) {
      window.location = `/user/dashboard/update-report/${report._id}`
    }
  }

  _handleClose = () => {
    this.setState({ open: false , reportSelected: null});
  };

  _renderMessage = () => {
    const { classes } = this.props

    const variantMessage = this.state.err ? 'error' : this.state.success ? 'success' : null

    return (variantMessage && this.state.message)&& <MySnackbarContent
      variant={variantMessage}
      className={classes.margin}
      message={this.state.message}
      onClose={() => this.setState({ err: false, message: "", success: true })}
    />
  }

  _renderDialog() {
    const {reportSelected} = this.state

    return reportSelected && (<Dialog
      open={this.state.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={this._handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {`Eliminar este reporte? ${this.state.reportSelected.colonia}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Una vez eliminado no se podra recuperar <br /> ¿Continuar?  
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this._onClickDeleteReport} color="secondary">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>)
  }

  componentWillMount = (e) => {
    this._getReportList()
  }

  _renderReportList = () => {
    const { success, myReportList } = this.state
    const {classes} = this.props

    return success && (myReportList.map((report, key) => {
      return (
        <div key={key}>
          <ListItem button key={key} className={classes.listItem} onClick={event => this._onClickShowReport(event, key)}>
            <ListItemAvatar>
              <Avatar>
                <PlaceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={report.colonia}
              secondary={report.descripcion}
            />
            <ListItemSecondaryAction onClick={event => this._onShowModalReport(event, key)}>
              <Fab color="secondary" aria-label="Delete" className={classes.fabButton}>
                <DeleteIcon />
              </Fab>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider light />
        </div>
      )
    }))
  }

  render() {
    const { classes } = this.props;
    const { reportSelected } = this.state

    return (
      <Fragment>
        {reportSelected &&
          <LinearProgress color="secondary" />}
        <div className={classes.root}>
          <Grid container spacing={16} alignContent='center' alignItems='center' justify='center'>
            <Grid item xs={12} md={8}>
            <Typography variant="h2" className={classes.title}>
              Mi apoyo a la comunidad
            </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <div className={classes.demo}>
                <List dense={false}>
                  {this._renderReportList()}
                </List>
              </div>
            </Grid>
          </Grid>
          {this._renderDialog()}
          {this._renderMessage()}
        </div>
      </Fragment>
    )
  }
}

ReportList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ReportList)