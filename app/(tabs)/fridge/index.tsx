import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export default function FridgeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fridge</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '500',
  },
});
