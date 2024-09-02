class AddPermissionsArrayToUsers < ActiveRecord::Migration[7.1]
  def up
    add_column :users, :permissions_array, :jsonb, default: []

    User.where.not(permissions: nil).find_each do |user|
      user.update!(permissions_array: user.permissions.map(&:to_sym))
    end
  end

  def down
    remove_column :users, :permissions_array
  end
end
