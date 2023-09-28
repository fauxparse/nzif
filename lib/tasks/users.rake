namespace :users do
  desc 'Reset all user passwords to P4$$w0rd'
  task reset_passwords: :environment do
    raise "Don't run this in production!" if Rails.env.production?

    password = 'P4$$w0rd'

    User.find_each do |user|
      user.update! password:, password_confirmation: password
    end
  end
end
