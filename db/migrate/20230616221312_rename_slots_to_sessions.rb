class RenameSlotsToSessions < ActiveRecord::Migration[7.0]
  def change
    rename_table :slots, :sessions
    rename_column :preferences, :slot_id, :session_id
  end
end
