module Activities
  class Import
    include Interactor::Organizer

    organize FetchFromAirtable
  end
end
