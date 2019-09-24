import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Oi</Text>
      <Text>Olá</Text>
    </View>
  );
}
