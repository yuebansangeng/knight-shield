
import request from 'request'

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  let {
    cinumber = '0',
    jobname = 'build',
    'rc': { name },
    'package': { 'name': module, version }
  } = o

  if (!name || !name.match(/^[A-Za-z\-\d]+?$/)) {
    name = 'unknown'
    console.log(`组件 rc 文件中的 name 属性格式不正确，只允许是字母、数字、中划线`)
  }

  let { code, message } = await new Promise((resolve, reject) => {
    request(`${CMP_SERVER_HOST}/users/upgrade-cmp-build?name=${name}&version=${version}&module=${module}&cinumber=${cinumber}&jobname=${jobname}`, (err, res, body) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve(JSON.parse(body))
    })
  })

  if (code !== 200) {
    throw new Error(message)
  }

  console.log(message)
}
