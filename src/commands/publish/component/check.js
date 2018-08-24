
import request from 'request-promise'

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  const { 'rc': { name, team }, 'package': { 'name': module } } = o

  if (!name) {
    throw new Error(`请在 rc 配置文件中，配置 name 字段`)
  }
  if (!name.match(/^[A-Za-z\-\d@\/]+?$/)) {
    throw new Error(`rc 文件中，name 字段只能包含有[A-Z,a-z,-,0-9,@,/]`)
  }

  const { code, message, data } =
    await request(`${CMP_SERVER_HOST}/users/check-cmp?name=${name || ''}&team=${team || ''}&module=${module || ''}`)
            .then(res => JSON.parse(res))

  if (code !== 200 || !data) {
    throw new Error(message)
  }
}
