import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import RouteCard from '../components/RouteCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

export default function ResultsScreen({ navigation, route }: Props) {
  const { routes, origin, destination, realtimeAvailable } = route.params;

  const handleRoutePress = (selectedRoute: any) => {
    navigation.navigate('RouteDetail', { route: selectedRoute });
  };

  return (
    <View style={styles.container}>
      {!realtimeAvailable && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            ⚠️ Real-time data unavailable. Showing estimated times.
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerText}>
          From: <Text style={styles.coordText}>{origin}</Text>
        </Text>
        <Text style={styles.headerText}>
          To: <Text style={styles.coordText}>{destination}</Text>
        </Text>
        <Text style={styles.resultCount}>{routes.length} routes found</Text>
      </View>

      <ScrollView style={styles.routesList}>
        {routes.map((routeItem, index) => (
          <TouchableOpacity
            key={routeItem.id}
            onPress={() => handleRoutePress(routeItem)}
          >
            <RouteCard route={routeItem} index={index} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  banner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fbbf24',
  },
  bannerText: {
    color: '#92400e',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  coordText: {
    fontWeight: '600',
    color: '#374151',
  },
  resultCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 8,
  },
  routesList: {
    flex: 1,
    padding: 16,
  },
});
