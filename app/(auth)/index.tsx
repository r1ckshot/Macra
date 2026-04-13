import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macra</Text>
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
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: Colors.accentPrimary,
  },
});
