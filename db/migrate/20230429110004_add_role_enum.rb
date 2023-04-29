class AddRoleEnum < ActiveRecord::Migration[7.0]
  def up
    create_enum :role_name, %w[admin participant_liaison]

    change_column :roles, :name, :enum,
      enum_type: :role_name, using: 'name::text::role_name'
  end

  def down
    change_column :roles, :name, :text

    drop_enum 'role_name'
  end
end
