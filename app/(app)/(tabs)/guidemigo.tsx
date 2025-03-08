import { View, Text, StyleSheet } from 'react-native';

export default function Guidemigo() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guidemigo Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
});