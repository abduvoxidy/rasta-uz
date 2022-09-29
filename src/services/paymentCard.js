import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'

const getCards = async (params) =>
  await request.get('user-card', {
    params,
  })

const createCard = async (data) => await request.post('user-card', data)
const deleteCard = async (data) =>
  await request.delete(`user-card/${data.card_id}`)
const confirmSms = async (data) =>
  await request.post(`user-card/${data.card_id}/verify`, data)

export const usePaymentCard = ({
  cardParams,
  createMutationProps,
  confirmSmsMutationProps,
  deleteCardMutationProps,
} = {}) => {
  const cards = useQuery(
    [requestConstants.GET_PAYMENT_CARDS, cardParams],
    () => getCards(cardParams),
    { enabled: !!(cardParams && cardParams.user_id) }
  )
  const confirmSmsMutation = useMutation(confirmSms, confirmSmsMutationProps)
  const createMutation = useMutation(createCard, createMutationProps)
  const deletCardMutation = useMutation(deleteCard, deleteCardMutationProps)

  return {
    cards,
    createMutation,
    confirmSmsMutation,
    deletCardMutation,
  }
}
