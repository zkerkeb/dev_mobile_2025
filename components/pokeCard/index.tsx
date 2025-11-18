import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type Pokemon = {
    name: string;
    url?: string;
};

type PokemonDetails = {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: Array<{
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }>;
    abilities: Array<{
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
        slot: number;
    }>;
    stats: Array<{
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }>;
};

type PokeCardProps = {
    pokemon: Pokemon;
    isVisible?: boolean;
};

const TYPE_COLORS: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

const PokeCard = ({ pokemon, isVisible = false }: PokeCardProps) => {
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isVisible && !pokemonDetails) {
            setLoading(true);
            axios({
                method: 'GET',
                url: pokemon.url,
            }).then((response) => {
                setPokemonDetails(response.data);
                setLoading(false);
            }).catch((error) => {
                console.log('error', error);
                setLoading(false);
            });
        }
    }, [isVisible, pokemon?.name]);

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return(
        <TouchableOpacity onPress={() => router.push(`/pokemonsDetails?url=${pokemon.url}`)}
            >
        <ThemedView style={styles.pokemonContainer}>
            {loading ? (
                <ThemedText>Chargement...</ThemedText>
            ) : pokemonDetails ? (
                <>
                    <View style={styles.headerContainer}>
                        <ThemedText style={styles.pokemonName}>
                            {capitalizeFirstLetter(pokemonDetails.name)}
                        </ThemedText>
                        <ThemedText style={styles.pokemonId}>
                            #{pokemonDetails.id.toString().padStart(3, '0')}
                        </ThemedText>
                    </View>

                    {pokemonDetails.sprites?.other?.['official-artwork']?.front_default && (
                        <Image
                            source={{ uri: pokemonDetails.sprites.other['official-artwork'].front_default }}
                            style={styles.pokemonImage}
                        />
                    )}

                    <View style={styles.typesContainer}>
                        {pokemonDetails.types.map((typeInfo) => (
                            <View
                                key={typeInfo.slot}
                                style={[
                                    styles.typeTag,
                                    { backgroundColor: TYPE_COLORS[typeInfo.type.name] || '#777' }
                                ]}
                            >
                                <ThemedText style={styles.typeText}>
                                    {capitalizeFirstLetter(typeInfo.type.name)}
                                </ThemedText>
                            </View>
                        ))}
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Taille:</ThemedText>
                            <ThemedText style={styles.infoValue}>{pokemonDetails.height / 10} m</ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Poids:</ThemedText>
                            <ThemedText style={styles.infoValue}>{pokemonDetails.weight / 10} kg</ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Exp. de base:</ThemedText>
                            <ThemedText style={styles.infoValue}>{pokemonDetails.base_experience}</ThemedText>
                        </View>
                    </View>

                    <View style={styles.abilitiesContainer}>
                        <ThemedText style={styles.sectionTitle}>Capacités:</ThemedText>
                        <View style={styles.abilitiesList}>
                            {pokemonDetails.abilities.map((abilityInfo) => (
                                <ThemedText key={abilityInfo.slot} style={styles.abilityText}>
                                    • {capitalizeFirstLetter(abilityInfo.ability.name.replace('-', ' '))}
                                    {abilityInfo.is_hidden && ' (Cachée)'}
                                </ThemedText>
                            ))}
                        </View>
                    </View>

                </>
            ) : (
                <ThemedText>{capitalizeFirstLetter(pokemon.name)}</ThemedText>
            )}
        </ThemedView>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    pokemonContainer: {
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 24,
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    pokemonName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    pokemonId: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    pokemonImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 8,
    },
    typesContainer: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    typeTag: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    typeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoContainer: {
        width: '100%',
        marginVertical: 12,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    infoValue: {
        fontSize: 16,
        color: '#34495E',
        fontWeight: '500',
    },
    abilitiesContainer: {
        width: '100%',
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2C3E50',
    },
    abilitiesList: {
        gap: 4,
    },
    abilityText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#34495E',
    },
})

export default PokeCard;