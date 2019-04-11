import React, {PureComponent} from 'react';

export default class CityInfo extends PureComponent {

  _renderFeature = () => {
    const { info, isFeature } = this.props;
    if (isFeature) {
      return (<div>
                {info[0].place_name}
              </div>
      )
    } else {
      return (<div>
        <span><strong>Dirección: </strong>{info.colonia}</span><br/>
        <span><strong>Categoría: </strong>{info.crimeCategory.name}</span><br />
        <span><strong>Descripción: </strong>{info.descripcion}</span>
      </div>)
    }
  }
  render() {
    return (
      <div>
        {this._renderFeature()}
      </div>
    );
  }
}