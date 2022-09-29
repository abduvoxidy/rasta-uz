import { request } from './http-client'
import { useQuery } from 'react-query'
import { requestConstants } from './constants'
import { format } from 'date-fns'

const getNearestBranch = async (params) =>
  await request.get('nearest-branch', { params })

export const useBranch = ({ nearesBranchParams } = {}) => {
  const nearestBranch = useQuery(
    [requestConstants.GET_NEAREST_BRANCH, nearesBranchParams],
    () =>
      getNearestBranch({
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ...nearesBranchParams,
      }),
    {
      enabled: !!(
        nearesBranchParams &&
        nearesBranchParams.shipper_id &&
        nearesBranchParams.region_id
      ),
    }
  )
  //store.dispatch(setBranchId(nearestBranch?.data?.branches[0]?.id))
  return {
    nearestBranch,
  }
}
