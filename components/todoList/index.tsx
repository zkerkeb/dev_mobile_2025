import { Button } from '@react-navigation/elements';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import TaskItem from "../taskItem";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

const fakeTodo = [
   {id: 1, title: 'todo 1', completed: false},
   {id: 2, title: 'todo 2', completed: false},
   {id: 3, title: 'todo 3', completed: false},
   {id: 4, title: 'todo 4', completed: false},
   {id: 5, title: 'todo 5', completed: false},
   {id: 6, title: 'todo 6', completed: false},
   {id: 7, title: 'todo 7', completed: false},
   {id: 8, title: 'todo 8', completed: false},
   {id: 9, title: 'todo 9', completed: false},
]

const TodoList = () => {
    const [todos, setTodos] = useState(fakeTodo);
    const [newTodo, setNewTodo] = useState('test');
    const [isEditing, setIsEditing] = useState(null);
   const [editedTodo, setEditedTodo] = useState('');

    const handleDelete = (todo) => {
        setTodos(todos.filter((t) => t.id !== todo.id));
    }


    const handleAddTodo = () => {
        if (newTodo.trim() === '') {
            alert('Veuillez entrer un todo');
            return;
        }
        if(newTodo.length < 3) {
            alert('Le todo doit contenir au moins 3 caractères');
            return;
        }
        // setTodos(todos.push({id: todos.length + 1, title: newTodo, completed: false}))
        setTodos([{id: todos.length + 1, title: newTodo, completed: false},...todos]);
        setNewTodo('');
    }

    const handleEditTodo = (todo) => {
        setIsEditing(todo.id);
        setEditedTodo(todo.title);
    }

    const handleSaveEditTodo = (todo) => {
        setTodos(todos.map((t) => t.id === todo.id ? {...t, title: editedTodo} : t));
        setIsEditing(null);
        setEditedTodo('');
    }

    const handleCancelEditTodo = (todo) => {
        setIsEditing(null);
        setEditedTodo('');
    }
    return(
        <ThemedView>
            <ThemedText>TodoList</ThemedText>
            <TextInput 
            style={styles.input}
            placeholder="Ajouter un todo"
            value={newTodo}
            onChangeText={(text) => setNewTodo(text)}
            onSubmitEditing={handleAddTodo}
            // onSubmitEditing={(event) => handleAddTodo(event.nativeEvent.text)}
            />
            {todos.map(
                (todo) => (
                <ThemedView key={todo.id}>
                {isEditing !== todo.id ? 
                <>
                <TaskItem todo={todo.title} />
                <Button onPress={() => handleDelete(todo)}>Supprimer</Button>
                <Button onPress={() => handleEditTodo(todo)}>Modifier</Button>
                </>
                :
                <>
                <TextInput
                style={styles.input}
                value={editedTodo}
                onChangeText={(text) => setEditedTodo(text)}
                />
                <Button onPress={() => handleSaveEditTodo(todo)}>Enregistrer</Button>
                <Button onPress={() => setIsEditing(null)}>Annuler</Button>
                </>
                }
                </ThemedView>
                )
        )}
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'red',
        padding: 10,
        margin: 10,
        color: 'white',
    },
});


export default TodoList ;
