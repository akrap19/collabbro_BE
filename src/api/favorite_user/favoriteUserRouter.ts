import express from 'express'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { validate } from '../../middleware/validation'
import { FavoriteUserController } from './favoriteUserController'
import { toogleFavoriteUserSchema } from './favoriteUserInput'

const favoriteUserController = container.resolve(FavoriteUserController)
export const favoriteUserRouter = express.Router()

favoriteUserRouter.put(
  '/',
  validate(toogleFavoriteUserSchema),
  requireToken,
  favoriteUserController.toogleFavoriteUser
)
favoriteUserRouter.get(
  '/',
  requireToken,
  favoriteUserController.getFavoritesForUser
)
