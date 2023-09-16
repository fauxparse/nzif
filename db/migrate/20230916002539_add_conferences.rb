class AddConferences < ActiveRecord::Migration[7.0]
  def change
    add_enum_value :activity_type, 'Conference'
  end
end
