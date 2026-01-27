const url = 'https://pokeapi.co/api/v2/pokemon?limit=2&offset=0'

type PokemonList = { count: number; next: string | null; previous: string | null; results: Pokemon[] }
type Pokemon = {
  name: string
  url: string
}

const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })

if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

const data: PokemonList = await response.json()

data.results.forEach(({ name, url }) => console.log(`- ${name}: ${url}`))
