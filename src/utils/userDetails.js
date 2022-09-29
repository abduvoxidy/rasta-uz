import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { getAddresses, getOrders } from 'services'
import { setAddress } from 'store/common/commonSlice'
import { store } from 'store/store'

export const saveUser = (data) => {
  if (data && data.access_token) {
    setCookie(null, 'USER', JSON.stringify(data), {
      maxAge: process.env.COOKIE_TIME,
      path: '/',
    })
  }
}

export const getUser = () => {
  const cookies = parseCookies()
  return cookies.USER ? JSON.parse(cookies.USER) : null
}

export const logout = (event) => {
  event && event.preventDefault()
  destroyCookie(null, 'USER')
  // destroyCookie(null, 'REGION_ID_BY_POINT')
  setTimeout(() => {
    location.replace('/')
  }, 1000)
}

export const saveUserAddress = (address) => {
  const cookies = parseCookies()
  setCookie(
    null,
    'USER',
    JSON.stringify({
      ...JSON.parse(cookies.USER),
      address: address,
    }),
    {
      maxAge: process.env.COOKIE_TIME,
      path: '/',
    }
  )
  // location.reload('')
}

export const getUserLastOrder = () => {
  const user = getUser()
  if (user && user.id && !user.address) {
    getOrders({ limit: 1, page: 1 }).then((res) => {
      getAddresses({ limit: 1000, page: 1, customer_id: user.id }).then(
        (addresses) => {
          if (res.orders && res.orders.length > 0) {
            const address = addresses.customer_addresses
              ? addresses.customer_addresses.find(
                  (item) =>
                    item.location.long.toString().substring(0, 5) ===
                      res.orders[0].to_location.long
                        .toString()
                        .substring(0, 5) &&
                    item.location.lat.toString().substring(0, 5) ===
                      res.orders[0].to_location.lat.toString().substring(0, 5)
                )
              : null
            store.dispatch(setAddress(addresses.customer_addresses || []))

            if (address) {
              saveUserAddress(address)
            } else {
              if (
                addresses.customer_addresses &&
                addresses.customer_addresses.length > 0
              ) {
                saveUserAddress(addresses.customer_addresses[0])
              }
            }
          } else {
            store.dispatch(setAddress(addresses.customer_addresses || []))
            if (
              addresses.customer_addresses &&
              addresses.customer_addresses.length > 0 &&
              !user.address
            ) {
              saveUserAddress(addresses.customer_addresses[0])
            }
          }
        }
      )
    })
  }
  if (user && user.id) {
    getAddresses({ limit: 1000, page: 1, customer_id: user.id }).then(
      (addresses) => {
        store.dispatch(setAddress(addresses.customer_addresses || []))
      }
    )
  }
}
