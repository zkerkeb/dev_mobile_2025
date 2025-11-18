import { Button } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

const fakeArray = [2,4,5,6,7,8,9,10 ]

const Counter = ({beginValue = 0}) => {
  const [count, setCount] = useState(beginValue);
  const [myArray, setMyArray] = useState(fakeArray);
  console.log("🚀 ~ Counter ~ myArray:", myArray)

  useEffect(() => {
    // alert(count)
  }, [count])


  return(
    
    <View style={styles.container}>
    <ThemedText type="title">Counter</ThemedText>
    <ThemedText type="title">{count}</ThemedText>
    <Button onPress={() => setCount(count + 1)}>Increment</Button>
    <Button onPress={() => setCount(count - 1)}>Decrement</Button>
    <Button onPress={() => setCount(0)}>Reset</Button>
    {myArray.map((coco, index) => (
        <>
        <ThemedText type="title"> index:{index}</ThemedText>
        <ThemedText type="title">{coco}</ThemedText>
        <Button onPress={() => setMyArray(myArray.map((item, i) => i === index ? item + 1 : item))}>Increment {index}</Button>
        </>
    ))}

    
    </View>
  )


}


const styles = StyleSheet.create({
  container: {
    // width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
});

export default Counter;