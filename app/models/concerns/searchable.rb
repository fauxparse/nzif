module Searchable
  extend ActiveSupport::Concern

  included do
    include PgSearch::Model
  end

  class_methods do
    def searchable_on(*columns)
      map = columns.zip(('A'..'Z').take(columns.size)).to_h
      pg_search_scope :search,
        against: map,
        ignoring: :accents,
        using: {
          tsearch: tsearch_options,
        }
    end

    # rubocop:disable Metrics/MethodLength
    def tsearch_options
      {
        any_word: true,
        prefix: true,
        dictionary: 'english',
        tsvector_column: 'searchable',
        highlight: {
          StartSel: '<b>',
          StopSel: '</b>',
          HighlightAll: true,
          MaxFragments: 3,
          FragmentDelimiter: '&hellip;',
        },
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end
