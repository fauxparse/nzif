module Users
  class UpdatePreference
    include Interactor

    delegate :user, :id, :value, to: :context

    def call
      context.fail!(message: 'User not found') if user.blank?

      user.update!(id => value)
    end
  end
end
