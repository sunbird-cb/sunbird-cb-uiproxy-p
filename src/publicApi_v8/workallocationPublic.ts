import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { logError } from '../utils/logger'
import { ERROR } from '../utils/message'

export const workallocationPublic = Router()

/* tslint:disable:no-unused-variable */
workallocationPublic.get('/getWaPdf/:waId', async (req, res) => {
    try {

        // tslint:disable-next-line:max-line-length
        const response = await axios.get('https://igot.blob.core.windows.net/content/content/do_11330192015047884813390/artifact/do_11330192015047884813390_1623769549639_8241d6ac-14d4-409a-ac54-bad5c482a735-1623769548941_workallocationpublished.pdf', {
            ...axiosRequestConfig,
            headers: {
            },
            responseType: 'arraybuffer',
        })
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'WorkOrderReport.pdf'
        link.click()
        // res.status(response.status).send(response.data)
    } catch (err) {
        logError(err)
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: ERROR.GENERAL_ERR_MSG,
            }
        )
    }
})
