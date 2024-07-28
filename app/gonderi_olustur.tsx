import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

const CreatePostScreen = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const handleSubmit = () => {
    // Burada gönderi yayınlama işlemlerini yapabilirsiniz
    // Örneğin, bir API'ye veri gönderme işlemi

    // İşlem tamamlandıktan sonra kullanıcıya bilgi ver
    Alert.alert(
      "Başarılı",
      "Gönderiniz yayınlanmıştır",
      [
        { text: "Tamam", onPress: () => {
          // Formu sıfırla
          setImage(null);
          setDescription('');
          setSelectedGroup('');
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navbar}>
        <Image source={require('./(tabs)/ASlogo.png')} style={styles.logo} />
        <Text style={styles.logoText}>Apsiyon Social</Text>
      </View>

      <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
        {image ? (
          <Image source={image} style={styles.uploadedImage} />
        ) : (
          <Text>Fotoğraf yüklemek için tıklayın</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Gönderiniz için bir açıklama yazın..."
        value={description}
        onChangeText={setDescription}
      />

      <Picker
        selectedValue={selectedGroup}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedGroup(itemValue)}
      >
        <Picker.Item label="Gönderilecek grubu seçin" value="" />
        <Picker.Item label="Pendik Sitesi Halısaha Grubu" value="grup1" />
        <Picker.Item label="Siteler Arası Halısaha Grubu" value="grup2" />
        <Picker.Item label="Maltepe Sitesi Altın Günü Grubu" value="grup3" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </ScrollView>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logoText: {
    color: '#a8ddf5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#a8ddf5',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 20,
    height: 100,
  },
  picker: {
    margin: 20,
  },
  button: {
    backgroundColor: '#a8ddf5',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;