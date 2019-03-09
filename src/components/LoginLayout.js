import React, {Component} from 'react'
import {Row , Col} from 'react-materialize'

class LoginLayout extends Component {

  handleFormSubmit = (event) => {
    event.preventDefault()
  }

  render() {
    return(
      <React.Fragment>
        <Row>
          <form onSubmit={this.handleFormSubmit}>
            <Input placeholder="Placeholder" s={6} label="First Name" />
            <Input s={6} label="Last Name" />
            <Input s={12} label="disabled" defaultValue="I am not editable" disabled />
            <Input type="password" label="password" s={12} />
            <Input type="email" label="Email" s={12} />
          </form>
        </Row>
      </React.Fragment>
    )
  }
}