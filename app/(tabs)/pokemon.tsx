import PokeCard from "@/components/pokeCard";
import { ThemedView } from "@/components/themed-view";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Pokemon = () => {
    const router = useRouter();
    const [pokemons, setPokemons] = useState<Array<{ name: string; url: string }>>([]);
    const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        setVisibleMap((prev) => {
            const next = { ...prev };
            viewableItems.forEach(({ item, isViewable }: ViewToken) => {
                const key = (item as { name?: string })?.name ?? String(item);
                next[key] = !!isViewable;
            });
            return next;
        });
    }).current;

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'https://pokeapi.co/api/v2/pokemon',
        }).then((response) => {
            console.log(response.data);
            setPokemons(response.data.results);
        }).catch((error) => {
            console.log(error);
        });
    },[])
    
    return(
        <SafeAreaView>
        <ThemedView>
           <FlatList<{ name: string; url: string }>
            data={pokemons}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            renderItem={({item}) => (
                <PokeCard pokemon={item} isVisible={!!visibleMap[item.name]} />
            )}
            keyExtractor={(item) => item.name}
           />
        </ThemedView>

        </SafeAreaView>
    )
}


export default Pokemon;