require 'sorted_set'

module Matchmaker
  class SortedList < Set
    attr_reader :session

    def initialize(session, *)
      super(*)
      @session = session
    end

    def pop
      largest = to_a.select { |r| r.candidate(session) }.max
      delete largest
      largest
    end

    delegate :map, to: :sort
  end
end
