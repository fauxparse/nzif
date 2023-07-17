namespace :dev do
  desc 'Generate placeholder images'
  task placeholders: :environment do
    Activity.where(picture_data: nil).find_each do |activity|
      URI.open("https://picsum.photos/seed/#{activity.to_param}/1280/720") do |f|
        activity.picture = f
        activity.save!
      end
    end
  end
end
