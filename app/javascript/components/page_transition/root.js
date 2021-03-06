import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PageTransition from './group'
import none from './none'
import fade from './fade'
import { push, pop } from './push'
import popOver from './pop_over'

const GROUPS = [
  ['login', /^(login|signup|password)/],
  ['admin', /^admin/],
  ['misc', /.*/],
]

const TRANSITIONS = {
  misc: {
    admin: push,
    login: popOver,
  },
  login: {
    admin: popOver,
    misc: popOver,
  },
  admin: {
    login: popOver,
    misc: pop,
  },
}

const findGroup = (key) =>
  GROUPS.find(([_name, ...patterns]) => patterns.find(pattern => pattern.test(key)))[0]

const TransitionContainer = ({ className, children, ...props }) => (
  <div className={classNames('root-transition-container', className)} {...props}>
    {children}
  </div>
)

class RootPageTransition extends React.Component {
  static propTypes = {
    pageKey: PropTypes.string,
  }

  state = { pageKey: '', transition: none }

  static getDerivedStateFromProps({ pageKey }, state) {
    if (pageKey !== state.pageKey) {
      const oldGroup = findGroup(state.pageKey)
      const newGroup = findGroup(pageKey)

      return { pageKey, transition: TRANSITIONS[oldGroup][newGroup] || fade }
    }

    return {}
  }

  render() {
    const { pageKey, children } = this.props
    const { transition } = this.state

    return (
      <Fragment>
        <PageTransition pageKey={pageKey} {...transition} component={TransitionContainer}>
          {children}
        </PageTransition>
      </Fragment>
    )
  }
}

export default RootPageTransition
