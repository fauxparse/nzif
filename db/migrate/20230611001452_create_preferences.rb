class CreatePreferences < ActiveRecord::Migration[7.0]
  def change
    create_table :preferences do |t|
      t.belongs_to :registration, null: false, foreign_key: true
      t.belongs_to :slot, null: false, foreign_key: true
      t.timestamp :starts_at
      t.integer :position

      t.timestamps

      t.index %w[registration_id starts_at position], unique: true
    end
  end
end
