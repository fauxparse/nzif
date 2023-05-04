require 'image_processing/mini_magick'

class ProfilePictureUploader < Shrine
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)

    {
      large: magick.resize_to_fill!(512, 512),
      medium: magick.resize_to_fill!(128, 128),
      small: magick.resize_to_fill!(64, 64),
    }
  end
end
