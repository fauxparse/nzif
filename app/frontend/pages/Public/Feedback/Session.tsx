import { useEffect, useMemo, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import Radio from '@/atoms/Radio';
import {
  FeedbackAttributes,
  useFeedbackListQuery,
  useSaveFeedbackMutation,
  WorkshopFeedbackFragmentDoc,
} from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';
import sentence from '@/util/sentence';

import './Feedback.css';

const feedbackFormSchema = z.object({
  rating: z.preprocess(
    (a) => parseInt(z.string().parse(a || '0'), 10) || undefined,
    z.number().min(1).max(7).optional()
  ),
  positive: z.string().optional(),
  constructive: z.string().optional(),
  testimonial: z.string().optional(),
});

type FeedbackFormSchema = z.infer<typeof feedbackFormSchema>;

export const Component: React.FC = () => {
  const { loading, data } = useFeedbackListQuery();

  const registration = data?.registration;

  const { id } = useTypedParams(ROUTES.FEEDBACK.SESSION);

  const session = useMemo(
    () => data?.registration?.sessions?.find((s) => s.id === id) || null,
    [data, id]
  );

  const feedback = useMemo(
    () => data?.registration?.feedback?.find((f) => f.session.id === id) || null,
    [data, id]
  );

  const { register, handleSubmit, reset } = useForm<FeedbackFormSchema>({
    resolver: zodResolver(feedbackFormSchema),
  });

  const likert = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feedback) return;
    reset({
      // Have to do weird things to make react-hook-form happy
      rating: ((feedback.rating && String(feedback.rating)) || undefined) as unknown as
        | number
        | undefined,
      positive: feedback.positive || '',
      constructive: feedback.constructive || '',
      testimonial: feedback.testimonial || '',
    });
  }, [feedback, reset]);

  const [save, { loading: saving }] = useSaveFeedbackMutation();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FeedbackFormSchema> = (data) => {
    save({
      variables: {
        sessionId: id,
        attributes: data as FeedbackAttributes,
      },
      update: (cache, { data }) => {
        const feedback = data?.saveFeedback?.feedback;
        if (!feedback || !registration) return;
        const ref = cache.writeFragment({
          id: cache.identify(feedback),
          fragment: WorkshopFeedbackFragmentDoc,
          fragmentName: 'WorkshopFeedback',
          data: feedback,
        });
        cache.modify({
          id: cache.identify(registration),
          fields: {
            feedback: (existing) => [...existing, ref],
          },
        });
      },
    }).then(() => {
      navigate(ROUTES.FEEDBACK.path);
    });
  };

  return (
    <BreadcrumbProvider label="Workshop feedback" path="feedback">
      <div className="feedback-page">
        <PageHeader>
          <Breadcrumbs />
          <h1>{session?.activity?.name}</h1>
          <div className="feedback-session__tutor">
            {sentence((session?.activity?.presenters || []).map((p) => p.name))}
          </div>
          <div className="feedback-session__date">
            {session?.startsAt?.plus(0)?.toFormat('EEEE d MMMM')}
          </div>
        </PageHeader>
        <div className="inset">
          <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={loading || saving || undefined}>
              <label>How would you rate this workshop overall?</label>
              <div className="likert" ref={likert}>
                <small>It was the worst!</small>
                {Array.from({ length: 7 }).map((_, i) => (
                  <Radio key={i + 1} value={i + 1} {...register('rating')} />
                ))}
                <small>It was the best!</small>
              </div>

              <label>What do you think went really well in this workshop?</label>
              <AutoResize>
                <Input as="textarea" rows={5} {...register('positive')} />
              </AutoResize>

              <label>Could anything have helped you get more out of this workshop?</label>
              <AutoResize>
                <Input as="textarea" rows={5} {...register('constructive')} />
              </AutoResize>

              <label>
                Would you like to provide a testimonial for the workshop tutor? This can help them
                bring the work to new groups at other festivals.
              </label>
              <AutoResize>
                <Input as="textarea" rows={5} {...register('testimonial')} />
              </AutoResize>
              <p>
                That’s it! Thanks for taking the time to provide your feedback. Your feedback is
                anonymous (unless you, like, put your name in it).
              </p>
              <Button large primary type="submit" text="Send feedback" />
            </fieldset>
          </form>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
