import { AsyncResponse } from '../../interface'
import { IMediaData, MediaInfo } from '../media/interface'
import { Project } from './projectModel'

export enum ProjectType {
  COLLABOARTION = 'Collaboration',
  SEEKING_HELP = 'Seeking help'
}

export enum ProjectStatus {
  ACTIVE = 'Active',
  FINISHED = 'Finished'
}

export interface IAddProjectView {
  projectId: string
}

export interface ICreateProject {
  userId: string
  storageUsage: number
  name: string
  description: string
  projectType: ProjectType
  deadline: string
  paid: boolean
  tags: string
  currencyCode: string
  totalAmount: number
  instrumentIds: string[]
  skillIds: string[]
  mediaFiles: IMediaData[]
  profileHandle: string
}

export interface IGetProjects {
  type?: ProjectType
  genre?: string
  country?: string
  skill?: string
  instrument?: string
  profession?: string
  page: number
  perPage: number
}

export interface IConditions {
  skip: number
  take: number
  where?: IProjectFilter
}

export interface IProjectFilter {
  projectType: ProjectType
  skill?: {
    skill: string
  }
  profession?: {
    profession: string
  }
  instrument?: {
    instrument: string
  }
  genre?: {
    genre: string
  }
}

export interface IGetProjectById {
  projectId: string
}

export interface IProjectService {
  createProject(params: ICreateProject): AsyncResponse<MediaInfo[]>
  getProjects(params: IGetProjects): AsyncResponse<Project[]>
  getProjectById(params: IGetProjectById): AsyncResponse<Project>
  addProjectView(params: IAddProjectView): AsyncResponse<Project>
}
