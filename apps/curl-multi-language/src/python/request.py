from typing import TypedDict, List, Optional

import requests

url = "https://pokeapi.co/api/v2/pokemon?limit=2&offset=0"


class Pokemon(TypedDict):
    name: str
    url: str


class PokemonList(TypedDict):
    count: int
    next: Optional[str]
    previous: Optional[str]
    results: List[Pokemon]


response = requests.get(
    url,
    headers={"Accept": "application/json"}
)

if not response.ok:
    raise RuntimeError(f"HTTP error! status: {response.status_code}")

data: PokemonList = response.json()

for pokemon in data["results"]:
    print(f"- {pokemon['name']}: {pokemon['url']}")
