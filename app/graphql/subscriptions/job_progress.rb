module Subscriptions
  class JobProgress < BaseSubscription
    argument :id, ID, required: true
    argument :job_name, String, required: true

    field :error, String, null: true
    field :id, ID, null: false
    field :progress, Integer, null: false
    field :state, Types::JobStateType, null: false
    field :total, Integer, null: false

    def subscribe(id:, **)
      { id:, state: :pending, progress: 0, total: 1 }
    end
  end
end
