import { connectionService } from './ConnectionService'

function getMapFeatures() {
  const path = "/reports/map-features"

  return connectionService.get(path)
}

const MapFeatureService = {
  getMapFeatures
}

export {
  MapFeatureService
}