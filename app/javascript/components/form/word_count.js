import React, { useRef } from 'react'
import PropTypes from 'lib/proptypes'
import words from 'lodash/words'
import Textarea from './textarea'

const WordCount = ({ min, max, value, as: Component = Textarea, ...props }) => {
  const progressIndicator = useRef()
  const count = words(value || '').length
  const ratio = Math.min(1, count / max)
  const pathLength = progressIndicator.current ? progressIndicator.current.getTotalLength() : 100

  return (
    <>
      <Component value={value} {...props} />
      <div className="word-count">
        <svg className="word-count__progress" viewBox="-8 -8 16 16">
          <circle cx={0} cy={0} r={7} />
          <path
            d="M0-7a7 7 0 0 1 0 14a7 7 0 0 1 0 -14"
            ref={progressIndicator}
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: (1 - ratio) * pathLength,
            }}
          />
        </svg>
        <span className="word-count__limit">
          {[count, [min, max].filter(Boolean).join('–')].filter(x => x || (x === 0)).join(' of ')}
          {' words'}
        </span>
      </div>
    </>
  )
}

WordCount.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.string,
  as: PropTypes.component,
}

export default WordCount
