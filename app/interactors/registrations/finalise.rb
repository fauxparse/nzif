module Registrations
  class Finalise
    include Interactor::Organizer

    organize MarkAsCompleted, CreateSnapshot, SendConfirmationEmail, UpdateCount
  end
end
