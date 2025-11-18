import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
const DuckList = () => {
    const [ducks, setDucks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
        axios({
            method: 'GET',
            url: 'https://random-d.uk/api/v2/list'
        }).then((response) => {
            console.log('response', response);
            // setDucks(response.data.images);
            setDucks([])
            
        }).catch((error) => {
            console.log('error', error);
        }).finally(() => {
            setIsLoading(false);
        })
        }, 5000);
    },[])

    return(
        <ThemedView>
            <ThemedText>DuckList</ThemedText>
            {/* {ducks.map((duck) => (
                <ThemedView style={{
                    // backgroundColor: 'red',
                }} key={duck}>
                <Image
                style={{
                    width: '100%',
                    height: 300
                }}
                resizeMode="contain"
                source={{ uri: `https://random-d.uk/api/v2/${duck}` }} />
                <ThemedText key={duck}>{duck}</ThemedText>
                </ThemedView>
            ))} */}
            <FlatList 
             data={ducks}
             ListEmptyComponent={
                isLoading ? (
                  <ActivityIndicator size="large" color="turquoise" />
                ) : (
                  <ThemedText>Aucun canard trouvé 🦆</ThemedText>
                )
              }

             renderItem={({item}) => (
                <ThemedView style={{
                    backgroundColor: 'red',
                }} key={item}>
                <Image
                style={{
                    width: '100%',
                    height: 300
                }}
                resizeMode="contain"
                source={{ uri: `https://random-d.uk/api/v2/${item}` }} />
                <ThemedText>{item}</ThemedText>
                </ThemedView>
             )}

             keyExtractor={(item) => item}
            />
        </ThemedView>
    )
}

export default DuckList;