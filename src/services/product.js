import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'
import { format } from 'date-fns'

const getProduct = async (id, params) =>
  await request.get(`product/${id}`, { params })
const getRelatedProducts = async (params) =>
  await request.get('related-products', { params })
const getProducts = async (params) => await request.get('product', { params })
const getSearchedProducts = async (params) =>
  await request.get('search', { params })
export const useProduct = ({
  productParams,
  productId,
  searchParams,
  searchMutationProps,
  productsParams,
  relatedProductsParams,
} = {}) => {
  const product = useQuery(
    [requestConstants.GET_PRODUCT, productParams, productId],
    () => getProduct(productId, productParams),
    {
      enabled: !!productId,
    }
  )

  const relatedProducts = useQuery(
    [requestConstants.GET_RELATED_PRODUCTS],
    () => getRelatedProducts(relatedProductsParams),
    {
      enabled: !!(
        relatedProductsParams &&
        relatedProductsParams.branch_id &&
        relatedProductsParams.product_ids
      ),
    }
  )

  const products = useQuery(
    [requestConstants.GET_PRODUCTS, productsParams],
    () => getProducts(productsParams),
    {
      enabled: !!(
        productsParams &&
        productsParams.shipper_id &&
        productsParams.menu_id &&
        productsParams.search
      ),
    }
  )

  const searchedProducts = useMutation(
    () =>
      getSearchedProducts({
        ...searchParams,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      }),
    searchMutationProps
  )

  return {
    product,
    searchedProducts,
    products,
    relatedProducts,
  }
}
