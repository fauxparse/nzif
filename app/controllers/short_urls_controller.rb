class ShortUrlsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def redirect
    short_url = ShortUrl.find(params[:id])

    raise ActiveRecord::RecordNotFound unless short_url.redirect?

    redirect_to short_url.url, status: :moved_permanently, allow_other_host: true
  end

  private

  def record_not_found
    head :not_found
  end
end
