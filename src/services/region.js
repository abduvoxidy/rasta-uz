import { request } from './http-client'
import { useQuery } from 'react-query'
import { requestConstants } from './constants'

export const getRegionByPoint = async (params) =>
  await request.get('regions-by-point', { params })

export const useRegion = ({ regionByPointParams } = {}) => {
  const regionsByPoint = useQuery(
    [requestConstants.GET_REGIONS_BY_POINT],
    () => getRegionByPoint(regionByPointParams),
    { enabled: !!regionByPointParams }
  )

  return {
    regionsByPoint,
  }
}
