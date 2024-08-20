import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { GenreController } from './genreController'

const genreController = container.resolve(GenreController)
export const genreRouter = express.Router()

genreRouter.get('/getDefault', requireToken, genreController.getDefault)
