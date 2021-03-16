import { Router } from 'express'

import { ERROR } from '../utils/message'

export const roleActivityApi = Router()

roleActivityApi.get('/', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        if (!rootOrg) {
            res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
            return
        }
        res.status(200).send(getAllRoles())
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: ERROR.GENERAL_ERR_MSG,
            }
        )
    }
})

roleActivityApi.get('/:roleKey', async (req, res) => {
    try {
        const rootOrg = req.header('rootOrg')
        const authToken = req.header('Authorization')
        if (!rootOrg || !authToken) {
            res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
            return
        }
        const roleKey = req.params.roleKey as string
        const roles = getAllRoles()
        const returnRoleList: IRole[] = []
        roles.forEach((element) => {
            if (element.type === 'ROLE' && isMatches(element.name, roleKey)) {
                returnRoleList.push(element)
            }
        })
        res.status(200).send(returnRoleList)
    } catch (err) {
        res.status((err && err.response && err.response.status) || 500).send(
            (err && err.response && err.response.data) || {
                error: ERROR.GENERAL_ERR_MSG,
            }
        )
    }
})

function isMatches(roleName: string, roleKey: string) {
    if (roleName.toLowerCase().startsWith(roleKey.toLowerCase())) {
        return true
    }
    return false
}

export interface IRole {
    type: string,
    id: string,
    name: string,
    description: string,
    status: string,
    source: string,
    childNodes: IActivity[]
}

export interface IActivity {
    type: string,
    id: string,
    name: string,
    description: string,
    status: string,
    source: string,
    parentRole: string
}

function getAllRoles(): IRole[] {
    // tslint:disable
    const roleList: IRole[] =
        [
            {
                childNodes: [
                    {
                        description: 'Implementation of e-Office',
                        id: 'AID002',
                        name: 'Implementation of e-Office',
                        parentRole: 'RID001',
                        source: 'ISTM',
                        status: 'UNVERIFIED',
                        type:  'ACTIVITY',
                    },
                    {
                        description: 'Work related to committee of financial sector statistics',
                        id: 'AID002',
                        name: 'Work related to committee of financial sector statistics',
                        parentRole: 'RID001',
                        source: 'ISTM',
                        status: 'UNVERIFIED',
                        type:  'ACTIVITY',
                    },
                ],
                description: 'Development and deployment of e-Office and training the employees',
                id: 'RID001',
                name: 'Information Technology',
                source: 'ISTM',
                status: 'UNVERIFIED',
                type:  'ROLE',
        },
        {
            childNodes : [
                {
                    description: 'Regional Rural Bank',
                    id: 'AID003',
                    name: 'Regional Rural Bank',
                    parentRole: 'RID002',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
                {
                    description: 'Cyber Security Related Work',
                    id: 'AID004',
                    name: 'Cyber Security Related Work',
                    parentRole: 'RID002',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
                {
                    description: 'Agriculture Credit',
                    id: 'AID005',
                    name: 'Agriculture Credit',
                    parentRole: 'RID002',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
            ],
            description: 'Vigilance',
            id: 'RID002',
            name: 'Vigilance',
            source: 'ISTM',
            status: 'UNVERIFIED',
            type:  'ROLE',
        },
        {
            childNodes : [
                {
                    description: 'Work relating to financial inclusion',
                    id: 'AID006',
                    name: 'Work relating to financial inclusion',
                    parentRole: 'RID003',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
                {
                    description: 'Mission Office',
                    id: 'AID007',
                    name: 'Mission Office',
                    parentRole: 'RID003',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
                {
                    description: 'e-Governance in all FIs and e-Payments in Banking system',
                    id: 'AID008',
                    name: 'e-Governance in all FIs and e-Payments in Banking system',
                    parentRole: 'RID003',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
            ],
            description: 'Coordination with other sections',
            id: 'RID003',
            name: 'Coordination with other sections',
            source: 'ISTM',
            status: 'UNVERIFIED',
            type:  'ROLE',
        },
        {
            childNodes: [
                {
                    description: 'Matters related to payment regulatory board',
                    id: 'AID009',
                    name: 'Matters related to payment regulatory board',
                    parentRole: 'RID004',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
                {
                    description: 'Expansion of banking network',
                    id: 'AID010',
                    name: 'Expansion of banking network',
                    parentRole: 'RID004',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
                {
                    description: 'Lucky Grahak Incentive Yojana',
                    id: 'AID011',
                    name: 'Lucky Grahak Incentive Yojana',
                    parentRole: 'RID004',
                    source: 'ISTM',
                    status: 'UNVERIFIED',
                    type:  'ACTIVITY',
                },
            ],
            description: 'Development and deployment of e-Office and training the employees ',
            id: 'RID004',
            name: 'Financial Inclusion advisory',
            source: 'ISTM',
            status: 'UNVERIFIED',
            type:  'ROLE',
        },
    ]
    return roleList
}
