class AddSocialEvents < ActiveRecord::Migration[7.0]
  def change
    add_enum_value :activity_type, 'SocialEvent'
  end
end
