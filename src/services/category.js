import { request } from './http-client'
import { useQuery } from 'react-query'
import { requestConstants } from './constants'

const getCategories = async (params) =>
  await request.get('category', {
    params,
  })

export const useCategory = ({ categoryParamas } = {}) => {
  const categories = useQuery(
    [
      requestConstants.GET_CATEGORIES,
      categoryParamas.branch_id,
      categoryParamas.menu_id,
    ],
    () =>
      getCategories({
        ...categoryParamas,
      }),
    { enabled: !!categoryParamas.branch_id }
  )

  return {
    categories,
  }
}
