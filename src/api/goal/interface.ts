import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Goal } from './goalModel'

export interface ICheckGoal extends IServiceMethod {
  goalContent: string
}

export interface ICreateGoal extends IServiceMethod {
  goalContent: string
}

export interface IHandleGoalsOnboarding extends IServiceMethod {
  userId: string
  goals: string[]
}

export interface IGoalService {
  getDefaultGoals(): AsyncResponse<Goal[]>
  checkGoal(params: ICheckGoal): AsyncResponse<string>
  createGoal(params: ICreateGoal): AsyncResponse<string>
  handleGoalsOnboarding(
    params: IHandleGoalsOnboarding
  ): AsyncResponse<ResponseCode>
}
