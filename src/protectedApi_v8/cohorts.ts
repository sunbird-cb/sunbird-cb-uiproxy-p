import axios from 'axios'
import {Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'
import { logError, logInfo} from '../utils/logger'
import { ERROR } from '../utils/message'
import { extractUserIdFromRequest } from '../utils/requestExtract'

const API_END_POINTS = {
  cohorts: `${CONSTANTS.COHORTS_API_BASE}/v2/resources`,
  groupCohorts: (groupId: number) =>
    `${CONSTANTS.USER_PROFILE_API_BASE}/groups/${groupId}/users `,
  hierarchyApiEndPoint: (contentId: string) =>
  `${CONSTANTS.KNOWLEDGE_MW_API_BASE}/action/content/v3/hierarchy/${contentId}?hierarchyType=detail`,
  searchUserRegistry: `${CONSTANTS.NETWORK_HUB_SERVICE_BACKEND}/v1/user/search/profile`,
}
const VALID_COHORT_TYPES = new Set([
  'activeusers',
  'commongoals',
  'authors',
  'educators',
  'top-performers',
])

export const cohortsApi = Router()

cohortsApi.get('/:cohortType/:contentId', async (req, res) => {
  try {
    const cohortType = req.params.cohortType
    const contentId = req.params.contentId
    if (!VALID_COHORT_TYPES.has(cohortType)) {
      res.status(400).send('INVALID_COHORT_TYPE')
      return
    }
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const auth = req.header('Authorization') as string
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    if (cohortType === 'authors') {
     res.status(200).json(getAuthorsDetails(auth, contentId))
     return
    } else {
      const url = `${API_END_POINTS.cohorts}/${contentId}/user/${extractUserIdFromRequest(
        req
      )}/cohorts/${cohortType}`
      const response = await axios({
        ...axiosRequestConfig,
        headers: {
          rootOrg,
        },
        method: 'GET',
        url,
      })
      res.status(response.status).send(response.data)
    }
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(
      (err && err.response && err.response.data) || {
        error: 'Failed due to unknown reason',
      }
    )
  }
})

cohortsApi.get('/:groupId', async (req, res) => {
  const { groupId } = req.params
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.get(API_END_POINTS.groupCohorts(groupId))
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(
      (err && err.response && err.response.data) || {
        error: 'Failed due to unknown reason',
      }
    )
  }
})

export async function getAuthorsDetails(auth: string, contentId: string) {
  try {
    logInfo('Hierarchy API=======>', API_END_POINTS.hierarchyApiEndPoint(contentId))
    const prefixUrl = CONSTANTS.USER_SUNBIRD_DETAILS_API_BASE
    const url = prefixUrl + '/apis/proxies/v8/action/content/v3/hierarchy/do_1132591765708554241127?hierarchyType=detail'
    const hierarchyResponse = await axios.get(url, {
      ...axiosRequestConfig,
      headers: {
        Authorization: auth,
      },
  })
    logInfo('Hierarchy API success')
    const ids: string[] = []
    if (hierarchyResponse.data && hierarchyResponse.data.result &&
      hierarchyResponse.data.result.content) {
        const creatorDetails: string = hierarchyResponse.data.result.content.creatorDetails
        const authors = creatorDetails.substring(1, creatorDetails.length - 1).split(', ')
        authors.forEach((value) => {
            ids.push(JSON.parse(value).id)
          })
      }
    const userlist: ICohortsUser[] = []
    if (ids) {
    const searchBody = {
      filters : {
        'id.keyword' : {
            or : ids,
          },
      },
   }
    logInfo('Req body========>', JSON.stringify(searchBody))
    const response = await axios.post(API_END_POINTS.searchUserRegistry, { ...searchBody }, {
    ...axiosRequestConfig,
  })
    logInfo('Profile Search Response ==>')
    const userProfileResult = response.data.result.UserProfile
    if ((typeof userProfileResult !== 'undefined' && userProfileResult.length > 0)) {
    logInfo('Iterating the user profile')
    userProfileResult.forEach((element: IUserProfile) => {
      userlist.push(getUsers(element))
    })
  }
  }
    logInfo('cohorts profiles', JSON.stringify(userlist))
    return userlist
  } catch (error) {
    logError('ERROR WHILE FETCHING THE AUTHORS DETAILS --> ', error)
    return false
  }
}

function getUsers(userprofile: IUserProfile): ICohortsUser {

  return {
    city: '',
    department: userprofile.professionalDetails[0].name,
    desc: '',
    designation: userprofile.professionalDetails[0].designation,
    email : userprofile.personalDetails.primaryEmail,
    first_name : userprofile.personalDetails.firstname,
    last_name : userprofile.personalDetails.middlename,
    phone_No: userprofile.personalDetails.mobile,
    userLocation: '',
    user_id: userprofile.id,
  }
}

export interface ICohortsUser {
  first_name: string
  last_name: string
  email: string
  desc: string
  user_id: string
  department: string
  phone_No: number
  designation: string
  userLocation: string
  city: string
}

export interface IUserProfile {
  personalDetails: IPersonalDetails
  professionalDetails: IProfessionalDetailsEntity[]
  id: string
}
export interface IPersonalDetails {
  firstname: string
  middlename: string
  surname: string
  dob: string
  nationality: string
  domicileMedium: string
  gender: string
  maritalStatus: string
  category: string
  countryCode: string
  mobile: number
  telephone: string
  primaryEmail: string
  officialEmail: string
  personalEmail: string
}

export interface IProfessionalDetailsEntity {
  description: string
  industry: string
  designationOther: string
  nameOther: string
  organisationType: string
  responsibilities: string
  name: string
  location: string
  designation: string
  industryOther: string
  completePostalAddress: string
  doj: string
}
