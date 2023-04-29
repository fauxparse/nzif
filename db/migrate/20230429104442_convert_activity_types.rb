class ConvertActivityTypes < ActiveRecord::Migration[7.0]
  def up
    change_column :activities, :type, :enum,
      enum_type: :activity_type, using: 'type::text::activity_type', null: false
  end

  def down
    change_column :activities, :type, :text, null: true
  end
end
