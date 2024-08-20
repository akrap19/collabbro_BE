import express from 'express'

import { docsRouter } from './docs'
import { authRouter } from '../api/auth/authRouter'
import { skillRouter } from '../api/skill/skillRouter'
import { professionRouter } from '../api/profession/professionRouter'
import { instrumentRouter } from '../api/instrument/instrumentRouter'
import { genreRouter } from '../api/genre/genreRoutes'
import { goalRouter } from '../api/goal/goalRouter'
import { projectRouter } from '../api/project/projectRouter'
import { favoriteProjectRouter } from '../api/favorite_project/favoriteProjectRouter'
import { favoriteUserRouter } from '../api/favorite_user/favoriteUserRouter'
import { userRouter } from '../api/user/userRouter'
import { collaborationRouter } from '../api/collaboration/collaborationRouter'
import { notificationRouter } from '../api/notification/notificationRouter'
import { activityRouter } from '../api/activity/activityRouter'
import { paymentRouter } from '../api/payment/paymentRouter'
import { chatRouter } from '../api/chat/chatRouter'

const router = express.Router()

router.use('/api-docs', docsRouter)
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/skill', skillRouter)
router.use('/profession', professionRouter)
router.use('/instrument', instrumentRouter)
router.use('/genre', genreRouter)
router.use('/goal', goalRouter)
router.use('/project', projectRouter)
router.use('/favoriteProject', favoriteProjectRouter)
router.use('/favoriteUser', favoriteUserRouter)
router.use('/collaboration', collaborationRouter)
router.use('/notification', notificationRouter)
router.use('/activity', activityRouter)
router.use('/payment', paymentRouter)
router.use('/chat', chatRouter)

export default router
