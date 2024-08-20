import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Activity } from './activityModel'

export enum ActivityType {
  COLLABORATION_END = 'Collaboration End',
  CREATE_PROJECT = 'Create Project'
}

export interface IGetActivitiesForUser {
  userId: string
}

export interface ICreateActivity extends IServiceMethod {
  userId: string
  activityType: ActivityType
  profileHandle: string
  projectId: string
}

export interface IActivityService {
  createActivity(params: ICreateActivity): AsyncResponse<ResponseCode>
  getActivitiesForUser(params: IGetActivitiesForUser): AsyncResponse<Activity[]>
}
