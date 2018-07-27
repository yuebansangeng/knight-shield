
import express from 'express'
import mockHttp from './mock-http'

var router = express.Router()

router.get('/', (req, res, next) => {
  res.json({ 'code': 200, 'message': 'Mock Server Started'})
})

router.get('/mock', (req, res) => {
  mockHttp(req, res)
})

router.post('/mock', (req, res) => {
  mockHttp(req, res)
})

export default router
