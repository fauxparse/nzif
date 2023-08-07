class AddCompletedAtToRegistrations < ActiveRecord::Migration[7.0]
  def change
    add_column :registrations, :completed_at, :timestamp
    add_index :registrations, :completed_at
  end
end
