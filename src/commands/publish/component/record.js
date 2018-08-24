
import request from 'request-promise'

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
  }

  const { code, message } =
    await request(`${CMP_SERVER_HOST}/users/upgrade-cmp-build?name=${name}&version=${version}&module=${module}&cinumber=${cinumber}&jobname=${jobname}`)
      .then(res => JSON.parse(res))

  if (code !== 200) {
    throw new Error(message)
  }
}
