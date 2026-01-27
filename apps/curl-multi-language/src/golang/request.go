package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

const url = "https://pokeapi.co/api/v2/pokemon?limit=2&offset=0"

type Pokemon struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type PokemonList struct {
	Count    int       `json:"count"`
	Next     *string   `json:"next"`
	Previous *string   `json:"previous"`
	Results  []Pokemon `json:"results"`
}

func main() {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		panic(err)
	}

	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		panic(fmt.Sprintf("HTTP error! status: %d", resp.StatusCode))
	}

	var data PokemonList
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		panic(err)
	}

	for _, pokemon := range data.Results {
		fmt.Printf("- %s: %s\n", pokemon.Name, pokemon.URL)
	}
}
