// 1025 species of pokemon available in the pokedex
import { TaskQueuePC } from "./taskqueue.mjs";
import fs from 'fs';
import path from 'path';
import axios from 'axios';
async function getPokemonData(url) {
    try {
        const pokemonSpriteData = await getPokemonSprite(url);
        const speciesData = await getPokemonSpecies(pokemonSpriteData.species.url);
        const finalData = {...pokemonSpriteData, ...speciesData};
        return finalData
    } catch (error) {
        console.error(error.message);
        return {};
    }
}

async function getPokemonSprite(nameUrl) {
    const res = await fetch(nameUrl);
    if (!res.ok) throw new Error(`Pokémon "${name}" not found`);
    const data = await res.json();
    return {
        id: data.id,
        name: data.name,
        sprite: data.sprites.other['official-artwork'].front_default,
        species: data.species
    }

}

async function getPokemonSpecies(speciesUrl) {

    const res = await fetch(speciesUrl);
    if (!res.ok) throw new Error(`Pokémon species not found`);
    const data = await res.json();
    return {
        capture_rate: data.capture_rate,
        is_baby: data.is_baby,
        is_legendary: data.is_legendary,
        is_mythical: data.is_mythical,
    }

}

async function getAllPokemon(limit=500) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${limit}`);
        if (!res.ok) throw new Error('Pokémon not found');
        const data = await res.json();
        return data.results.map(pokemon => pokemon.url);
    } catch (error) {
        console.error(error.message);
        return {};
    }
}
async function downloadImage(url, filepath) {
    try {
        const imageResponse = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(filepath, imageResponse.data);
        
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error.message);
    }
}


async function getAllPokemonData(limit = 500) {
    try{
        const urls = await getAllPokemon(limit);
        const taskQueue = new TaskQueuePC(15);
        const allPokemonData = []
        const tasks = urls.map(url => async () => {
            const pokemonData = await getPokemonData(url);
            var directoryPath = './data'
            // if (pokemonData.is_baby) {
            //     directoryPath += '/baby'
            // } else if(pokemonData.is_mythical) {
            //     directoryPath += '/mythical'
            // }else if(pokemonData.is_legendary) {
            //     directoryPath +='/legendary'
            // } else {
            //     directoryPath += '/normal'
            // }

            if (pokemonData) {
                fs.writeFileSync(`${directoryPath}/${pokemonData.id}.json`, JSON.stringify(pokemonData, null, 2));
                allPokemonData.push(pokemonData);
            }
            if (pokemonData.sprite) {
                    const imageName = `${pokemonData.id}.png`;
                    const imagePath = path.join(directoryPath, imageName);
                    await downloadImage(pokemonData.sprite, imagePath);
            }
        })
        const taskPromises = tasks.map(task => taskQueue.runTask(task));
        await Promise.all(taskPromises);

        return allPokemonData;
    }catch (error) {
        console.error(error.message);
        return [];
    }   
}



async function main() {

    const allPokemonData = await getAllPokemonData(500);

   
    const jsonData = JSON.stringify(allPokemonData, null, 2); 
    fs.writeFileSync('pokemon_data.json', jsonData);
    console.log('Pokémon data written to pokemon_data.json');


}
main()
// console.log(pokemonData.length);
// console.log(pokemonData.filter(pokemon => pokemon.is_legendary || pokemon.is_mythical));