module Types
  class JobStateType < BaseEnum
    value :pending, 'Job is pending', value: :pending
    value :working, 'Job is working', value: :working
    value :completed, 'Job is completed', value: :completed
    value :failed, 'Job has failed', value: :failed
  end
end
