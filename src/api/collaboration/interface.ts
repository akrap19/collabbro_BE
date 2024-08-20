import { AsyncResponse, ResponseCode } from '../../interface'
import { Collaboration } from './collaborationModel'

export enum CollaborationStatus {
  CHAT_OPENED = 'Chat Opened',
  REQUEST_SENT = 'Request sent',
  REQUEST_APPROVED = 'Request approved',
  REQUEST_DECLINED = 'Request declined',
  COLLABORATION_TERMINATED = 'Collaboration Terminated',
  COLLABORATION_FINISHED_SUCCESSFULLY = 'Collaboration Finished'
}

export enum CollaborationEndResponse {
  SUCCESSFULLY = 'Request sent',
  UNSUCCESSFULLY = 'Request approved'
}

export interface ICrateCollaboration {
  collaboratorId: string
  projectId: string
  amount: number
  inDeadline: boolean
  reasonToCollaborate: string
}

export interface IUpdateCollaboration {
  collaborationId: string
  ownerId: string
  profileHandle: string
  collaborationStatus: CollaborationStatus
  inDeadline: boolean
}

export interface ICollaborationService {
  createCollaboration(params: ICrateCollaboration): AsyncResponse<null>
  updateCollaboration(params: IUpdateCollaboration): AsyncResponse<ResponseCode>
}
