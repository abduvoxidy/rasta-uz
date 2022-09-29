import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'

const getReviews = async (params) =>
  await request.get('review', {
    params,
  })
const userReview = async (data) => await request.post('user_reviews', data)
const orderPayTipByCard = async (data) =>
  await request.post(`order/${data.order_id}/pay-tip-by-card`, data)
const orderReviewSeen = async (data) =>
  await request.put(`order-review/${data.order_id}`, data)

export const useReview = ({
  reviewParams,
  createMutationProps,
  orderPayTipMutationProps,
  orderReviewSeenMutationProps,
} = {}) => {
  const reviews = useQuery(
    [requestConstants.GET_REVIEWS, reviewParams],
    () =>
      getReviews({
        ...reviewParams,
      }),
    { enabled: !!(reviewParams && reviewParams.user_id) }
  )
  const createMutation = useMutation(userReview, createMutationProps)
  const orderPayTipMutation = useMutation(
    orderPayTipByCard,
    orderPayTipMutationProps
  )
  const orderReviewSeenMutation = useMutation(
    orderReviewSeen,
    orderReviewSeenMutationProps
  )

  return {
    reviews,
    createMutation,
    orderReviewSeenMutation,
    orderPayTipMutation,
  }
}
