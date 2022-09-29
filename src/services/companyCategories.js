import { request } from './http-client'
import { useQuery } from 'react-query'
import { requestConstants } from './constants'

export const getCompanyCategories = async (params) =>
  await request.get('company_category', { params })

export const useCompanyCategory = ({ regionId } = {}) => {
  const companyCategories = useQuery(
    [requestConstants.GET_COMPANY_CATEGORIES, regionId],
    () => getCompanyCategories({ limit: 1000, page: 1, region_id: regionId }),
    {
      enabled: !!regionId,
    }
  )
  return {
    companyCategories,
  }
}
