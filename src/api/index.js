const host = 'https://api.book24.ru/'

export default function makeRequest(method, api, queries) {

    return new Promise(function (resolve, reject)
    {
        const xhr = new XMLHttpRequest();
        let query = ''
        if (Array.isArray(queries) && queries.length) {
            queries.forEach((item, index) => {
                for (let [key, value] of Object.entries(item)) {
                    query += index === 0 ? `?${key}=${value}` :  `&${key}=${value}`
                }
            })
        }

        xhr.open(method, `${host}${api}${query}`, true)
        xhr.setRequestHeader('x-token', '330d207892855dbd5abd5147ea562094')

        xhr.send()
        xhr.onload = function () {
            if (xhr.status != 200) {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            } else {
                resolve(JSON.parse(xhr.response))
            }
        }

        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        };
    })
}
