import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'

const createAddress = async (data) =>
  await request.post('customer_address', data)
const updateAddress = async (data) =>
  await request.patch(`customer_address/${data.id}/set_selected`, data, {
    params: {
      customer_id: data.customer_id,
    },
  })
const deleteAddress = async (id) =>
  await request.delete(`customer_address/${id}`)

export const getAddresses = async (params) =>
  await request.get('customer_address', { params })

export const useAddress = ({
  createAddressMutationProps,
  updateAddressMutationProps,
  deleteAddressMutationProps,
  addressParams = { limit: 1000, page: 1 },
  customerId,
} = {}) => {
  const createAddressMutation = useMutation(
    createAddress,
    createAddressMutationProps
  )
  const addresses = useQuery(
    [requestConstants.GET_ADDRESSES, customerId],
    () => getAddresses({ ...addressParams, customer_id: customerId }),
    { enabled: !!customerId }
  )
  const updateMutation = useMutation(updateAddress, updateAddressMutationProps)
  const deleteMutation = useMutation(deleteAddress, deleteAddressMutationProps)
  return {
    createAddressMutation,
    addresses,
    updateMutation,
    deleteMutation,
  }
}
