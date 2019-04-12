import { connectionService } from './ConnectionService'

class ReportServices {
  getCrimeList = () => {
    const endPoint = '/reports/crime_list'

    return connectionService.get(endPoint)
  }

  getList = () => {
    const endPoint = '/reports/my_list'
    return connectionService.get(endPoint)
  }

  sendReport = (data) => {
    const endPoint = '/reports/'

    return connectionService.post(endPoint, data)
  }

  getAll = () => {
    const endPoint = '/reports/'

    return connectionService.get(endPoint)
  }

  delete = (id) => {
    const endPoint = '/reports/'

    return connectionService.delete(endPoint, { reportId: id })
  }

}


const reportServices = new ReportServices()

export {reportServices as ReportServices}