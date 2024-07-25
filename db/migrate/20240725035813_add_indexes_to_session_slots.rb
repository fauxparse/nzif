class AddIndexesToSessionSlots < ActiveRecord::Migration[7.0]
  def change
    change_table :session_slots do |t|
      t.index %i[starts_at ends_at]
      t.index %i[session_id]
      t.index %i[festival_id]
    end
  end
end
