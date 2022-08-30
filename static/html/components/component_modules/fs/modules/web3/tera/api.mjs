/**
 *
 * @type {{TEST: string, MAIN: string}}
 */
const NODE = {
    TEST:"https://newkind-credits.herokuapp.comz/",
    MAIN:"https://newkind-credits.herokuapp.comz"
}

/**
 *
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(`${NODE.MAIN}${url}`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

/**
 *
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
async function getData(url = '', data = {}) {
    const response = await fetch(`${NODE.MAIN}${url}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}
export default {
    post: postData,
    get: getData
}