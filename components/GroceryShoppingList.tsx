import React, { useState, useCallback } from "react";
import { TouchableOpacity, TextInput, Text, View, StyleSheet } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface GroceryShoppingListProps {}

export default function GroceryShoppingList({}: GroceryShoppingListProps) {
    const [groceryItem, setGroceryItem] = useState('');
    const [items, setItems] = useState<string[]>([]);

    const addNewItemToShoppingList = useCallback(() => {
        if (groceryItem.trim()) {
            setItems([groceryItem, ...items]);
            setGroceryItem('');
        }
    }, [groceryItem, items]);

    const deleteItem = useCallback((index: number) => {
        setItems(items.filter((_, i) => i !== index));
    }, [items]);

    return (
        <ThemedView style={styles.container} testID="grocery-shopping-list">
            <ThemedText style={styles.title}>Grocery Shopping List Demo</ThemedText>
            
            <TextInput
                testID="grocery-input"
                style={styles.input}
                value={groceryItem}
                placeholder="Enter grocery item"
                placeholderTextColor="#999"
                onChangeText={text => setGroceryItem(text)}
                accessibilityLabel="Grocery item input field"
            />
            
            <TouchableOpacity
                testID="add-item-button"
                style={styles.addButton}
                onPress={addNewItemToShoppingList}
                accessibilityLabel="Add item to grocery list"
            >
                <ThemedText style={styles.addButtonText}>Add the item to list</ThemedText>
            </TouchableOpacity>
            
            <View testID="grocery-list" style={styles.list}>
                {items.length === 0 ? (
                    <ThemedText style={styles.emptyText} testID="empty-grocery-list">
                        No items in your list yet
                    </ThemedText>
                ) : (
                    items.map((item: string, index: number) => (
                        <View 
                            key={`${item}-${index}`}
                            style={styles.listItemContainer}
                            testID={`grocery-item-${index}`}
                        >
                            <ThemedText 
                                style={styles.listItem}
                                accessibilityLabel={`Grocery item: ${item}`}
                            >
                                {item}
                            </ThemedText>
                            <TouchableOpacity
                                testID={`delete-item-${index}`}
                                style={styles.deleteButton}
                                onPress={() => deleteItem(index)}
                                accessibilityLabel={`Delete ${item}`}
                            >
                                <ThemedText style={styles.deleteButtonText}>×</ThemedText>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 44, // Ensure minimum touch target
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        minHeight: 44, // Ensure minimum touch target
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        gap: 8,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
    },
    listItem: {
        flex: 1,
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.6,
        padding: 20,
    },
});