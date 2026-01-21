import Greeter from '#domain/Greeter.js'

export const greetUser = (name: string): string => {
  const greeter = new Greeter('Hola')
  return greeter.greet(name)
}
