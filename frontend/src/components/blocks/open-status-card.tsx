import { getActivityIndicator } from '@/lib/api/activityIndicator'
import OpenStatusClient from '@/components/blocks/open-status-client'

export default async function OpenStatusCard() {
  const initialState = await getActivityIndicator()

  return (
    <OpenStatusClient
      fetchFnAction={getActivityIndicator}
      initialData={initialState}
    />
  )
}
