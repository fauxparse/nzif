Feature: Registration
  Scenario: Register a new user
    Given I am a new user
    And earlybird registration is open
    And I am on the registration page
    When I fill in my name
    And I fill in my email address
    And I fill in my password
    And I click the "Continue" button
    Then I should be logged in
    And I should see "pronouns"

  Scenario: Register an existing user
    Given I am an existing user
    And earlybird registration is open
    And I am on the registration page
    And I fill in my name
    And I fill in my email address
    And I fill in my password
    And I click the "Continue" button
    Then I should be logged in

    When I fill in my pronouns
    And I fill in my city
    And I read the code of conduct
    And I click the "next" button
    Then I should see "How workshop selection works"

    When I choose the second workshop as my first choice
    And I choose the first workshop as my second choice
    Then I should see "1 workshop selected"

    When I click the "next" button
    Then I should see "1 workshop @ $70"
    And I should see "Total amount due $70"
    And I should have my preferences recorded

    When I click the "Finalise registration" button
    Then I should see "You’re coming to NZIF!"

  Scenario: Register with a bad password
    Given I am an existing user
    And earlybird registration is open
    And I am on the registration page
    And I fill in my name
    And I fill in my email address
    And I fill in my password incorrectly
    And I click the "Continue" button
    Then I should see "Sorry"

  Scenario: Register when logged in
    Given I am an existing user
    And I am logged in
    And I am on the registration page
    When I fill in my pronouns
    And I fill in my city
    And I read the code of conduct
    And I click the "next" button
    Then I should see "How workshop selection works"

  Scenario: Register as a teacher
    Given earlybird registration is open
    And I am registered for the festival
    And I am logged in
    And I am teaching a workshop
    And I am on the workshop selection page
    Then I should see "How workshop selection works"
    And workshops in my slot should be disabled

  Scenario: Earlybird registrations are closed
    Given earlybird registration is closed
    And I am on the registration page
    Then I should see "Registrations paused"
