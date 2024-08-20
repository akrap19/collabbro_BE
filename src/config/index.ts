import { ServerClosedEvent } from 'typeorm'

interface ENV {
  COMMIT_HASH?: string
  PROJECT_NAME?: string
  NODE_ENV?: string
  PORT?: number
  API_BASE_URL?: string
  WEB_API_BASE_URL?: string
  LOG_TO_CONSOLE?: boolean
  LOG_REQUESTS?: boolean
  DOCS_USER?: string
  DOCS_PASSWORD?: string
  DB_HOSTNAME?: string
  DB_PORT?: number
  DB_USERNAME?: string
  DB_PASSWORD?: string
  DB_NAME?: string
  TYPEORM_SYNCHRONIZE?: boolean
  TYPEORM_RUN_MIGRATIONS?: boolean
  SALT_ROUNDS?: number
  ACCESS_TOKEN_SECRET?: string
  REFRESH_TOKEN_SECRET?: string
  ACCESS_TOKEN_EXPIRES_IN?: number
  REFRESH_TOKEN_EXPIRES_IN?: number
  RATE_LIMITER_POINTS?: number
  RATE_LIMITER_DURATION_IN_SECONDS?: number
  LOGIN_LIMITER_POINTS?: number
  LOGIN_LIMITER_DURATION_IN_SECONDS?: number
  LOGIN_LIMITER_BLOCKING_DURATION_IN_SECONDS?: number
  GOOGLE_SERVICE_ACCOUNT_KEY_LOCATION?: string
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME?: string
  GMAIL_MAIL?: string
  GMAIL_PASSWORD?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GOOGLE_REDIRECT_URL?: string
  PAY_PAL_SECRET?: string
  PAY_PAL_CLIENT_ID?: string
  PAY_PAL_URL?: string
  PAY_PAL_WEBHOOK_ID?: string
}

const environmentNumber = (envNum: unknown): number | undefined => {
  return envNum ? Number(envNum) : undefined
}

const environmentBoolean = (envBool: unknown): boolean | undefined => {
  return envBool === 'true' || envBool === 'false'
    ? envBool === 'true'
    : undefined
}

const getConfig = (): ENV => {
  return {
    COMMIT_HASH: process.env.COMMIT_HASH,
    PROJECT_NAME: process.env.PROJECT_NAME,
    NODE_ENV: process.env.NODE_ENV,
    PORT: environmentNumber(process.env.PORT),
    API_BASE_URL: process.env.API_BASE_URL,
    WEB_API_BASE_URL: process.env.WEB_API_BASE_URL,
    LOG_TO_CONSOLE: environmentBoolean(process.env.LOG_TO_CONSOLE),
    LOG_REQUESTS: environmentBoolean(process.env.LOG_REQUESTS),
    DOCS_USER: process.env.DOCS_USER,
    DOCS_PASSWORD: process.env.DOCS_PASSWORD,
    DB_HOSTNAME: process.env.DB_HOSTNAME,
    DB_PORT: environmentNumber(process.env.DB_PORT),
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    TYPEORM_SYNCHRONIZE: environmentBoolean(process.env.TYPEORM_SYNCHRONIZE),
    TYPEORM_RUN_MIGRATIONS: environmentBoolean(
      process.env.TYPEORM_RUN_MIGRATIONS
    ),
    SALT_ROUNDS: environmentNumber(process.env.SALT_ROUNDS),
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: environmentNumber(
      process.env.ACCESS_TOKEN_EXPIRES_IN
    ),
    REFRESH_TOKEN_EXPIRES_IN: environmentNumber(
      process.env.REFRESH_TOKEN_EXPIRES_IN
    ),
    RATE_LIMITER_POINTS: environmentNumber(process.env.RATE_LIMITER_POINTS),
    RATE_LIMITER_DURATION_IN_SECONDS: environmentNumber(
      process.env.RATE_LIMITER_DURATION_IN_SECONDS
    ),
    LOGIN_LIMITER_POINTS: environmentNumber(process.env.LOGIN_LIMITER_POINTS),
    LOGIN_LIMITER_DURATION_IN_SECONDS: environmentNumber(
      process.env.LOGIN_LIMITER_DURATION_IN_SECONDS
    ),
    LOGIN_LIMITER_BLOCKING_DURATION_IN_SECONDS: environmentNumber(
      process.env.LOGIN_LIMITER_BLOCKING_DURATION_IN_SECONDS
    ),
    GOOGLE_SERVICE_ACCOUNT_KEY_LOCATION:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_LOCATION,
    GOOGLE_CLOUD_STORAGE_BUCKET_NAME:
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME,
    GMAIL_MAIL: process.env.GMAIL_MAIL,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
    PAY_PAL_SECRET: process.env.PAY_PAL_SECRET,
    PAY_PAL_CLIENT_ID: process.env.PAY_PAL_CLIENT_ID,
    PAY_PAL_URL: process.env.PAY_PAL_URL,
    PAY_PAL_WEBHOOK_ID: process.env.PAY_PAL_WEBHOOK_ID
  }
}

type Config = Required<ENV>

const getSanitizedConfig = (config: ENV) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing value for ${key} in .env`)
    }
  }
  return config as Config
}

const config = getConfig()

export default getSanitizedConfig(config)
