class PlaceNameTranslationPolicy < ApplicationPolicy
  def index?
    true
  end

  def manage?
    user.permission?(:content)
  end
end
