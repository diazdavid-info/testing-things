export default class Greeter {
  constructor(private readonly prefix: string) {}

  greet(name: string): string {
    return `${this.prefix} ${name}`
  }
}
