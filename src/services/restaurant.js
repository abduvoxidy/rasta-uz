import { request } from './http-client'
import { useMutation, useQuery } from 'react-query'
import { requestConstants } from './constants'
import { format } from 'date-fns'

const getNews = async (params) => await request.get('news', { params })
const getRestaurants = async (params) =>
  await request.get('shippersv2', { params })
const getRestaurant = async (id) => await request.get(`shippers/${id}`)
const getRestaurantByCategory = async (params) =>
  await request.get('shippers-filter', { params })
const getNewProducts = async (params) =>
  await request.get('new-products', { params })

export const useRestaurant = ({
  newsParams,
  newProductsParams,
  restaurantParams,
  restaurantsByCategoriesParams,
  restaurantMutationProps,
} = {}) => {
  const news = useQuery(
    [requestConstants.GET_NEWS, newsParams],
    () =>
      getNews({
        limit: 50,
        page: 1,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ...newsParams,
      }),
    {
      enabled: !!(newsParams && newsParams.region_id),
    }
  )

  const newProducts = useQuery(
    [requestConstants.GET_NEW_PRODUCTS, newProductsParams],
    () =>
      getNewProducts({
        limit: 50,
        page: 1,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ...newProductsParams,
      }),
    {
      enabled: !!(newProductsParams && newProductsParams.region_id),
    }
  )

  const restaurant = useMutation(getRestaurant, restaurantMutationProps)

  const restaurants = useQuery(
    [requestConstants.GET_RESTAURANTS, restaurantParams],
    () =>
      getRestaurants({
        limit: 100,
        page: 1,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ...restaurantParams,
      }),
    {
      enabled: !!(restaurantParams && restaurantParams.region_id),
    }
  )

  const restaurantsByCategories = useQuery(
    [
      requestConstants.GET_RESTAURANTS_BY_CATEGORIES,
      restaurantsByCategoriesParams,
    ],
    () =>
      getRestaurantByCategory({
        limit: 100,
        page: 1,
        current_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ...restaurantsByCategoriesParams,
      }),
    {
      enabled: !!(
        restaurantsByCategoriesParams && restaurantsByCategoriesParams.region_id
      ),
    }
  )

  return {
    news,
    restaurants,
    restaurantsByCategories,
    restaurant,
    newProducts,
  }
}
