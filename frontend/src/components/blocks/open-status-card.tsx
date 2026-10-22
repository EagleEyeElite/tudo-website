import { cacheLife, cacheTag } from 'next/cache'
import { getActivityIndicator } from '@/lib/api/activityIndicator'
import OpenStatusClient from '@/components/blocks/open-status-client'

// Time the cached status was rendered, like the previous ISR page: shown until the browser takes over with the current time
async function getRenderedAt() {
  'use cache'
  cacheLife('activityIndicator')
  cacheTag('activity-status')
  return Date.now()
}

export default async function OpenStatusCard() {
  const [initialState, renderedAt] = await Promise.all([getActivityIndicator(), getRenderedAt()])
  return (
    <OpenStatusClient
      fetchFnAction={getActivityIndicator}
      initialData={initialState}
      renderedAt={renderedAt}
    />
  )
}
