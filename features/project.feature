Feature: Project

  Scenario: Project with one layout

    Given project with following file structure:
      | filename              |
      | _layouts/default.html |
    When I parse the project
    Then the parsed project should have 1 layout
