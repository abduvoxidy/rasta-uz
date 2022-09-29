import { request } from './http-client'

export const fetchMultipleUrls = async (urls) => {
  let data
  try {
    data = await Promise.all(
      urls.map(async (url) => {
        try {
          return await request.get(url)
        } catch (e) {
          console.log(e)
        }
      })
    )
  } catch (error) {
    console.error(error)
  }

  return data
}
