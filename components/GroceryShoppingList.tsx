import React, { useState, useCallback } from "react";
import { Button, TextInput, Text, View, StyleSheet } from "react-native";

function GroceryShoppingList() {
    const [groceryItem, setGroceryItem] = useState('');
    const [items, setItems] = useState<string[]>([]);

    const addNewItemToShoppingList = useCallback(() => {
        if (groceryItem.trim()) {
            setItems([groceryItem, ...items]);
            setGroceryItem('');
        }
    }, [groceryItem, items]);

    return (
        <View style={styles.container} testID="grocery-shopping-list">
            <TextInput
                testID="grocery-input"
                style={styles.input}
                value={groceryItem}
                placeholder="Enter grocery item"
                onChangeText={text => setGroceryItem(text)}
                accessibilityLabel="Grocery item input field"
            />
            <Button
                testID="add-item-button"
                title="Add the item to list"
                onPress={addNewItemToShoppingList}
            />
            <View testID="grocery-list" style={styles.list}>
                {items.map((item: string, index: number) => (
                    <Text 
                        key={`${item}-${index}`} 
                        testID={`grocery-item-${index}`}
                        style={styles.listItem}
                        accessibilityLabel={`Grocery item: ${item}`}
                    >
                        {item}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    list: {
        marginTop: 20,
    },
    listItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 5,
        borderRadius: 5,
    },
});

export default GroceryShoppingList;