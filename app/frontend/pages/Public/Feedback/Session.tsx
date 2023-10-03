import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import Radio from '@/atoms/Radio';
import { useFeedbackListQuery } from '@/graphql/types';
import AutoResize from '@/helpers/AutoResize';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';
import sentence from '@/util/sentence';

import './Feedback.css';

const feedbackFormSchema = z.object({
  rating: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1).max(7).optional()
  ),
  positive: z.string().optional(),
  constructive: z.string().optional(),
  testimonial: z.string().optional(),
});

type FeedbackFormSchema = z.infer<typeof feedbackFormSchema>;

export const Component: React.FC = () => {
  const { loading, data } = useFeedbackListQuery();

  const { id } = useTypedParams(ROUTES.FEEDBACK.SESSION);

  const session = useMemo(
    () => data?.registration?.sessions?.find((s) => s.id === id) || null,
    [data, id]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackFormSchema>({
    resolver: zodResolver(feedbackFormSchema),
  });

  const onSubmit: SubmitHandler<FeedbackFormSchema> = (data) => {
    console.log(data);
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
            <label>How would you rate this workshop overall?</label>
            <div className="likert">
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
          </form>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
