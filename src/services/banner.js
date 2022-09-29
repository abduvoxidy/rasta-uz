import { request } from './http-client'
import { useQuery } from 'react-query'
import { requestConstants } from './constants'
import { format } from 'date-fns'

const getBanners = async (params) =>
  await request.get('banner', {
    params,
    headers: {
      Shipper: '3afb1a9b-fc84-4440-99c6-7bbea8fbea19',
    },
  })

export const useBanner = ({ bannerParams } = {}) => {
  const banners = useQuery(
    [requestConstants.GET_BANNERS, bannerParams],
    () =>
      getBanners({
        ...bannerParams,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      }),
    { enabled: !!(bannerParams && bannerParams.region_id) }
  )

  return {
    banners,
  }
}
