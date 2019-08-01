@consult-menu
Feature: User ask for the menu
  The user ask for a menu

  Background: A planning:
    Given A planning
      | Date | Lunch | Dinner |
      | J    | YY    | ZZ     |

  Scenario: Ask to consult what he eat today
    When User say "Je veux savoir ce que l'on mange ce soir"