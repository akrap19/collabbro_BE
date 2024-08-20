import { AsyncResponse, ResponseCode } from '../../interface'
import { User } from '../user/userModel'

export enum AuthType {
  GOOGLE = 'Google',
  PASSWORD = 'Password'
}

interface TokenResponse {
  accessToken: string
  accessTokenExpiresAt: Date
  refreshToken: string
  refreshTokenExpiresAt: Date
}

export interface ISignToken {
  user: User
}

export interface IRefreshToken {
  refreshToken: string
}

export interface ILogout {
  userId: string
}

export interface ISendForgotPasswordEmail {
  email: string
}

export interface IResetPassword {
  uid: string
  hashUid: string
  password: string
}

export interface ILogin {
  authType: AuthType
  token?: string
  email: string
  password?: string
}

export interface IRegister {
  authType: AuthType
  token?: string
  email: string
  password?: string
}

export interface IAuthenticatePassword {
  user: User
  password: string
}

export interface IAuthService {
  login(params: ILogin): AsyncResponse<User>
  register(params: IRegister): AsyncResponse<User>
  signToken(params: ISignToken): AsyncResponse<TokenResponse>
  refreshToken(params: IRefreshToken): AsyncResponse<TokenResponse>
  logout(params: ILogout): AsyncResponse<boolean>
  sendForgotPasswordEmail(
    params: ISendForgotPasswordEmail
  ): AsyncResponse<ResponseCode>
  authenticatePassword(params: IAuthenticatePassword): AsyncResponse<boolean>
  resetPassword(params: IResetPassword): AsyncResponse<ResponseCode>
}
