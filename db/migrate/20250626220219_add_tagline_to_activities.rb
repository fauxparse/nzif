class AddTaglineToActivities < ActiveRecord::Migration[7.1]
  def change
    change_table :activities do |t|
      t.string :tagline, null: false, default: ''
    end
  end
end
