import Analytics from './analytics/Analytics'
import AnalyticsNavLink from './analytics/AnalyticsNavLink'
import ScrapingTasks from './scraping/ScrapingTasks'
import ScrapingTasksNavLink from './scraping/ScrapingTasksNavLink'
import PlatformCell from '../../../components/PlatformCell'
import DateCell from '../../../components/DateCell'
import UsernameCell from '../../../components/UsernameCell'
import PostIdCell from '../../../components/PostIdCell'
import AvatarCell from '../../../components/AvatarCell'
import ThumbnailCell from '../../../components/ThumbnailCell'

export const importMap = {
  '#analytics': Analytics,
  '#analyticsNav': AnalyticsNavLink,
  '#scrapingTasks': ScrapingTasks,
  '#scrapingTasksNav': ScrapingTasksNavLink,
  '#platformCell': PlatformCell,
  '#dateCell': DateCell,
  '#usernameCell': UsernameCell,
  '#postIdCell': PostIdCell,
  '#avatarCell': AvatarCell,
  '#thumbnailCell': ThumbnailCell,
}