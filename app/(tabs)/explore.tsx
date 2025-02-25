import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Modal, Button, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ImagePicker from 'react-native-image-picker';

const CurrentUserId = '2';

const users = [
  { id: '1', name: 'Elif Nur Kemiksiz', groups: ['1','2'] },
  { id: '2', name: 'Enes Fehmi Manan', groups: ['4','2'] },
  { id: '3', name: 'Çetin Ceviz', groups: ['2','3'] },
  { id: '4', name: 'Jenny Anderson', groups: ['4'] },
];

const groups = [
  { id: '1', name: 'Maltepe Sitesi' },
  { id: '2', name: 'Pendik Sitesi Halısaha Grubu' },
  { id: '3', name: 'Siteler Arası Halısaha Grubu' },
  { id: '4', name: 'Maltepe Sitesi Altın Günü Grubu' },
];

const posts = [
  {
    id: '1',
    image: require('./site1.jpg'),
    name: 'Enes Fehmi Manan',
    text: 'Sitemizin çok güzel bir fotoğrafı!',
    likes: 'Sevgi Akca ve diğer 3 kişi',
    group: '1'
  }
];

const comments = [
  { id: '1', name: "Elif Nur Kemiksiz", text: 'Çok güzelmiş!', item_id: '1' },
  { id: '3', name: "Elif Nur Kemiksiz", text: 'Bunu beğendim.', item_id: '2' }
];

const likes = [
  { userId: '1', postId: '1' },
  { userId: '1', postId: '2' },
  { userId: '1', postId: '3' },
  { userId: '2', postId: '1' },
  { userId: '2', postId: '2' },
];

const App = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState('');
  const [originalBio, setOriginalBio] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');

  const selectImage = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setProfilePhoto(response);
      }
    });
  };

  const handleSave = () => {
    setOriginalBio(bio);
    // Burada kaydetme işlemi yapılabilir (API çağrısı vb.)
    alert('Değişiklikler kaydedildi!');
  };

  const isModified = bio !== originalBio;

  const getUserGroups = () => {
    const userGroupIds = users.find(user => user.id === CurrentUserId)?.groups || [];
    return groups.filter(group => userGroupIds.includes(group.id));
  };

  useEffect(() => {
    const fetchedUserGroups = getUserGroups();
    setUserGroups(fetchedUserGroups);
  }, []);

  const getFilteredPosts = useMemo(() => {
    if (selectedGroup === 'all') {
      return posts;
    }
    return posts.filter(post => post.groups.includes(selectedGroup));
  }, [posts, selectedGroup]);

  const getCommentCount = useCallback((postId) => {
    return comments.filter(comment => comment.item_id === postId).length;
  }, [comments]);

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <Image source={item.image} style={styles.postImage} />
      <Text style={styles.postName}>{item.name}</Text>
      <Text style={styles.postText}>{item.text}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          {liked ? <AntDesign name="heart" size={32} color="#a8ddf5" /> : <AntDesign name="hearto" size={32} color="black" />}
        </TouchableOpacity>
        <Text style={styles.likes}>{item.likes}</Text>
        <TouchableOpacity onPress={() => {
          setSelectedPostId(item.id);
          setCommentsVisible(true);
        }}>
          <AntDesign name="message1" size={32} color="#000" />
        </TouchableOpacity>
        <Text style={styles.likes}>{getCommentCount(item.id)}</Text>
      </View>
    </View>
  );

  const userPosts = posts.filter(post => likes.some(like => like.userId === CurrentUserId && like.postId === post.id));

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={require('./ASlogo.png')} style={styles.logo} />
        <Text style={styles.navbarText}>Apsiyon Social</Text>
        <View style={styles.navbarLine} />
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={selectImage}>
          <Image
            source={profilePhoto ? { uri: profilePhoto.uri } : require('./enes.jpg')}
            style={styles.profilePhoto}
          />
        </TouchableOpacity>
        <Text style={styles.name}>Enes Fehmi Manan</Text>
        <TextInput
          style={styles.bio}
          onChangeText={text => setBio(text)}
          value={bio}
          placeholder="Biyografinizi yazın..."
          multiline
        />
        {isModified && <Button title="Kaydet" onPress={handleSave} />}
        <Text style={styles.name}> </Text>
        <Text style={styles.name}>Gönderilerim</Text>
      </View>
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        style={styles.postsList}
      />
      <Modal
        visible={commentsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentsVisible(false)}
      >
        <View style={styles.commentsPanel}>
          <Button title="Kapat" onPress={() => setCommentsVisible(false)} />
          <FlatList
            data={comments.filter(comment => comment.item_id === selectedPostId)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentName}>{item.name}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a8ddf5',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  navbarText: {
    color: '#a8ddf5',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  navbarLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#a8ddf5',
  },
  profileContainer: {
    padding: 16,
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center'
  },
  postsList: {
    paddingHorizontal: 16,
  },
  post: {
    backgroundColor: '#fff',
    borderColor: '#a8ddf5',
    borderRadius: 10,
    borderWidth: 3,
    margin: 10,
    padding: 10
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  postName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    marginLeft: 8,
    fontSize: 16,
  },
  commentsPanel: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    marginTop: 50,
    borderRadius: 10,
  },
  commentContainer: {
    marginBottom: 8,
  },
  commentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
  },
});

export default App;
