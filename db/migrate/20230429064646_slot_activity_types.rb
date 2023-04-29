class SlotActivityTypes < ActiveRecord::Migration[7.0]
  def up
    create_enum :activity_type, %w[Workshop Show]

    change_column :slots, :activity_type, :enum,
      enum_type: :activity_type, using: 'activity_type::text::activity_type'
  end

  def down
    change_column :slots, :activity_type, :text

    drop_enum 'activity_type'
  end
end
