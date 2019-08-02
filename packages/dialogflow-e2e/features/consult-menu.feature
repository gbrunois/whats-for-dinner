@consult-menu @debugging
Feature: User ask for the menu
  The user ask for a menu

  Background: A planning:
    Given A planning
      | Date | Lunch            | Dinner    |
      | J    | Saucisses frites | Camembert |

  Scenario: Ask to consult what we eat today
    When User say "Je veux savoir ce que l'on mange ce soir"
    Then Bot say "Ce soir, tu as prévu Camembert"