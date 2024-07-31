import defaultSettings from '@/settings'

const title = defaultSettings.title || '奔腾智能'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
