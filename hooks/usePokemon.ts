import axios from "axios";
import { useEffect, useState } from "react";

interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: {
        other?: {
            'official-artwork'?: {
                front_default?: string;
            };
        };
    };
    types: Array<{
        slot: number;
        type: {
            name: string;
        };
    }>;
    abilities: Array<{
        slot: number;
        ability: {
            name: string;
        };
        is_hidden: boolean;
    }>;
}

const usePokemon = (url: string | string[] | undefined) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Gérer le cas où url est un tableau ou undefined
        const urlString = Array.isArray(url) ? url[0] : url;
        // Ne pas faire de requête si l'URL est invalide
        if (!urlString || typeof urlString !== 'string') {
            setError("URL invalide");
            setLoading(false);
            return;
        }

        // setLoading(true);
        // setError(null);
        // setPokemon(null);
 
        axios({
            method: 'GET',
            url: urlString,
        }).then((response) => {
            console.log("🚀 ~ usePokemon ~ response:", response)
            setPokemon(response.data);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoading(false);
        });
    }, [url]);

    return { pokemon, loading, error };
}

export default usePokemon;