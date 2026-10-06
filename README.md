# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version

- System dependencies

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- Goblins

- ...

## Workshop messages

The admin workshop editor has a Messages tab at
`/admin/workshops/$slug/messages`. It lists messages from every session of the
workshop, newest first, with the session date, sender, subject, and message body.

Re-send queues the original message for all current participants of that
message's session, including previous recipients. It does not create a new
message or change the sender. Session messaging permissions still apply.

Automatic delivery to newly added participants continues to skip previous
recipients.
