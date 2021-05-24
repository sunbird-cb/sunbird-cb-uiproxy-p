import { Router } from 'express'
import { logInfo } from '../utils/logger'

export const learnCourse = Router()

learnCourse.all('/:courseId/batch/:batchId', async (req, res) => {
    const url = req.protocol + '://'  + req.get('host') + '/app/toc/' + req.params.courseId + '/overview?batchId=' + req.params.batchId
    logInfo('Redirect URL -> ' + url)
    res.redirect(url)
})
