module Types
  class BaseActivity < BaseObject
    def self.casts(*role_names) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      role_names.each do |role|
        field role.to_s.pluralize.to_sym, [Types::PersonType], null: false,
          description: role.to_s.pluralize.humanize

        define_method(role.to_s.pluralize) do
          dataloader
            .with(Sources::ActivityCast, context:)
            .load(object.id)
            .select { |person| person.role == role }
            .map(&:profile)
        end
      end
    end

    def self.activity_class
      @activity_class ||= "::#{name.demodulize.chomp('Type')}".constantize
    end

    def self.inherited(subclass)
      super
      subclass.casts(*subclass.activity_class.roles)
    end
  end
end
