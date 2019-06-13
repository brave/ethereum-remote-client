module.exports = {
  container: {
    general: {
      marginRight: '5px',
      padding: '5px 9px',
      borderRadius: '8px'
    },
    active: {
      background: 'rgb(94, 97, 117)'
    },
    inactive: {
      background: 'inherit'
    }
  },

  title: {
    general: {
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '0.5px'
    },
    active: {
      color: 'white'
    },
    inactive: {}
  },

  dropdownContainer: {
    background: '#fff',
    minWidth: '275px',
    position: 'absolute',
    top: '15px',
    borderRadius: '5px',
    boxShadow: 'grey 0px 0px 2px 1px'
  },

  dropdownItem: {
    borderBottom: '1px solid #dedede'
  },

  caratContainer: {
    display: 'inline-block',
    padding: '5px',
    position: 'relative',
    top: '-1px'
  },

  plusContainer: {
    display: 'inline-block',
    padding: '5px',
    position: 'relative',
    top: '2px'
  },

  leftPadding: {
    width: '7px',
    display: 'inline-block'
  }
}