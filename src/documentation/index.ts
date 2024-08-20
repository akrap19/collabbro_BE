import _ from 'lodash'
import { authDocs } from '../api/auth/authDocs'
import { userDocs } from '../api/user/userDocs'
import { skillDocs } from '../api/skill/skillDocs'
import config from './../config'
import { professionDocs } from '../api/profession/professionDocs'
import { instrumentDocs } from '../api/instrument/instrumentDocs'
import { genreDocs } from '../api/genre/genreDocs'
import { goalDocs } from '../api/goal/goalDocs'
import { projectDocs } from '../api/project/projectDocs'
import { favoriteUserDocs } from '../api/favorite_user/favoriteUserDocs'
import { favoriteProjectDocs } from '../api/favorite_project/favoriteProjectDocs'
import { notificationDocs } from '../api/notification/notificationDocs'
import { collaborationDocs } from '../api/collaboration/collaborationDocs'
import { activityDocs } from '../api/activity/activityDocs'
import { paymentDocs } from '../api/payment/paymentDocs'
import { chatDocs } from '../api/chat/chatDocs'

export const APIDocumentation = {
  openapi: '3.0.1',
  info: {
    title: config.PROJECT_NAME,
    description: `${config.PROJECT_NAME} API`,
    version: '0.1'
  },
  basePath: '/',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  servers: [
    {
      url: config.API_BASE_URL
    }
  ],
  ..._.mergeWith(
    authDocs,
    userDocs,
    skillDocs,
    professionDocs,
    instrumentDocs,
    genreDocs,
    goalDocs,
    projectDocs,
    favoriteUserDocs,
    favoriteProjectDocs,
    notificationDocs,
    collaborationDocs,
    activityDocs,
    paymentDocs,
    chatDocs,
    (a: object, b: object) => {
      if (_.isArray(a)) {
        return a.concat(b)
      }
    }
  )
}
