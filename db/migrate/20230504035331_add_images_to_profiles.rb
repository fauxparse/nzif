class AddImagesToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :picture_data, :jsonb
  end
end
