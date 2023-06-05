require 'image_processing/mini_magick'

class ActivityPictureUploader < Shrine
  SIZES = {
    large: [1920, 1080],
    medium: [1280, 720],
    small: [480, 270],
    tiny: [48, 27],
  }.freeze

  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)

    SIZES.transform_values { |(width, height)| magick.resize_to_fill!(width, height) }
  end
end
