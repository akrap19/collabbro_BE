import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { ActivityController } from './activityController'

const activityController = container.resolve(ActivityController)
export const activityRouter = express.Router()

activityRouter.get('/', requireToken, activityController.getActivities)
