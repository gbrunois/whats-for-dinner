@consult-menu
Feature: User ask for the menu
  The user ask for a menu

  Background: A planning:
    Given A planning
      | Date | Lunch            | Dinner    |
      | J    | Saucisses frites | Camembert |
      | J+1  | Pâtes au thon    | Fajitas   |

  Scenario: Ask to consult what we eat tonight
    When User say "Je veux savoir ce que l'on mange ce soir"
    Then Bot say "Ce soir, tu as prévu Camembert."

  Scenario: Ask to consult what we eat for lunch
    When User say "Qu'est-ce qu'on mange demain midi"
    Then Bot say "Demain midi, tu as prévu Pâtes au thon."

  Scenario: Ask to consult what we eat today
    When User say "Qu'est-ce qu'on mange aujourd'hui"
    Then Bot say "Tu as prévu Saucisses frites pour ce midi et Camembert pour ce soir."

  Scenario: Ask to consult what we eat for lunch and follow-up
    When User say "Qu'est-ce qu'on mange demain midi"
    Then Bot say "Demain midi, tu as prévu Pâtes au thon."
    Then User say "Et pour ce soir ?"
    Then Bot say "Ce soir, tu as prévu Camembert."

  Scenario: Ask to consult menu
    When User say "Je veux consulter le menu"
    Then Bot say "Tu as prévu Saucisses frites pour ce midi et Camembert pour ce soir."