import express from 'express'
import { UploadedFile } from 'express-fileupload'
import FormData from 'form-data'
import { CONSTANTS } from '../utils/env'
import {
  ilpProxyCreatorRoute,
  proxyCreatorDiscussion,
  proxyCreatorKnowledge,
  proxyCreatorLearner,
  proxyCreatorQML,
  proxyCreatorRoute,
  proxyCreatorSunbird,
  proxyCreatorSunbirdSearch,
  proxyCreatorToAppentUserId,
  scormProxyCreatorRoute
} from '../utils/proxyCreator'
import { extractUserIdFromRequest, extractUserToken } from '../utils/requestExtract'

export const proxiesV8 = express.Router()

proxiesV8.get('/', (_req, res) => {
  res.json({
    type: 'PROXIES Route',
  })
})

proxiesV8.post('/upload/*', (req, res) => {
  if (req.files && req.files.data) {
    const url = removePrefix('/proxies/v8/upload', req.originalUrl)
    const file: UploadedFile = req.files.data as UploadedFile
    const formData = new FormData()
    formData.append('file', Buffer.from(file.data), {
      contentType: file.mimetype,
      filename: file.name,
    })
    formData.submit(
      {
        headers: {
          // tslint:disable-next-line:max-line-length
          Authorization: CONSTANTS.SB_API_KEY,
          org: 'dopt',
          rootorg: 'igot',
          'x-authenticated-user-token': extractUserToken(req),
          'x-authenticated-userid': extractUserIdFromRequest(req),
        },
        host: 'knowledge-mw-service',
        path: url,
        port: 5000,
      },
      (err, response) => {

        response.on('data', (data) => {
          if (!err && (response.statusCode === 200 || response.statusCode === 201)) {
            res.send(JSON.parse(data.toString('utf8')))
          } else {
            res.send(data.toString('utf8'))
          }
        })
        if (err) {
          res.send(err)
        }

      }
    )
  } else {
    res.send('File not found')
  }
})
proxiesV8.use(
  '/content',
  proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + '/content')
)
proxiesV8.use(
  '/contentv3',
  proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + '/contentv3')
)
proxiesV8.use(
  '/fastrack',
  proxyCreatorRoute(express.Router(), CONSTANTS.ILP_FP_PROXY + '/fastrack')
)
proxiesV8.use(
  '/hosted',
  proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + '/hosted')
)
proxiesV8.use('/ilp-api', ilpProxyCreatorRoute(express.Router(), CONSTANTS.ILP_FP_PROXY))
proxiesV8.use(
  '/scorm-player',
  scormProxyCreatorRoute(express.Router(), CONSTANTS.SCORM_PLAYER_BASE)
)
proxiesV8.use(
  '/LA',
  proxyCreatorRoute(express.Router(), CONSTANTS.APP_ANALYTICS, Number(CONSTANTS.ANALYTICS_TIMEOUT))
)
proxiesV8.use(
  '/FordGamification',
  proxyCreatorRoute(express.Router(), CONSTANTS.GAMIFICATION_API_BASE + '/FordGamification')
)
proxiesV8.use(
  '/static-ilp',
  proxyCreatorRoute(express.Router(), CONSTANTS.STATIC_ILP_PROXY + '/static-ilp')
)
proxiesV8.use(
  '/web-hosted',
  proxyCreatorRoute(express.Router(), CONSTANTS.WEB_HOST_PROXY + '/web-hosted')
)

proxiesV8.use('/sunbirdigot/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorSunbirdSearch(express.Router(), `${CONSTANTS.SUNBIRD_PROXY_API_BASE}/composite/v1/search`)
)

proxiesV8.use('/content-progres/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorSunbirdSearch(express.Router(), `${CONSTANTS.SUNBIRD_PROXY_API_BASE}/course/v1/content/state/update`)
)
proxiesV8.use('/read/content-progres/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorSunbirdSearch(express.Router(), `${CONSTANTS.SUNBIRD_PROXY_API_BASE}/course/v1/content/state/read`)
)

proxiesV8.use('/api/user/v2/read',
  proxyCreatorToAppentUserId(express.Router(), `${CONSTANTS.SUNBIRD_PROXY_API_BASE}/user/v2/read/`)
)

proxiesV8.use([
  '/action/questionset/v1/*',
  '/action/question/v1/*',
  '/action/object/category/definition/v1/*',
], 
  proxyCreatorQML(express.Router(), `${CONSTANTS.KONG_API_BASE}`)
)

proxiesV8.use('/action/*',
  proxyCreatorKnowledge(express.Router(), `${CONSTANTS.KNOWLEDGE_MW_API_BASE}`)
)

proxiesV8.use('/learner/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorLearner(express.Router(), `${CONSTANTS.KONG_API_BASE}`)
)

proxiesV8.use('/api/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorSunbird(express.Router(), `${CONSTANTS.KONG_API_BASE}`)
)

proxiesV8.use('/assets/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorSunbird(express.Router(), `${CONSTANTS.KONG_API_BASE}`)
)

proxiesV8.use('/discussion/user/v1/create',
  // tslint:disable-next-line: max-line-length
  proxyCreatorDiscussion(express.Router(), `${CONSTANTS.DISCUSSION_HUB_MIDDLEWARE}`)
)
proxiesV8.use('/discussion/*',
  // tslint:disable-next-line: max-line-length
  proxyCreatorDiscussion(express.Router(), `${CONSTANTS.DISCUSSION_HUB_MIDDLEWARE}`)
)

function removePrefix(prefix: string, s: string) {
  return s.substr(prefix.length)
}
