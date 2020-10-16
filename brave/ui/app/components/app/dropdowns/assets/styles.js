module.exports = {
  container: {
    general: {
      marginRight: '7px',
      padding: '6px 9px 3px 9px',
      borderRadius: '8px',
      background: '#5E6175'
    },
    active: {
      cursor: 'pointer',
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
  },

  menu: {
    position: 'absolute',
    top: '65px',
    width: '309px',
    zIndex: '55px',
    background: '#fff'
  },

  innerMenu: {
    padding: '18px 8px',
    background: '#fff'
  }
}