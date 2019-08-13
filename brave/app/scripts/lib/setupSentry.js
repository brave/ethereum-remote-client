module.exports = (_opts) => {
  return {
    captureMessage: (_msg, _extra = {}) => { /* no-op */ },
    captureException: (_msg, _extra = {}) => { /* no-op */ },
  }
}
