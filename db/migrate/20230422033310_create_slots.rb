class CreateSlots < ActiveRecord::Migration[7.0]
  def change
    create_table :slots do |t|
      t.belongs_to :festival, null: false, foreign_key: { on_delete: :cascade }
      t.belongs_to :venue, null: true, foreign_key: { on_delete: :nullify }
      t.timestamp :starts_at, null: false
      t.timestamp :ends_at, null: false
      t.string :activity_type

      t.timestamps

      t.index %i[festival_id venue_id starts_at ends_at], name: 'index_slots_on_everything'
    end
  end
end
