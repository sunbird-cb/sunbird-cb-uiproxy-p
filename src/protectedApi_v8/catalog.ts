import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'

import { IFilterUnitContent } from '../models/catalog.model'
import { getFilters, getFilterUnitByType } from '../service/catalog'
import { logError, logInfo } from '../utils/logger'
import { ERROR } from '../utils/message'
import { extractAuthorizationFromRequest, extractUserIdFromRequest } from '../utils/requestExtract'

export const catalogApi = Router()

const API_END_POINTS = {
  getCatalogEndPoint: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/catalog/`,
}
const failedToProcess = 'Failed to process the request. '

catalogApi.get('/', async (req, res) => {
  try {
    const xAuth = extractAuthorizationFromRequest(req).split(' ')
    const response = await axios.get(API_END_POINTS.getCatalogEndPoint, {
        ...axiosRequestConfig,
        headers: {
          xAuthUser: xAuth[1],
        },
    })
    logInfo('' + response.status)
    res.status(200).send(getTerms())
    // tslint:disable
    // res.status(response.status).send(response.data)
  } catch (err) {
    logError(failedToProcess + err)
    res.status((err && err.response && err.response.status) || 500).send(
        (err && err.response && err.response.data) || {
            error: ERROR.GENERAL_ERR_MSG,
        }
    )
  }
})

catalogApi.post('/tags', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.headers.rootorg
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const { tags, type } = req.body
    if (typeof rootOrg === 'string') {
      const filterContents: IFilterUnitContent[] = await getFilters(userId, rootOrg, 'catalogPaths')
      const filterContent = filterContents.find((content) => content.type === type)
      const catalog: IFilterUnitContent | null = getFilterUnitByType(filterContent, tags)
      if (catalog) {
        res.send(catalog.children)
        return
      }

      res.status(400).send({ error: ERROR.ERROR_NO_ORG_DATA })
    }
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(
      (err && err.response && err.response.data) || {
        error: 'Failed due to unknown reason',
      }
    )
  }
})

export interface ITerms {
  identifier: string,
  code: string,
  name: string,
  description: string,
  index: number,
  status: string,
  children: this[],
  noOfHoursConsumed: number
}

export interface ICatalogResponse {
  terms: ITerms[]
}

function getTerms(): ICatalogResponse {
  // tslint:disable
  const catalogResponse: ICatalogResponse = {
    terms: [
      {
        children: [
          {
            identifier: "igot_subject_503845e7-5227-41e6-adca-2ed78ea7a6c8",
            code: "503845e7-5227-41e6-adca-2ed78ea7a6c8",
            name: "Growth Economics",
            description: "Growth Economics",
            index: 1,
            status: "Live",
            children: [],
            noOfHoursConsumed: 0
          }
        ],
        code: "74561bda-e10d-4336-9ba5-7be617427422",
        description: "Economics",
        identifier: "igot_subject_74561bda-e10d-4336-9ba5-7be617427422",
        index: 1,
        status: "Live", name: "Economics",
        noOfHoursConsumed: 0
      },
      {
        children: [
          {
            children: [
              {
                children: [],
                code: "3fbf92bf-3fb9-489c-a110-227c24fa5284",
                description: "Civil & criminal Courts",
                identifier: "igot_subject_3fbf92bf-3fb9-489c-a110-227c24fa5284",
                index: 1,
                name: "Civil & criminal Courts",
                noOfHoursConsumed: 0,
                status: "Live"
              }
            ],
            code: "d313b8d4-547c-4ff2-844a-5b64ea3136e6",
            identifier: "igot_subject_d313b8d4-547c-4ff2-844a-5b64ea3136e6",
            description: "Administration of Justice",
            index: 1,
            name: "Administration of Justice",
            noOfHoursConsumed: 0,
            status: "Live"
          }
        ],
        code: "11ad959b-1181-4fc6-8558-f7fccbaf0a79",
        description: "Law",
        identifier: "igot_subject_11ad959b-1181-4fc6-8558-f7fccbaf0a79",
        index: 2,
        name: "Law",
        noOfHoursConsumed: 0,
        status: "Live"
      }
    ]
  }
  return catalogResponse;
}