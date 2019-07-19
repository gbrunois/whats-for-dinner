@schedule-menu
Feature: User schedule a menu
    The user schedule a menu

    Background: A planning:
        Given A planning

    Scenario: Ask to plan a menu and say no
        When User say "Je veux planifer les plats de demain"
        Then Bot say "Les menus du <J+1:dddd DD MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Non"
        And Bot say "A bientôt"


    Scenario: Plan a menu
        When User say "Je veux planifer les plats de demain"
        Then Bot say "Les menus du <J+1:dddd DD MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Je veux planifer les plats de <J+3:dddd>"
        And Bot say "C'est parti. Planifions les repas de <J+3:dddd DD MMMM>. Que veux-tu manger le midi ?"
        And User say "Des pâtes carbonara"
        And Bot say "OK, j'ai ajouté pâtes carbonara pour <J+3:dddd> midi. Que veux-tu manger le soir ?"
        And User say "de la soupe aux oignons avec pain et fromage"
        And Bot say "OK, j'ai ajouté soupe aux oignons avec pain et fromage pour <J+3:dddd> soir. Veux-tu planifier un autre jour ou consulter le menu ?"
        And User say "Non"
        And Bot say "A bientôt"

    Scenario: Plan a menu
        When User say "Je veux planifer les plats du 22 juillet"
        Then Bot say "C'est parti. Planifions les repas de <2019-07-22:dddd DD MMMM>. Que veux-tu manger le midi ?"
        And User say "Je ne sais pas"
        And Bot answer one of this phrases
            | Ok, on verra ça plus tard.                  |
            | On peut se laisser du temps pour réfléchir. |
            | ça marche, passons à autre chose            |

    Scenario: Fallback waiting day
        When User say "Je veux planifier les repas"
        And Bot say "Très bien. Quel jour veux-tu planifier ?"
        And User say "Prout"
        And Bot say "Désolé, je n'ai pas compris"
        And User say "Camembert"
        And Bot say "Désolé, je n'ai pas compris. Quel jour veux-tu planifier ?"
        And User say "Prout"
        And Bot say "Je ne comprends pas votre réponse."

    Scenario: Fallback waiting day
        When User say "Je veux planifier les repas"
        And Bot say "Très bien. Quel jour veux-tu planifier ?"
        And User say "Prout"
        And Bot say "Désolé, je n'ai pas compris"
        And User say "<J+4:dddd>"
        And Bot say "C'est parti. Planifions les repas de <J+4:dddd DD MMMM>. Que veux-tu manger le midi ?"

    @skip
    Scenario: Plan a menu
        When User say "Je veux manger du riz demain midi"
        And Bot say "Vous avez déjà planifié saucisses pour lundi midi. Voulez vous ajouter du riz ou remplacer saucisse par riz ?"
        And User say "Je veux remplacer"

    @skip
    Scenario: Plan a menu
        When User say "Je veux manger du riz demain midi"
        And Bot say "Vous avez déjà planifié saucisses pour lundi midi. Voulez vous ajouter du riz ou remplacer saucisse par riz ?"
        And User say "Je veux ajouter"

    @skip
    Scenario: Plan a menu
        When User say "Je veux manger du riz demain midi"
        And Bot say "Vous avez déjà planifié saucisses pour lundi midi. Voulez vous ajouter du riz ou remplacer saucisse par riz ?"
        And User say "Prout"
        And Bot say "Je n'ai pas compris, vous voulez ajouter ou remplacer ?"
