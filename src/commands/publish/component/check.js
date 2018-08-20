
import request from 'request'

export default async (o) => {
  const { CMP_SERVER_HOST } = process.env
  const { 'rc': { name, team, category }, 'package': { 'name': module } } = o

  if (!name) {
    throw new Error(`请在 rc 配置文件中，配置 name 字段`)
  }
  if (!name.match(/^[A-Za-z\-\d]+?$/)) {
    throw new Error(`rc 文件中，name 字段只能包含有是字母、数字、中划线`)
  }
  if (!team) {
    throw new Error(`请在 rc 文件中，配置 team 字段（team 字段将会用来组件唯一性验证，以及搜索功能）`)
  }
  if (!category) {
    console.log('组件未配置 category，将为组件自动匹配一个最相近类型')
  }

  const { code, message, data } = await new Promise((resolve, reject) => {
    request(`${CMP_SERVER_HOST}/users/check-cmp?name=${name || ''}&team=${team || ''}&module=${module || ''}`, (err, res, body) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve(JSON.parse(body))
    })
  })

  if (code !== 200 || !data) {
    throw new Error(message)
  }

  console.log(message)
}
