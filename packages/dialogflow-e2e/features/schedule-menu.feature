@schedule-menu
Feature: User schedule a menu
  The user schedule a menu

  Background: A planning:
    Given A planning
      | Date | Lunch     | Dinner |
      | J    |           |        |
      | J+1  | saucisses | Soupe  |

  Scenario: Ask to plan a menu and say no
    When User say "Je veux planifer les plats de demain"
    Then Bot say "Les menus du <J+1:dddd D MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
    And User say "Non"
    And Bot say "A bientôt"

  Scenario: Plan a menu
    When User say "Je veux planifer les plats de demain"
    Then Bot say "Les menus du <J+1:dddd D MMMM> ont déjà été planifiés. Veux-tu planifier un autre jour ou consulter le menu ?"
    And User say "Je veux planifer les plats de <J+3:dddd>"
    And Bot say "C'est parti. Planifions les repas de <J+3:dddd D MMMM>. Que veux-tu manger le midi ?"
    And User say "Des pâtes carbonara"
    And Bot say "OK, j'ai ajouté pâtes carbonara pour <J+3:dddd> midi. Que veux-tu manger le soir ?"
    And User say "de la soupe aux oignons avec pain et fromage"
    And Bot say "OK, j'ai ajouté soupe aux oignons avec pain et fromage pour <J+3:dddd> soir. Veux-tu planifier un autre jour ou consulter le menu ?"
    And User say "Non"
    And Bot say "A bientôt"
    And The planning is
      | Date | Lunch           | Dinner                                 |
      | J    |                 |                                        |
      | J+1  | saucisses       | Soupe                                  |
      | J+3  | pâtes carbonara | soupe aux oignons avec pain et fromage |

  Scenario: Plan a menu
    When User say "Je veux planifer les plats du 22 juillet 2019"
    Then Bot say "C'est parti. Planifions les repas de <2019-07-22:dddd D MMMM>. Que veux-tu manger le midi ?"
    And User say "Je ne sais pas"
    And Bot answer one of this phrases
      | Ok, on verra ça plus tard.                  |
      | On peut se laisser du temps pour réfléchir. |
      | ça marche, passons à autre chose.           |
    And The planning is
      | Date | Lunch     | Dinner |
      | J    |           |        |
      | J+1  | saucisses | Soupe  |

  Scenario: Should extract the good part in the meal description
    When User say "Je veux planifier les repas de <J+4:dddd>"
    And Bot say "C'est parti. Planifions les repas de <J+4:dddd D MMMM>. Que veux-tu manger le midi ?"
    And User say "Je veux manger des pâtes"
    And Bot say "OK, j'ai ajouté pâtes pour <J+4:dddd> midi. Que veux-tu manger le soir ?"
    And User say "lasagnes saumon brocolis mascarpone"
    And Bot say "OK, j'ai ajouté lasagnes saumon brocolis mascarpone pour <J+4:dddd> soir. Veux-tu planifier un autre jour ou consulter le menu ?"
    And The planning is
      | Date | Lunch     | Dinner                              |
      | J    |           |                                     |
      | J+1  | saucisses | Soupe                               |
      | J+4  | pâtes     | lasagnes saumon brocolis mascarpone |

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
    And Bot say "C'est parti. Planifions les repas de <J+4:dddd D MMMM>. Que veux-tu manger le midi ?"

  Scenario: Plan a menu
    When User say "Je veux manger du riz demain midi"
    And Bot say "Tu as déjà planifié saucisses pour demain midi. Veux-tu remplacer ce plat par riz ?"
    And User say "Je veux remplacer"

  Scenario: Replace an exiting meal
    When User say "Je veux manger du gratin de Crozet de Savoie demain midi"
    And Bot say "Tu as déjà planifié saucisses pour demain midi. Veux-tu remplacer ce plat par gratin de Crozet de Savoie ?"
    And User say "oui"
    And Bot say "OK, j'ai ajouté gratin de Crozet de Savoie pour demain midi."
    And The planning is
      | Date | Lunch                      | Dinner |
      | J    |                            |        |
      | J+1  | gratin de Crozet de Savoie | Soupe  |

  Scenario: Replace an existing meal - fallback - close conversation
    When User say "Je veux manger le reste de gratin de Crozet de Savoie demain midi"
    And Bot say "Tu as déjà planifié saucisses pour demain midi. Veux-tu remplacer ce plat par reste de gratin de Crozet de Savoie ?"
    And User say "Prout"
    And Bot say "Je n'ai pas compris, vous voulez remplacer le plat ?"
    And User say "Je ne sais pas"
    And Bot say "Je n'ai pas compris, vous voulez remplacer le plat ?"
    And User say "Peut-être"
    And Bot say "Je ne comprends pas votre réponse."

  Scenario: Replace an existing meal - fallback - continue
    When User say "Je veux manger le reste de gratin de Crozet de Savoie demain midi"
    And Bot say "Tu as déjà planifié saucisses pour demain midi. Veux-tu remplacer ce plat par reste de gratin de Crozet de Savoie ?"
    And User say "Prout"
    And Bot say "Je n'ai pas compris, vous voulez remplacer le plat ?"
    And User say "Je ne sais pas"
    And Bot say "Je n'ai pas compris, vous voulez remplacer le plat ?"
    And User say "Oui"
    And Bot say "OK, j'ai ajouté reste de gratin de Crozet de Savoie pour demain midi."

  Scenario: Plan a menu
    When User say "Je veux manger du riz demain midi"
    And Bot say "Tu as déjà planifié saucisses pour demain midi. Veux-tu remplacer ce plat par riz ?"
    And User say "Non"
    And Bot say "Ok. Veux-tu planifier autre chose ou consulter le menu ?"

  Scenario: Plan a menu
    When User say "Je veux manger des hot-dogs"
    And Bot answer one of this phrases
      | Pour quel jour ?              |
      | Pour quand ?                  |
      | Peux-tu me préciser le jour ? |
    And User say "Lundi"
    And Bot say "Le midi ou le soir ?"
    And User say "Le midi"
    And Bot say "OK, j'ai ajouté hot-dogs pour lundi midi."

  Scenario: Replace a menu
    When User say "Je veux changer le plat de demain midi"
    And Bot say "Ok, quel plat veux-tu manger ?"
    And User say "Je veux manger une choucroute de la mer"
    And Bot say "OK, j'ai ajouté choucroute de la mer pour demain midi."
    And Bot say "Veux-tu planifier autre chose ou consulter le menu ?"
    And User say "Non"
    And The planning is
      | Date | Lunch                | Dinner |
      | J    |                      |        |
      | J+1  | choucroute de la mer | Soupe  |