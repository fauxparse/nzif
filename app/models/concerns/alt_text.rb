module AltText
  extend ActiveSupport::Concern

  module ClassMethods
    def alt_text_for(field)
      define_method :"#{field}_alt_text" do
        send(field).metadata['alt_text']
      end

      define_method :"#{field}_alt_text=" do |value|
        send(field).add_metadata('alt_text' => value)
        send(:"#{field}_attacher").write
      end
    end
  end
end
