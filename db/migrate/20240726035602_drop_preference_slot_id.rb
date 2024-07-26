class DropPreferenceSlotId < ActiveRecord::Migration[7.0]
  def up
    remove_column :preferences, :slot_id
  end
end
