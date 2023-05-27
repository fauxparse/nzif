module Users
  class UpdateSetting < ApplicationInteractor
    delegate :user, :id, :value, to: :context

    def call
      context.fail!(message: 'User not found') if user.blank?

      authorize! user, to: :update?

      user.update!(id => value)
    end
  end
end
