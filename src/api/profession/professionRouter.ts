import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { ProfessionController } from './professionController'

const professionController = container.resolve(ProfessionController)
export const professionRouter = express.Router()

professionRouter.get(
  '/getDefault',
  requireToken,
  professionController.getDefault
)
