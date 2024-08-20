import { AsyncResponse, IServiceMethod } from '../../interface'

export interface ICreateUserGoal extends IServiceMethod {
  userId: string
  goalId: string
}

export interface IUserGoalService {
  createUserGoal(params: ICreateUserGoal): AsyncResponse<string>
}
