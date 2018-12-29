require('dotenv').config()
const he = require('he')
const Mastodon = require('mastodon-api')

const M = new Mastodon({
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000,
    api_url: `${process.env.API_URL}/api/v1/`,
})

const NO_HTML_REGEX = /(<([^>]+)>)/ig

M.get(`accounts/${process.env.TARGET_USER}/statuses`, {
    exclude_replies: true
}).then(resp => {
    for (const status of resp.data) {
        if (status.visibility == 'public') {
            M.post('statuses', {
                status: status.account.display_name + ': \n' + he.decode(status.content.replace(NO_HTML_REGEX, '')),
                spoiler_text: process.env.CW_TAG,
                visibility: 'public'
            })
        }
    }
})