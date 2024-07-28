import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image
          source={require('./ASlogo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Aksiyon</Text>
      </View>
      
      <ScrollView style={styles.notificationsContainer}>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            28 Ağustos 2024 saat 10.30'da mutfak tadilatı işimiz olacak ve 3 saat sürecek. Vereceğimiz rahatsızlıktan dolayı hepinizden özür dileriz.
          </Text>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            20 Ağustos 2024 saat 10.30'da mutfak tadilatı işimiz olacak ve 3 saat sürecek. Vereceğimiz rahatsızlıktan dolayı hepinizden özür dileriz.
          </Text>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            15 Ağustos 2024 saat 10.30'da mutfak tadilatı işimiz olacak ve 3 saat sürecek. Vereceğimiz rahatsızlıktan dolayı hepinizden özür dileriz.
          </Text>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            1 Ağustos 2024 saat 10.30'da mutfak tadilatı işimiz olacak ve 3 saat sürecek. Vereceğimiz rahatsızlıktan dolayı hepinizden özür dileriz.
          </Text>
        </View>
        {/* Daha fazla bildirim ekleyebilirsiniz */}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('aksiyonBildirimi')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#a8ddf5',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  title: {
    color: '#a8ddf5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationsContainer: {
    padding: 16,
  },
  notification: {
    backgroundColor: '#28ace8',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  notificationText: {
    fontSize: 20,
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 60,
    height: 60,
    backgroundColor: '#28ace8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;