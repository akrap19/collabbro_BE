import { Skill } from '../api/skill/skillModel'
import { User } from '../api/user/userModel'
import { UserSkill } from '../api/user_skill/userSkillModel'
import { Profession } from '../api/profession/professionModel'
import { UserProfession } from '../api/user_profession/userProfessionModel'
import { Instrument } from '../api/instrument/instrumentModel'
import { UserInstrument } from '../api/user_instrument/userInstrumentModel'
import { Genre } from '../api/genre/genreModel'
import { UserGenre } from '../api/user_genre/userGenreModel'
import { Goal } from '../api/goal/goalModel'
import { UserGoal } from '../api/user_goal/userGoalModel'
import { Project } from '../api/project/projectModel'
import { Media } from '../api/media/mediaModel'
import { ProjectInstrument } from '../api/project_instrument/projectInstrumentModel'
import { ProjectSkill } from '../api/project_skill/projectSkillModel'
import { FavoriteUser } from '../api/favorite_user/favoriteUserModel'
import { FavoriteProject } from '../api/favorite_project/favoriteProjectModel'
import { Notification } from '../api/notification/notificationModel'
import { Collaboration } from '../api/collaboration/collaborationModel'
import { UserSession } from '../api/user_session/userSessionModel'
import { Activity } from '../api/activity/activityModel'
import { Payment } from '../api/payment/paymentModel'
import { Chat } from '../api/chat/chatModel'
import { ChatUser } from '../api/chat_user/chatUserModel'
import { Message } from '../api/message/messageModel'

export const models = [
  User,
  Skill,
  UserSkill,
  Profession,
  UserProfession,
  Instrument,
  UserInstrument,
  Genre,
  UserGenre,
  Goal,
  UserGoal,
  Project,
  Media,
  ProjectInstrument,
  ProjectSkill,
  FavoriteUser,
  FavoriteProject,
  Notification,
  Collaboration,
  UserSession,
  Activity,
  Payment,
  Chat,
  ChatUser,
  Message
]
