import { connectionService } from './ConnectionService'

function getMapFeatures() {
  const path = "/reports/map-features"

  return connectionService.get(path)
}

function getReverseGeocoding(lat, long) {
  const path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${process.env.REACT_APP_MAPBOX_KEY}`

  return connectionService.getExternalUrl(path)
}

const MapFeatureService = {
  getMapFeatures,
  getReverseGeocoding
}

export {
  MapFeatureService
}