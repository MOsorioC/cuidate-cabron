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
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FolderIcon from '@material-ui/icons/Folder'
import DeleteIcon from '@material-ui/icons/Delete'

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
});

class ReportList extends Component {
  state = {
    myReportList: [],
    error: false,
    success: false,
    message: '',
    dense: false,
    secondary: false,
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

  componentWillMount = () => {
    this._getReportList()
  }

  _renderReportList = () => {
    const { success, myReportList } = this.state

    return success && (myReportList.map((report, key) => {
      return (
          <ListItem button key={key}>
            <ListItemAvatar>
              <Avatar>
                <FolderIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={report.colonia}
              secondary={report.descripcion}
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
      )
    }))
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
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
        </div>
      </Fragment>
    )
  }
}

ReportList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ReportList)