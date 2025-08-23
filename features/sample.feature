Feature: Sample feature

  Scenario: Open the homepage
    Given I open the homepage
    Then I should see the welcome message

  Scenario: Navigate to the About page
    Given I open the homepage
    When I click on the "About" link
    Then I should be on the About page
    And I should see the About page content

  Scenario: Submit the contact form with valid data
    Given I open the homepage
    When I navigate to the "Contact" page
    And I fill in the contact form with valid information
    And I submit the form
    Then I should see a success message

  Scenario: Submit the contact form with invalid data
    Given I open the homepage
    When I navigate to the "Contact" page
    And I fill in the contact form with invalid information
    And I submit the form
    Then I should see an error message

  Scenario Outline: Search for a product
    Given I open the homepage
    When I enter "<product>" in the search box
    And I click the search button
    Then I should see search results for "<product>"

    Examples:
      | product   |
      | Laptop    |
      | Phone     |
      | Headphone |
