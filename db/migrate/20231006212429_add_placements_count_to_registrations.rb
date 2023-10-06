class AddPlacementsCountToRegistrations < ActiveRecord::Migration[7.0]
  def change
    add_column :registrations, :placements_count, :integer

    reversible do |dir|
      dir.up do
        Registration.find_each do |registration|
          Registration.reset_counters(registration.id, :placements)
        end
      end
    end
  end
end
