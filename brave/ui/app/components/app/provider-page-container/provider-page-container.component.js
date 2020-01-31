import ProviderPageContainer from '../../../../../../ui/app/components/app/provider-page-container/provider-page-container.component'
import { getEnvironmentType } from '../../../../../../app/scripts/lib/util'
import { ENVIRONMENT_TYPE_NOTIFICATION } from '../../../../../../app/scripts/lib/enums'

module.exports = class BraveProviderPageContainer extends ProviderPageContainer {
  componentDidMount () {
    if (getEnvironmentType(window.location.href) !== ENVIRONMENT_TYPE_NOTIFICATION) {
      const container = document.querySelector('#app-content')
      if (container) {
        container.setAttribute('style', 'overflow-y: scroll')
      }
    }
    super.componentDidMount()
  }

  componentWillUnmount () {
    const container = document.querySelector('#app-content')
    if (container) {
      container.removeAttribute('style')
    }
    super.componentWillUnmount()
  }
}
