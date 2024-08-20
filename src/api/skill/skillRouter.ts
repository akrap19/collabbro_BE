import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { SkillController } from './skillController'

const skillController = container.resolve(SkillController)
export const skillRouter = express.Router()

skillRouter.get('/getDefault', requireToken, skillController.getDefault)
