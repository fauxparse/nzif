class AddImagesToActivities < ActiveRecord::Migration[7.0]
  def change
    change_table :activities do |t|
      t.jsonb :picture_data
      t.string :blurhash
    end
  end
end
