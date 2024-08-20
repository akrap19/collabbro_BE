import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { GenreService } from './genreService'

@autoInjectable()
export class GenreController {
  private readonly genreService: GenreService

  constructor(genreService: GenreService) {
    this.genreService = genreService
  }

  getDefault = async (req: Request, res: Response, next: NextFunction) => {
    const { defaultGenres, code } = await this.genreService.getDefaultGenres()
    if (!defaultGenres) {
      return next({ code })
    }

    return next({
      data: {
        defaultGenres
      },
      code: ResponseCode.OK
    })
  }
}
