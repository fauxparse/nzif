import { useState } from 'react';

import Icon from '@/atoms/Icon';

const HowWorkshopsWork = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="collapsible how-workshops-work" aria-expanded={expanded}>
      <button
        type="button"
        className="collapsible__header"
        onClick={() => setExpanded((current) => !current)}
      >
        <Icon name="chevronRight" aria-label={expanded ? 'Collapse' : 'Expand'} />
        <span>How workshop selection works</span>
      </button>
      <div className="collapsible__body">
        <dl className="timeline">
          <dt>
            <time dateTime="2023-08-07">7 Aug</time>
          </dt>
          <dd>
            <b>Earlybird registration</b>
            <p>
              You select all the workshops you’re interested in, in order of preference (up to three
              choices in each time slot)
            </p>
          </dd>
          <dt>
            <time dateTime="2023-09-01">1 Sep</time>
          </dt>
          <dd>
            <b>Earlybird registrations closed</b>
            <p>
              Our system assigns workshop places semi-randomly based on everyone’s preferences. This
              ensures everyone gets a fair chance at places. You’ll be placed on a waitlist for any
              workshops you didn’t get into.
            </p>
          </dd>
          <dt>
            <time dateTime="2023-09-08">8 Sep</time>
          </dt>
          <dd>
            <b>Final registrations</b>
            <p>
              Any remaining workshop places are available on a first-come, first served basis.
              Anyone can register for these places, or join waitlists for workshops that have
              already sold out.
            </p>
          </dd>
          <dt>
            <time dateTime="2023-10-07">7 Oct</time>
          </dt>
        </dl>
      </div>
    </div>
  );
};

export default HowWorkshopsWork;
