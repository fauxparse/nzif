import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import MomentPropTypes from 'react-moment-proptypes'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router'
import compose from 'lib/compose'
import humanize from 'lib/humanize'
import deburr from 'lodash/deburr'
import kebabCase from 'lodash/kebabCase'
import lowerFirst from 'lodash/lowerFirst'
import Highlighter from 'react-highlight-words'
import PropTypes from 'lib/proptypes'
import {
  TIMETABLE_QUERY,
  CREATE_ACTIVITY_MUTATION,
} from '../../../queries'
import Icon from '../../../atoms/icon'
import Autocomplete from '../../autocomplete'

const MenuItem = ({ label, selected, selectedText, value: { id, type }, ...props }) => (
  <li className="new-session__menu-item" aria-selected={selected || undefined} {...props}>
    <Icon name={id ? kebabCase(type) : 'add'} />
    <div className="new-session__activity-details">
      <Highlighter
        className="highlight"
        textToHighlight={label}
        searchWords={selectedText.split(/\s+/)}
        sanitize={deburr}
      />
      <span className="new-session__activity-description">
        {id ? humanize(type) : `New ${lowerFirst(humanize(type))}`}
      </span>
    </div>
  </li>
)

MenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  selectedText: PropTypes.string.isRequired,
  value: PropTypes.shape({
    id: PropTypes.id,
    type: PropTypes.string.isRequired,
  }).isRequired,
}

class NewSession extends React.Component {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    activityTypes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    startsAt: MomentPropTypes.momentObj,
    endsAt: MomentPropTypes.momentObj,
    match: ReactRouterPropTypes.match.isRequired,
    client: PropTypes.any.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  submit = ({ value: activity }) => {
    if (activity.id) {
      this.createSession(activity)
    } else {
      const { year } = this.props.match.params
      this.createActivity(year, activity.type, activity.name)
    }
  }

  createActivity = (year, type, name) => {
    const { client } = this.props
    const variables = {
      year,
      type,
      attributes: {
        name,
      },
    }

    client.mutate({
      mutation: CREATE_ACTIVITY_MUTATION,
      variables,
      errorPolicy: 'all',
      update: (cache, { data: { createActivity: activity } }) => {
        const { festival, ...rest } = cache.readQuery({
          query: TIMETABLE_QUERY,
          variables: { year },
        })
        festival.activities.push(activity)
        cache.writeQuery({
          query: TIMETABLE_QUERY,
          variables: { year },
          data: { festival, ...rest },
        })

        this.createSession(activity)
      },
    })
  }

  createSession = (activity) => {
    const { startsAt, endsAt, onSubmit } = this.props
    onSubmit({
      startsAt,
      endsAt,
      activity,
    })
  }

  search = (text, options) => {
    if (text) {
      const re = new RegExp(deburr(text).trim().split(/\s+/).map(w => `(?=.*${w})`).join(''), 'i')
      return [
        ...options.filter(({ label }) => deburr(label).match(re)),
        ...this.newActivities(text),
      ]
    } else {
      return []
    }
  }

  newActivities = (name) => {
    const { activityTypes } = this.props

    if (!this._newActivities) {
      this._newActivities = activityTypes.map(type => ({
        label: name,
        value: { type, name },
        id: `__${type}`,
      }))
    }

    this._newActivities.forEach(option => {
      option.label = option.value.name = name
    })
    return this._newActivities
  }

  render() {
    const { activities } = this.props

    return (
      <section className="new-session">
        <Autocomplete
          options={activities.map(a => ({
            id: a.id,
            label: a.name,
            value: a,
            key: `${a.type}--${a.id}`,
          }))}
          placeholder="Type activity name…"
          menuItemComponent={MenuItem}
          search={this.search}
          onChange={this.submit}
        />
      </section>
    )
  }
}

export default compose(withRouter, withApollo)(NewSession)
