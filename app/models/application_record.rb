class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  include Hashid::Rails

  def self.inherited(subclass)
    super

    hashid_config pepper: subclass.table_name
  end
end
