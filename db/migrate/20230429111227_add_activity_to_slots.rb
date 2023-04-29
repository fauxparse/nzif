class AddActivityToSlots < ActiveRecord::Migration[7.0]
  def change
    change_table :slots do |t|
      t.belongs_to :activity, null: true, foreign_key: { on_delete: :nullify }
    end
  end
end
