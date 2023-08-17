class AddDataToAllocations < ActiveRecord::Migration[7.0]
  def up
    change_table :allocations, bulk: true do |t|
      t.jsonb :data, default: {}, null: true
      t.remove :original
      t.remove :overrides
    end
  end

  def down
    change_table :allocations do |t|
      t.jsonb :original, null: false, default: {}
      t.jsonb :overrides, null: false, default: {}
      t.remove :data
    end
  end
end
