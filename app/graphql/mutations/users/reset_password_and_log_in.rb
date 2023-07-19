module Mutations
  module Users
    class ResetPasswordAndLogIn < GraphqlDevise::Mutations::UpdatePasswordWithToken
      field :authenticatable, Types::UserType, null: false

      def resolve(reset_password_token:, **attrs)
        super do |user|
          controller.sign_in(user)
        end
      end

      def resource_class
        User
      end
    end
  end
end
