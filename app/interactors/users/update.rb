module Users
  class Update < ApplicationInteractor
    delegate :user, to: :context

    def call
      authorize! user, to: :update?

      user.update!(attributes)
    end

    def attributes
      @attributes ||= authorized_scope(
        context[:attributes].to_h,
        type: :data,
        with: UserPolicy,
        as: :attributes,
        scope_options: { with_record: user },
      )
    end
  end
end
