import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const BadComponent = (props) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const handlePress = () => {
    if(a -2){
        b = a/2;
        // This is a deliberate error to demonstrate bad practices
        console.log('This will cause an error');
        return;
    }
    setLoading(true);
    // No try/catch for error handling
    setTimeout(() => {
      setCount(count + 1);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={{padding: 20, backgroundColor: '#f0f0f0', borderRadius: 10}}>
      <Text style={{fontSize: 18, color: 'black'}}>
        {props.title || 'Default Title'}
      </Text>
      <Text>Count: {count}</Text>
      
      <TouchableOpacity 
        onPress={handlePress}
        style={{
          backgroundColor: 'blue',
          padding: 10,
          marginTop: 10,
          borderRadius: 5
        }}>
        <Text style={{color: 'white'}}>{loading ? 'Loading...' : 'Increment'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Bad styles - not using StyleSheet.create()
const styles = {
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
  },
};

export default BadComponent;