class AddCapacityToSessions < ActiveRecord::Migration[7.0]
  def change
    add_column :sessions, :capacity, :integer

    Session.where(activity_type: 'Workshop').update_all(capacity: 16) # rubocop:disable Rails/SkipsModelValidations
  end
end
