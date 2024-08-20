import { ResponseCode } from '../../interface'
import { UserService } from '../user/userService'
import {
  AuthType,
  ILogin,
  IAuthService,
  ILogout,
  IRefreshToken,
  IResetPassword,
  ISendForgotPasswordEmail,
  ISignToken,
  IAuthenticatePassword,
  IRegister
} from './interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import {
  TokenType,
  generateToken,
  verifyToken
} from '../../services/jsonwebtoken'
import config from '../../config'
import { UserSessionService } from '../user_session/userSessionService'
import { UserSessionStatus } from '../user_session/interface'
import { autoInjectable, container } from 'tsyringe'
import { VerificationUIDType } from '../verification_uid/interface'
import { VerificationUIDService } from '../verification_uid/verificationUIDService'
import { compare, hashString } from '../../services/bcrypt'
import { getGoogleUserInfo } from '../../services/google_auth'

const userService = container.resolve(UserService)
const verificationUIDService = container.resolve(VerificationUIDService)
const userSessionService = container.resolve(UserSessionService)
@autoInjectable()
export class AuthService implements IAuthService {
  constructor() {}

  register = async ({ authType, email, token, password }: IRegister) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      let providedEmail = email

      if (authType === AuthType.GOOGLE && token) {
        const { verifiedEmail, code: googleCode } = await getGoogleUserInfo({
          token
        })

        if (!verifiedEmail) {
          return { code: googleCode }
        }

        providedEmail = verifiedEmail as string
        code = googleCode
      }

      const { user: existingUser } = await userService.getUserByEmail({
        email: providedEmail
      })

      if (existingUser) {
        return { code: ResponseCode.USER_ALREADY_REGISTRED }
      }

      const { user: newUser, code: createUserCode } =
        await userService.createUser({
          authType,
          email: providedEmail,
          password
        })

      return { user: newUser, code: createUserCode }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  login = async ({ authType, email, token, password }: ILogin) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      let providedEmail = email

      if (authType === AuthType.GOOGLE && token) {
        const { verifiedEmail, code: googleCode } = await getGoogleUserInfo({
          token
        })

        if (!verifiedEmail) {
          return { code: googleCode }
        }

        providedEmail = verifiedEmail as string
        code = googleCode
      }

      const { user, code: getUserCode } =
        await userService.getUserByEmailAndAuthType({
          email: providedEmail,
          authType
        })

      if (!user) {
        return { code: getUserCode }
      }

      if (authType === AuthType.PASSWORD && password) {
        const { passwordCorrect, code } = await this.authenticatePassword({
          user,
          password
        })

        if (!passwordCorrect) {
          return { code }
        }
      }

      return { user, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  authenticatePassword = async ({ user, password }: IAuthenticatePassword) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const passwordCorrect = await compare(password, user.password!)
      if (!passwordCorrect) {
        return { code: ResponseCode.WRONG_PASSWORD }
      }

      return { passwordCorrect, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  signToken = async ({ user }: ISignToken) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      const accessToken = generateToken(
        {
          sub: user.id
        },
        TokenType.ACCESS_TOKEN
      )
      const refreshToken = generateToken(
        { sub: user.id },
        TokenType.REFRESH_TOKEN
      )
      const { userSession, code: userSessionCode } =
        await userSessionService.storeUserSession({
          userId: user.id,
          refreshToken
        })
      if (!userSession) {
        return { code: userSessionCode }
      }
      const expiresAt = new Date(
        Date.now() + Number(config.ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
      )
      return {
        tokens: {
          accessToken,
          refreshToken,
          accessTokenExpiresAt: expiresAt,
          refreshTokenExpiresAt: userSession.expiresAt
        },
        code
      }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }
    return { code }
  }

  refreshToken = async ({ refreshToken }: IRefreshToken) => {
    let code = ResponseCode.OK
    try {
      const decodedToken = verifyToken<{ sub: string; exp: number }>(
        refreshToken,
        TokenType.REFRESH_TOKEN
      )
      if (!decodedToken) {
        return { code: ResponseCode.SESSION_EXPIRED }
      }
      const refreshTokenExpiry = new Date(decodedToken.exp * 1000)
      if (refreshTokenExpiry < new Date()) {
        return { code: ResponseCode.SESSION_EXPIRED }
      }
      const newRefreshToken = generateToken(
        {
          sub: decodedToken.sub
        },
        TokenType.REFRESH_TOKEN
      )
      const { userSession, code: updateUserSessionCode } =
        await userSessionService.updateUserSession({
          userId: decodedToken.sub,
          refreshToken: newRefreshToken
        })
      if (!userSession) {
        return { code: updateUserSessionCode }
      }
      const accessToken = generateToken(
        {
          sub: decodedToken.sub
        },
        TokenType.ACCESS_TOKEN
      )
      const expiresAt = new Date(
        Date.now() + Number(config.ACCESS_TOKEN_EXPIRES_IN) * 60 * 1000
      )
      return {
        tokens: {
          accessToken,
          refreshToken,
          accessTokenExpiresAt: expiresAt,
          refreshTokenExpiresAt: userSession.expiresAt
        },
        code
      }
    } catch (err: any) {
      code = ResponseCode.INVALID_TOKEN
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }
    return { code }
  }

  logout = async ({ userId }: ILogout) => {
    let code = ResponseCode.OK

    try {
      const { code: userSessionCode } =
        await userSessionService.expireUserSession({
          userId,
          status: UserSessionStatus.LOGGED_OUT
        })

      return { code: userSessionCode }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  sendForgotPasswordEmail = async ({ email }: ISendForgotPasswordEmail) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const { user, code: userCode } = await userService.getUserByEmail({
        email
      })
      if (!user) {
        return { code: userCode }
      }

      const { uids, code: uidCode } =
        await verificationUIDService.setVerificationUID({
          userId: user.id,
          type: VerificationUIDType.RESET_PASSWORD
        })
      if (!uids) {
        return { code: uidCode }
      }

      return { code: ResponseCode.OK }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  resetPassword = async ({ uid, hashUid, password }: IResetPassword) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const { verificationUID, code: verificationUIDCode } =
        await verificationUIDService.verifyUID({
          uid,
          hashUid,
          type: VerificationUIDType.RESET_PASSWORD
        })
      if (!verificationUID) {
        return { code: verificationUIDCode }
      }

      const hashedPassword = await hashString(password)

      const { code: editCode } = await userService.updatePassword({
        userId: verificationUID.userId,
        password: hashedPassword
      })
      if (editCode != ResponseCode.OK) {
        return { code: editCode }
      }

      await verificationUIDService.clearVerificationUID({
        userId: verificationUID.userId,
        type: VerificationUIDType.RESET_PASSWORD
      })

      return { code: ResponseCode.OK }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }
}
