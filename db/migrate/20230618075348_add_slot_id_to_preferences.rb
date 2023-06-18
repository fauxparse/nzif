class AddSlotIdToPreferences < ActiveRecord::Migration[7.0]
  def change
    drop_table :preferences do |t|
      t.belongs_to :registration, null: false, foreign_key: true
      t.belongs_to :session, null: false, foreign_key: true
      t.timestamp :starts_at
      t.integer :position

      t.timestamps

      t.index %w[registration_id starts_at position], unique: true
    end

    create_table :preferences do |t|
      t.belongs_to :registration, null: false, foreign_key: true
      t.belongs_to :session, null: false, foreign_key: { on_delete: :cascade }
      t.belongs_to :slot,
        type: :timestamp,
        null: false,
        foreign_key: false
      t.integer :position

      t.timestamps

      t.index %w[registration_id slot_id position], unique: true
    end
  end
end
