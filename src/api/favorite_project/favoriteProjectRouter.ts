import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { FavoriteProjectController } from './favoriteProjectController'
import { validate } from '../../middleware/validation'
import { toogleFavoriteProjectSchema } from './favoriteProjectInput'

const favoriteProjectController = container.resolve(FavoriteProjectController)
export const favoriteProjectRouter = express.Router()

favoriteProjectRouter.put(
  '/',
  validate(toogleFavoriteProjectSchema),
  requireToken,
  favoriteProjectController.toogleFavoriteProject
)
favoriteProjectRouter.get(
  '/',
  requireToken,
  favoriteProjectController.getFavoriteProjectsForUser
)
