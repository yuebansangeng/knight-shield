
import fs from 'fs'
import HARReader from './har-reader'

export default (req, res, options = {}) => {
  const recording = req.query.recording
  const { workspace = __dirname , httpHARFile = 'recording.har' } = options

  let harContent
  try {
    harContent = fs.readFileSync(`${workspace}/${httpHARFile}`, 'utf-8')  
  } catch (e) {
    console.log(e)
  }
  
  const har = new HARReader({ 'har': harContent })

  const http = har.read(recording)

  if (!http) {
    return res.json({ 'code': 400, 'message': `can not find '${recording}'` })
  }

  let {
    'response': {
      status,
      headers = [],
      cookies = [],
      'content': {
        mimeType, 
        'text': body
      }
    }
  } = http

  res.status(status)

  headers.forEach(head => res.set(head.name, head.value))

  cookies.forEach(cookie => {
    let { name, value, expires, httpOnly, secure } = cookie
    res.cookie(name, value, { expires, httpOnly, secure })
  })

  if (status === 200) {
    try {
      if (mimeType === 'application/json') {
        body = JSON.parse(body)
      }
    } catch (e) {}
    res.json(body)
  } else {
    res.end()
  }
}
