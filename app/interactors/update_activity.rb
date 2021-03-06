class UpdateActivity < Interaction
  def call
    access_denied! unless can? :update, activity

    activity.update!(attributes_for_update)
    update_presenters if attributes.include?(:presenters)
    activity.image.purge if deleting_image?
  end

  delegate :activity, :attributes, to: :context

  private

  def update_presenters
    return unless old_presenter_ids != new_presenter_ids

    Presenter.acts_as_list_no_update do
      new_presenter_ids.each.with_index(1) do |id, position|
        presenter_for_user_id(id).position = position
      end
      (old_presenter_ids - new_presenter_ids).each do |id|
        presenter_for_user_id(id).mark_for_destruction
      end
      activity.save!
    end
  end

  def old_presenter_ids
    @old_presenter_ids ||= activity.presenters.map(&:user_id)
  end

  def new_presenter_ids
    @new_presenter_ids ||= attributes[:presenters].map do |presenter|
      case presenter
      when Hash then presenter[:id].to_i
      else presenter.to_param.to_i
      end
    end
  end

  def presenter_for_user_id(id)
    activity.presenters.detect { |p| p.user_id == id } ||
      activity.presenters.build(user_id: id)
  end

  def attributes_for_update
    if deleting_image?
      attributes.except(:image)
    else
      attributes
    end.except(:presenters)
  end

  def deleting_image?
    attributes.include?(:image) && attributes[:image].blank?
  end
end
