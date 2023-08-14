class CreateAllocations < ActiveRecord::Migration[7.0]
  def change
    create_table :allocations do |t|
      t.belongs_to :festival, null: false, foreign_key: { on_delete: :cascade }
      t.jsonb :original, null: false, default: {}
      t.jsonb :overrides, null: false, default: {}
      t.integer :score, null: false, default: 0
      t.timestamps
      t.timestamp :completed_at, null: true
    end
  end
end
