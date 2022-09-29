import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'

export const getDeliveryPrice = async (data) =>
  await request.patch('fares/compute-price', data)

export const useFare = ({ deliveryPriceMutationProps } = {}) => {
  const deliveryPrice = useMutation(
    getDeliveryPrice,
    deliveryPriceMutationProps
  )

  return {
    deliveryPrice,
  }
}
