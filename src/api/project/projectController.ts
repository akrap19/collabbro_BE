import { NextFunction, Request, Response } from 'express'
import { autoInjectable } from 'tsyringe'
import { ProjectService } from './projectService'

@autoInjectable()
export class ProjectController {
  private readonly projectService: ProjectService

  constructor(projectService: ProjectService) {
    this.projectService = projectService
  }

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    const { id, storageUsage, profileHandle, email } = req.user
    const {
      name,
      description,
      projectType,
      deadline,
      paid,
      tags,
      currencyCode,
      totalAmount,
      instrumentIds,
      skills,
      mediaFiles
    } = res.locals.input

    const { mediaInfo, code: adminCode } =
      await this.projectService.createProject({
        userId: id,
        storageUsage,
        name,
        description,
        projectType,
        deadline,
        paid,
        tags,
        currencyCode,
        totalAmount,
        instrumentIds,
        skills,
        mediaFiles,
        profileHandle: profileHandle ? profileHandle : email
      })

    return next({ mediaInfo, code: adminCode })
  }

  getProjects = async (req: Request, res: Response, next: NextFunction) => {
    const {
      type,
      genre,
      country,
      skill,
      instrument,
      profession,
      page,
      perPage
    } = res.locals.input
    const { projects, code: projectCode } =
      await this.projectService.getProjects({
        type,
        genre,
        country,
        skill,
        instrument,
        profession,
        page,
        perPage
      })

    return next({ projects, code: projectCode })
  }

  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    const { id: projectId } = res.locals.input

    const { project, code } = await this.projectService.getProjectById({
      projectId
    })

    if (project) {
      const { project, code: projectCode } =
        await this.projectService.addProjectView({ projectId })
      return next({ project, code: projectCode })
    }
    return next({ code })
  }
}
