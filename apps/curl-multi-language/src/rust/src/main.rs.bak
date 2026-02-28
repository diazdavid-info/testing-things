use reqwest::StatusCode;
use serde::Deserialize;

const URL: &str = "https://pokeapi.co/api/v2/pokemon?limit=2&offset=0";

#[derive(Debug, Deserialize)]
struct Pokemon {
    name: String,
    url: String,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
struct PokemonList {
    count: u32,
    next: Option<String>,
    previous: Option<String>,
    results: Vec<Pokemon>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let response = client
        .get(URL)
        .header("Accept", "application/json")
        .send()
        .await?;

    if response.status() != StatusCode::OK {
        return Err(format!("HTTP error! status: {}", response.status()).into());
    }

    let data: PokemonList = response.json().await?;

    for pokemon in data.results {
        println!("- {}: {}", pokemon.name, pokemon.url);
    }

    Ok(())
}
