import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getRegionByPoint } from 'services'
import { setRegionId, setUnavailableDelivery } from 'store/common/commonSlice'
import { store } from 'store/store'
import useGeolocation from './useGeolocation'
import { useGetUser } from './useGetUser'

export function useRegionByPoint() {
  const user = useGetUser()
  const location = useGeolocation()
  const dispatch = useDispatch()
  useEffect(() => {
    getRegionByPoint({
      latitude: user?.address?.location?.lat || location.lat,
      longtitude: user?.address?.location?.long || location.long,
    }).then((res) => {
      if (res.regions && res.regions.length > 0) {
        store.dispatch(setRegionId(res.regions[0].id))
      } else {
        dispatch(setUnavailableDelivery(true))
      }
    })
  }, [user, location])

  return null
}
