import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { InstrumentController } from './instrumentController'

const instrumentController = container.resolve(InstrumentController)
export const instrumentRouter = express.Router()

instrumentRouter.get(
  '/getDefault',
  requireToken,
  instrumentController.getDefault
)
