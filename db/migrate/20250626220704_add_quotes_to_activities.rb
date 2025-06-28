class AddQuotesToActivities < ActiveRecord::Migration[7.1]
  def change
    change_table :activities do |t|
      t.string :quotes, null: false, default: ''
    end
  end
end
