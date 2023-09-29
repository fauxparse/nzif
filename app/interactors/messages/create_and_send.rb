module Messages
  class CreateAndSend
    include Interactor::Organizer

    organize Create, Send
  end
end
