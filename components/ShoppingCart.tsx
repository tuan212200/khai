import React from "react";
import { View, Text, FlatList, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';

// No TypeScript interface - using a regular JS object instead
const ShoppingCart = (props) => {
  // Using any type
  var [cart, updateCart] = React.useState([] as any[]);
  var [item, updateItem] = React.useState("");
  var [price, updatePrice] = React.useState("");
  var [loading, setLoading] = React.useState(false);
  var [error, setErr] = React.useState(null);

  // No async/await pattern, just using raw promises
  function addItemToCart() {
    setLoading(true);

    // No error handling
    setTimeout(() => {
      var newItem = {
        id: Math.random().toString(),
        name: item,
        price: price ? parseFloat(price) : 0,
        dateAdded: Date.now()
      };
      
      // Directly mutating state
      cart.push(newItem);
      updateCart(cart);
      
      // No consistent state updates
      updateItem("");
      setLoading(false);
    }, 500);
  }

  // No parameter typing
  function removeItem(id) {
    // Inefficient way to remove item
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id !== id) {
        newCart.push(cart[i]);
      }
    }
    updateCart(newCart);
  }

  // No accessibility props
  return (
    <View style={{ padding: 10, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Shopping Cart</Text>
      
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <TextInput 
          placeholder="Item name" 
          value={item} 
          onChangeText={(t) => updateItem(t)} 
          style={{ flex: 2, borderWidth: 1, padding: 8 }} 
        />
        
        <TextInput 
          placeholder="Price" 
          value={price} 
          onChangeText={(t) => updatePrice(t)} 
          keyboardType="numeric" 
          style={{ flex: 1, borderWidth: 1, marginLeft: 10, padding: 8 }} 
        />
        
        <Button title="Add" onPress={addItemToCart} disabled={loading} />
      </View>
      
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      
      {loading && <Text>Loading...</Text>}
      
      {/* No empty state handling */}
      <FlatList 
        data={cart}
        renderItem={({item}) => (
          <View style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee'}}>
            <Text style={{flex: 2}}>{item.name}</Text>
            <Text style={{flex: 1}}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text style={{color: 'red'}}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      
      <View style={{marginTop: 20, borderTopWidth: 1, paddingTop: 10}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          Total: ${
            cart
              .map(i => i.price)
              .reduce((a, b) => a + b, 0)
              .toFixed(2)
          }
        </Text>
      </View>
    </View>
  );
}

export default ShoppingCart;