class HiddenProfiles < ActiveRecord::Migration[7.1]
  def change
    change_table :profiles do |t|
      t.boolean :hidden, default: false, null: false
      t.index %i[hidden searchable]
    end
  end
end
