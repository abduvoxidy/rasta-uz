import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'
import { format } from 'date-fns'

const getFavourite = async (params) =>
  await request.get('get-favourite', {
    params,
  })

const getFavourites = async (params) =>
  await request.get('favourites', {
    params,
  })

const deleteFavourite = async (id) => await request.delete(`favourites/${id}`)

const createFavourite = async (data) => await request.post('favourites', data)

export const useFavourite = ({
  createMutationProps,
  deleteMutationProps,
  favouriteParams,
  favouriteOneParams,
} = {}) => {
  const createMutation = useMutation(createFavourite, createMutationProps)
  const favourite = useQuery(
    [requestConstants.GET_FAVOURITE],
    () =>
      getFavourite({
        ...favouriteOneParams,
      }),
    {
      enabled: !!(
        favouriteOneParams &&
        favouriteOneParams.user_id &&
        favouriteOneParams.shipper_id
      ),
    }
  )
  const deleteMutation = useMutation(deleteFavourite, deleteMutationProps)
  const favourites = useQuery(
    [requestConstants.GET_FAVOURITES],
    () =>
      getFavourites({
        ...favouriteParams,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      }),
    {
      enabled: !!(favouriteParams && favouriteParams.user_id),
    }
  )
  return {
    createMutation,
    favourite,
    deleteMutation,
    favourites,
  }
}
