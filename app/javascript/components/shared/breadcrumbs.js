import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Button from 'atoms/button'
import TextLink from 'atoms/text_link'

const Breadcrumbs = forwardRef(({ className, back, children, ...props }, ref) => (
  <div ref={ref} className={classNames('breadcrumbs', className)} {...props}>
    {back && <Button as={Link} to={back} className="breadcrumbs__back" icon="back" />}
    {children}
  </div>
))

Breadcrumbs.displayName = 'Breadcrumbs'

Breadcrumbs.propTypes = {
  back: PropTypes.oneOfType([
    ReactRouterPropTypes.location,
    PropTypes.string,
  ]),
}

Breadcrumbs.defaultProps = {
  back: null,
}

export const BreadcrumbsLink = ({ className, children, ...props }) => (
  <TextLink className={classNames('breadcrumbs__link', className)} {...props}>
    {children}
  </TextLink>
)

Breadcrumbs.Link = BreadcrumbsLink

export default Breadcrumbs
