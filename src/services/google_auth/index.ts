import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { AsyncResponse, ResponseCode, ResponseMessage } from '../../interface'
import { logger } from '../../logger'
import { IGetGoogleUserInfo } from './interface'
import config from '../../config'

export const oAuth2Client = new OAuth2Client(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URL
)
export const getGoogleUserInfo = async ({
  token
}: IGetGoogleUserInfo): AsyncResponse<string> => {
  let code: ResponseCode = ResponseCode.OK

  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: config.GOOGLE_CLIENT_ID
    })

    let payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return { code: ResponseCode.FAILED_DEPENDENCY }
    }

    return {
      verifiedEmail: payload.email,
      code
    }
  } catch (err: any) {
    logger.error({
      code: ResponseCode.FAILED_DEPENDENCY,
      message: ResponseMessage.FAILED_DEPENDENCY,
      stack: err.stack
    })
  }

  return { code }
}
