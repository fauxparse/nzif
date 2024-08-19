require 'MailchimpMarketing'

module Newsletter
  class Subscribe < ApplicationInteractor
    delegate :name, :email, to: :context

    def call
      skip_authorization!

      fname, lname = name.split(/\s+/, 2)

      mailchimp.lists.set_list_member(
        ENV.fetch('MAILCHIMP_LIST_ID', nil),
        Digest::MD5.hexdigest(email),
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: fname,
            LNAME: lname,
          },
        },
      )
    end

    private

    def mailchimp
      @mailchimp ||= MailchimpMarketing::Client.new.tap do |client|
        client.set_config(
          api_key: ENV.fetch('MAILCHIMP_API_KEY', nil),
          server: ENV.fetch('MAILCHIMP_SERVER', nil),
        )
      end
    end
  end
end
