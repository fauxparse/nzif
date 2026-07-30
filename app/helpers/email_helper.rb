module EmailHelper
  def email_image_tag(image, **)
    attachments[image] = Rails.root.join("app/assets/images/#{image}").read
    image_tag(attachments[image].url, **)
  end
end
