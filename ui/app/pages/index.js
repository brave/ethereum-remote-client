import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Routes from './routes'
import { I18nProvider, LegacyI18nProvider } from '../contexts/i18n'
import { MetaMetricsProvider, LegacyMetaMetricsProvider } from '../contexts/metametrics'

const Index = (props) => {
  const { store } = props

  return (
    <Provider store={store}>
      <HashRouter hashType="noslash">
        <MetaMetricsProvider>
          <LegacyMetaMetricsProvider>
            <I18nProvider>
              <LegacyI18nProvider>
                <Routes />
              </LegacyI18nProvider>
            </I18nProvider>
          </LegacyMetaMetricsProvider>
        </MetaMetricsProvider>
      </HashRouter>
    </Provider>
  )
}

Index.propTypes = {
  store: PropTypes.object,
}

export default Index
