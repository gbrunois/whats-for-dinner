@schedule-menu
Feature: User schedule a menu
    The user schedule a menu

    Background: A planning:
        Given A planning
    Scenario: Plan a menu and say no
        When User say "Je veux planifer les plats de demain"
        Then Bot say "Les menus du <J+1:dddd DD MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Non"
        And Bot say "A bientôt"

# Scenario: Plan a menu and say no
#     When User say "Je veux planifer les plats de demain"
#     Then Bot say "Les menus du <J+1:dddd DD MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
#     And User say "Je veux planifer les plats de lundi prochain"
#     And Bot say "A bientôt"