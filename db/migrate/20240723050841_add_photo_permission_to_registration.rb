class AddPhotoPermissionToRegistration < ActiveRecord::Migration[7.0]
  def change
    add_column :registrations, :photo_permission, :boolean, null: false, default: false
  end
end
