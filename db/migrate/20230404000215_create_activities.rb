class CreateActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :activities do |t|
      t.belongs_to :festival
      t.string :type
      t.string :name
      t.string :slug
      t.timestamps

      t.index %i[festival_id type slug], unique: true
    end
  end
end
