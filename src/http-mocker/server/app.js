
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mockHttp from './mock-http'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ 'extended': false }))
app.use(cookieParser())

app.all('/', (req, res, next) => {
  res.json({ 'code': 200, 'message': 'Mock Server Started' })
})

app.all('/mock', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  mockHttp(req, res, next, {
    'workspace': app.get('workspace'),
    'httpHARFile': app.get('httpHARFile')
  })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.json({
    'message': err.message,
    'stack': err.stack
  })
});

export default app
