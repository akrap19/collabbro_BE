import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { GoalController } from './goalController'

const goalController = container.resolve(GoalController)
export const goalRouter = express.Router()

goalRouter.get('/getDefault', requireToken, goalController.getDefault)
