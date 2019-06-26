export const responses = {
  signInError: 'Vous devez vous authentifier pour continuer.',
  greetUser: (username: string) =>
    `Bienvenue sur What's for dinner ${username}, je peux te donner le menu ou nous pouvons planifier quelque chose`,
  sayTodayMeal: (mealPeriod: string, meal: string) => `Ce ${mealPeriod}, tu as prévu ${meal}`,
  sayTodayMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour ce midi et ${meals[1]} pour ce soir`,
  sayTomorrowMeal: (mealPeriod: string, meal: string) => `Demain ${mealPeriod}, tu as prévu ${meal}`,
  sayTomorrowMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour demain midi et ${meals[1]} pour demain soir`,
  sayMeals: (dayOfWeek: string, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} midi et ${meals[1]} pour ${dayOfWeek} soir`,
  sayMeal: (dayOfWeek: string, mealPeriod: string, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} ${mealPeriod}`,
  sayOKMealCreated: (dayOfWeek: string, mealPeriod: string, mealDescription: string) =>
    `OK, j'ai ajouté ${mealDescription} pour ${dayOfWeek} ${mealPeriod}`,
  sorryNothingPlanned: `Désolé, rien n'a été planifié`,
  unhandledError: "Une erreur s'est produite",
  sayGoodBye: 'Ok, on réeesayera plus tard',
}
const PLAN_A_MEAL = 'Planifier un repas'
const CONSULT_MY_MENU = 'Consulter mon menu'

export const suggestions = [PLAN_A_MEAL, CONSULT_MY_MENU]
