const baseUrl = 'https://www.howieliu.com'
function postData(api, data) {
  const url = baseUrl + api
  return new Promise((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      method: 'post'
    })
    .then(response => response.json())
    .then(resp => resolve(resp))
    .catch(err => reject(err))
    })
}
function getData(api) {
  const url = baseUrl + api
  return new Promise((resolve, reject) => {
    fetch(url, {
        credentials: 'include',
      })
      .then(response => response.json())
      .then(resp => resolve(resp))
      .catch(err => reject(err))
  })
}

/*export default {
  postData,
  getData
}*/
