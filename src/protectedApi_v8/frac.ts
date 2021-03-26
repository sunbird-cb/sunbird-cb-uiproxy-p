import axios from 'axios'
import { Router } from 'express'

import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'

const API_END_POINTS = {
    addDataNode: `${CONSTANTS.FRAC_API_BASE}/api/frac/addDataNode`,
    getCompetencyArea: `${CONSTANTS.FRAC_API_BASE}/api/frac/getAllNodes?type=COMPETENCYAREA`,
    getDictionary: `${CONSTANTS.FRAC_API_BASE}/api/frac/getAllNodes?type=COMPETENCY&status=VERIFIED`,
    searchNodes: `${CONSTANTS.FRAC_API_BASE}/api/frac/searchNodes`,
}

export const fracApi = Router()
const unknownError = 'Failed due to unknown reason'

fracApi.get('/getAllNodes/:type', async (req, res) => {
    try {
        const type = req.params.type
        let apiEndPoint = ''
        switch (type) {
            case 'dictionary':
                apiEndPoint = API_END_POINTS.getDictionary
                break
            case 'competencyarea':
                apiEndPoint = API_END_POINTS.getCompetencyArea
                break
            default:
                res.status(400).send('TYPE_IS_NOT_PROVIDED_OR_TYPE_IS_NOT_CONFIGURED')
                break
        }
        const response = await axios.get(apiEndPoint, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.post('/addDataNode', async (req, res) => {
    try {
        const response = await axios.post(API_END_POINTS.addDataNode, req.body, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})

fracApi.post('/searchNodes', async (req, res) => {
    try {
        const response = await axios.post(API_END_POINTS.searchNodes, req.body, {
            ...axiosRequestConfig,
            headers: {
                Authorization: req.header('Authorization'),
            },
        })
        res.status(response.status).send(response.data)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: unknownError,
            }
        )
    }
})
