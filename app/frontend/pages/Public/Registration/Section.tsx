import { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import { isString } from 'lodash-es';

type SectionProps = PropsWithChildren<{
  title: ReactNode;
  description: ReactNode;
  aside?: ReactNode;
  className?: string;
}>;

const Section: React.FC<SectionProps> = ({ title, description, aside, children, className }) => (
  <fieldset className={clsx('registration__section', className)}>
    <div className="registration__section__description">
      <h3>{title}</h3>
      {isString(description) ? <p>{description}</p> : description}
    </div>
    <div className="registration__fields">{children}</div>
    {aside && <aside className="registration__aside">{aside}</aside>}
  </fieldset>
);

export default Section;
