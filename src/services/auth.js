import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'

const createCustomer = async (data) =>
  await request.post('customers/register', data)
const updateCustomer = async (data) =>
  await request.put(`customers/${data.id}`, data)
const getCustomer = async (params) =>
  await request.get(`customers/${params.id}`)

const loginCustomer = async (data) =>
  await request.post('customers/login', data)

const confirmLogin = async (data) =>
  await request.post('customers/confirm-login', data)

const confirmRegister = async (data) =>
  await request.post('customers/register-confirm', data)

export const useAuth = ({
  createCustomerMutationProps,
  confirmRegisterProps,
  loginMutationProps,
  confirmLoginProps,
  customerParams,
  updateMutationProps,
} = {}) => {
  const createCustomerMutation = useMutation(
    createCustomer,
    createCustomerMutationProps
  )
  const updateMutation = useMutation(updateCustomer, updateMutationProps)
  const customer = useQuery(
    [requestConstants.GET_CUSTOMER],
    () => getCustomer(customerParams),
    {
      enabled: !!(customerParams && customerParams.id),
    }
  )
  const confirmRegisterMutation = useMutation(
    confirmRegister,
    confirmRegisterProps
  )
  const loginMutation = useMutation(loginCustomer, loginMutationProps)
  const confirmLoginMutation = useMutation(confirmLogin, confirmLoginProps)
  return {
    createCustomerMutation,
    confirmRegisterMutation,
    loginMutation,
    confirmLoginMutation,
    customer,
    updateMutation,
  }
}
