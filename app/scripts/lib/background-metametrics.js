/*
import { getBackgroundMetaMetricState } from '../../../ui/app/selectors'
import { sendMetaMetricsEvent } from '../../../ui/app/helpers/utils/metametrics.util'

export default function backgroundMetaMetricsEvent (metaMaskState, version, eventData) {

const METAMETRICS_TRACKING_URL = inDevelopment
  ? 'http://www.metamask.io/metametrics'
  : 'http://www.metamask.io/metametrics-prod'
*/
export default function backEndMetaMetricsEvent (_metaMaskState, _eventData) {
  /*
  const stateEventData = getBackgroundMetaMetricState({ metamask: metaMaskState })
  if (stateEventData.participateInMetaMetrics) {
    sendMetaMetricsEvent({
      ...stateEventData,
      ...eventData,
      version,
      currentPath: '/background',
    })
  }
  */
}
