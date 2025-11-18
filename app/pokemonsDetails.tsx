import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import usePokemon from "@/hooks/usePokemon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Couleurs pour les types de Pokémon
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

// Fonction utilitaire pour capitaliser la première lettre
const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const PokemonsDetails = () => {
    const router = useRouter();
    const {url} = useLocalSearchParams();
    console.log("🚀 ~ PokemonsDetails ~ url:", url)
    const {pokemon, loading, error} = usePokemon(url);
    console.log("🚀 ~ PokemonsDetails ~ pokemon:", pokemon)

    if(loading){
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ThemedText>Chargement...</ThemedText>
            </SafeAreaView>
        );
    }

    if(error){
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ThemedText>Erreur: {error}</ThemedText>
                <Button onPress={() => router.back()} title="Retour" />
            </SafeAreaView>
        );
    }

    if(!pokemon){
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ThemedText>Aucun Pokémon trouvé</ThemedText>
                <Button onPress={() => router.back()} title="Retour" />
            </SafeAreaView>
        );
    }

    return(
        <SafeAreaView>
            <Button onPress={() => router.back()} title="Retour" />
            <ThemedView>
                <ThemedView style={styles.pokemonContainer}>
                    <View style={styles.headerContainer}>
                        <ThemedText style={styles.pokemonName}>
                            {capitalizeFirstLetter(pokemon.name)}
                        </ThemedText>
                        {pokemon.id && (
                            <ThemedText style={styles.pokemonId}>
                                #{String(pokemon.id).padStart(3, '0')}
                            </ThemedText>
                        )}
                    </View>

                    {pokemon.sprites?.other?.['official-artwork']?.front_default && (
                        <Image
                            source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
                            style={styles.pokemonImage}
                        />
                    )}

                    {pokemon.types && (
                        <View style={styles.typesContainer}>
                            {pokemon.types.map((typeInfo: any) => (
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
                    )}

                    <View style={styles.infoContainer}>
                        {pokemon.height && (
                            <View style={styles.infoRow}>
                                <ThemedText style={styles.infoLabel}>Taille:</ThemedText>
                                <ThemedText style={styles.infoValue}>{pokemon.height / 10} m</ThemedText>
                            </View>
                        )}
                        {pokemon.weight && (
                            <View style={styles.infoRow}>
                                <ThemedText style={styles.infoLabel}>Poids:</ThemedText>
                                <ThemedText style={styles.infoValue}>{pokemon.weight / 10} kg</ThemedText>
                            </View>
                        )}
                        {pokemon.base_experience && (
                            <View style={styles.infoRow}>
                                <ThemedText style={styles.infoLabel}>Exp. de base:</ThemedText>
                                <ThemedText style={styles.infoValue}>{pokemon.base_experience}</ThemedText>
                            </View>
                        )}
                    </View>

                    {pokemon.abilities && (
                        <View style={styles.abilitiesContainer}>
                            <ThemedText style={styles.sectionTitle}>Capacités:</ThemedText>
                            <View style={styles.abilitiesList}>
                                {pokemon.abilities.map((abilityInfo: any) => (
                                    <ThemedText key={abilityInfo.slot} style={styles.abilityText}>
                                        • {capitalizeFirstLetter(abilityInfo.ability.name.replace('-', ' '))}
                                        {abilityInfo.is_hidden && ' (Cachée)'}
                                    </ThemedText>
                                ))}
                            </View>
                        </View>
                    )}
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
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
export default PokemonsDetails;