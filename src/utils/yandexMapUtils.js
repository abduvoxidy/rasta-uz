import axios from 'axios'

export function loadYandexMap(lang) {
  const hasAdded = !!document.getElementById('yandex-map-script')
  if (!hasAdded) {
    var jsElm = document.createElement('script')
    jsElm.type = 'application/javascript'
    jsElm.src = `https://api-maps.yandex.ru/2.1/?lang=${
      lang == 'en' ? 'en-US' : 'ru_RU'
    }&apikey=3a6f1279-0199-473f-b5b5-72ce3d2d1d78`
    jsElm.id = 'yandex-map-script'
    document.body.appendChild(jsElm)
  }
}

export async function searchAddress(params) {
  try {
    const result = await axios({
      method: 'get',
      url: 'https://geocode-maps.yandex.ru/1.x',
      params: {
        ...params,
        apikey: '26653802-6f79-4a5d-b1c5-9bf787a04c08',

        // add_chains_loc: 1,
        // add_rubrics_loc: 1,
        // bases: 'geo,biz,transit',
        // client_reqid: '1660758707366_576464',
        // fullpath: 1,
        lang: 'ru_UZ',
        format: 'json',
        rspn: 0,
        results: 10,
        spn: '6.5,6.5',
        sco: 'latlong'
        // ll: '69.1863925,41.34644307412243',
        // origin: 'maps-search-form',
        // outformat: 'json',
        // pos: 5,
        // spn: '0.013198226956717463,0.0026048852360531782',
        // ull: '69.251891,41.330278'
        // v: '9',
        // yu: 5878686631660629771
      }
    })
    console.log('result==>', result)
    return result?.data?.response?.GeoObjectCollection?.featureMember
  } catch (e) {
    console.log('e', e)
    return []
  }
}
