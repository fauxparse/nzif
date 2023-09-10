import React, { useEffect } from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { CSS, Transform } from '@dnd-kit/utilities';

import Icon from '@/atoms/Icon';
import { SessionParticipantFragment } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';

export interface ParticipantProps {
  registration: SessionParticipantFragment;
  fromWaitlist?: boolean;
  dragOverlay?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  handle?: (element: HTMLElement | null) => void;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  onRemove?(): void;
}

const Participant = React.memo(
  React.forwardRef<HTMLDivElement, ParticipantProps>(
    (
      {
        registration,
        fromWaitlist = false,
        dragOverlay,
        dragging,
        disabled,
        handle,
        index,
        listeners,
        sorting,
        style,
        transition,
        transform,
        onRemove,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) return;

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.removeProperty('cursor');
        };
      }, [dragOverlay]);

      return (
        <div
          ref={ref}
          className="session__participant-wrapper"
          style={
            {
              transition,
              transform: transform && CSS.Transform.toString(transform),
            } as React.CSSProperties
          }
        >
          <ContextMenu.Trigger>
            <div
              className="session__participant"
              data-id={registration.id}
              data-dragging={dragging || undefined}
              data-drag-overlay={dragOverlay || undefined}
              data-from-waitlist={fromWaitlist || undefined}
            >
              <div ref={handle} {...listeners} {...props}>
                <Icon name="drag" />
              </div>
              <div className="session__participant__name">{registration.user?.profile?.name}</div>
            </div>
          </ContextMenu.Trigger>
        </div>
      );
    }
  )
);

export default Participant;
