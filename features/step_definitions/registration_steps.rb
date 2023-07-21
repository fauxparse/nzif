module RegistrationHelpers
  def user
    @user ||= FactoryBot.create(:user, email: 'lauren@ipsum.com')
  end

  def festival
    @festival ||= FactoryBot.create(:festival, :with_workshops)
  end

  def current_email_address
    user.email
  end
end

World(RegistrationHelpers)

ParameterType(
  name: 'ordinal',
  regexp: /first|second|third/,
  type: Integer,
  transformer: ->(s) { %w[zeroth first second third].index(s) },
)

Given('I am on the registration page') do
  visit "/#{festival.year}/register"
  sleep 1
end

Given('I am a new user') do
  expect(User.count).to be_zero
end

Given('I am an existing user') do
  user
end

When('I fill in my name') do
  fill_in 'Your name', with: 'Lauren Ipsum'
end

When('I fill in my email address') do
  fill_in 'Your email address', with: 'lauren@ipsum.com'
end

When('I fill in my password') do
  fill_in('password', with: 'P4$$w0rd')
end

When('I fill in my password incorrectly') do
  fill_in('password', with: 'wrong move')
end

When('I fill in my pronouns') do
  fill_in('pronouns', with: 'she/her')
end

When('I fill in my city') do
  fill_in('city', with: 'Wellington')
end

When('I click the {string} button') do |button_name|
  click_button button_name
end

When('I read the code of conduct') do
  expect(page).to have_field('codeOfConductAccepted', disabled: true)

  # TODO: mock this
  using_wait_time 10 do
    expect(page).to have_content('What is the Code of Conduct?')
  end

  page.execute_script <<~JS
    document.querySelector('.end-of-page').scrollIntoView()
  JS
  expect(page).to have_field('codeOfConductAccepted', disabled: false)

  check('codeOfConductAccepted')
end

When('I choose the {ordinal} workshop as my {ordinal} choice') do |a, b|
  within(".workshop:nth-child(#{a})") do
    click_button("#{%w[Zeroth First Second Third][b]} choice")
  end
end

Then('I should be logged in') do
  @user = User.last!
  expect(User.where(id: user.id)).to exist
  expect(page).not_to have_content('Log in')
end

Then('I should see {string}') do |string|
  expect(page).to have_content(string)
end

Then('I should have my preferences recorded') do
  registration = user
    .registrations
    .includes(preferences: :workshop)
    .last
  workshops = festival.workshops.all
  expect(registration.preferences.sort_by(&:position).map(&:workshop))
    .to eq([workshops.second, workshops.first])
end
