module GraphqlDevise
  module Mutations
    class Register < Base
      argument :name, String, required: true
    end
  end
end
