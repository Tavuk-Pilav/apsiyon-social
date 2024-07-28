import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');

  const CurrentUserId = '2';
  const navigation = useNavigation();

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
      image: require('./deneme.png'),
      name: 'Ayşe Öztürk',
      text: 'çok güzel eğlendik 1',
      likes: ['1', '2', '3'],
      group: '1'
    },
    {
      id: '2',
      image: require('./deneme.png'),
      name: 'Ayşe Öztürk',
      text: 'çok güzel eğlendik 2',
      likes: ['1', '2'],
      group: '4'
    },
    {
      id: '3',
      image: require('./deneme.png'),
      name: 'Ayşe Öztürk',
      text: 'çok güzel eğlendik 3',
      likes: ['1'],
      group: '3'
    }
  ];

  const comments = [
    { id: '1', name: "Elif Nur Kemiksiz", text: 'Çok güzelmiş!', item_id: '1'},
    { id: '2', name: "Elif Nur Kemiksiz", text: 'Harika!', item_id: '1'},
    { id: '3', name: "Elif Nur Kemiksiz", text: 'Bunu beğendim.', item_id: '2'}
  ];

  const likes = [
    {userId: '1', postId: '1'},
    {userId: '1', postId: '2'},
    {userId: '1', postId: '3'},
    {userId: '2', postId: '1'},
    {userId: '2', postId: '2'},
  ];

  const getUserGroups = () => {
    const currentUser = users.find(user => user.id === CurrentUserId);
    return groups.filter(group => currentUser.groups.includes(group.id));
  };

  useEffect(() => {
    const fetchedUserGroups = getUserGroups();
    setUserGroups(fetchedUserGroups);
  }, []);

  const getFilteredPosts = useMemo(() => {
    if (selectedGroup === 'all') {
      return posts;
    }
    return posts.filter(post => post.group === selectedGroup);
  }, [posts, selectedGroup]);

  const getCommentCount = useCallback((postId) => {
    return comments.filter(comment => comment.item_id === postId).length;
  }, [comments]);

  const handleLikePost = (postId) => {
    setLikedPosts((prevLikedPosts) => {
      if (prevLikedPosts.includes(postId)) {
        return prevLikedPosts.filter(id => id !== postId);
      } else {
        return [...prevLikedPosts, postId];
      }
    });
  };

  const getFirstLikerName = (postId) => {
    const firstLikerId = likes.find(like => like.postId === postId)?.userId;
    return users.find(user => user.id === firstLikerId)?.name;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Image source={require('./ASlogo.png')} style={styles.logo} />
        <Text style={styles.title}>Apsiyon Social</Text>
      </View>
      <View style={styles.subNavbar}>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {selectedGroup === 'all' 
                ? 'Tüm Postlar' 
                : userGroups.find(g => g.id === selectedGroup)?.name || 'Grup Seç'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </View>
        </TouchableOpacity>
      </View>
      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <Text style={styles.dropdownHeader}>Gruplarım</Text>
          <TouchableOpacity onPress={() => {
            setSelectedGroup('all');
            setDropdownVisible(false);
          }}>
            <Text style={styles.dropdownItem}>Tüm Postlar</Text>
          </TouchableOpacity>
          {userGroups.map(group => (
            <TouchableOpacity 
              key={group.id} 
              onPress={() => {
                setSelectedGroup(group.id);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItem}>{group.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.divider} />
      <FlatList
        data={getFilteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={item.image} style={styles.postImage} />
            <Text style={styles.postName}>{item.name}</Text>
            <Text style={styles.postText}>{item.text}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                {likedPosts.includes(item.id) ? <AntDesign name="heart" size={32} color="#a8ddf5"  />  : <AntDesign name="hearto" size={32} color="black" />}
              </TouchableOpacity>
              <Text style={styles.likes}>{getFirstLikerName(item.id)}{item.likes.length -1 == 0? <Text></Text>:<Text> ve {item.likes.length -1} kişi</Text>}  </Text>
              <TouchableOpacity onPress={() => {
                setSelectedPostId(item.id);
                setCommentsVisible(true);
              }}>
                <AntDesign name="message1" size={32} color="#000" />
              </TouchableOpacity>
              <Text style={styles.likes}>{getCommentCount(item.id)}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('gonderi_olustur')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#a8ddf5',
  },
  logo: {
    width: 40,
    height: 40
  },
  title: {
    color: '#a8ddf5',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  subNavbar: {
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a8ddf5',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    fontSize: 16,
    color: '#000'
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  dropdownHeader: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  dropdownItem: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5
  },
  divider: {
    height: 2,
    backgroundColor: '#a8ddf5'
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
    height: 200
  },
  postName: {
    fontWeight: 'bold',
    color: '#4f4f4f',
    marginTop: 10
  },
  postText: {
    color: '#4f4f4f'
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  likes: {
    marginRight: 15,
    marginLeft: 15,
    color: '#4f4f4f'
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#28ace8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold'
  },
  commentsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  commentContainer: {
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentName: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  commentText: {
    fontSize: 14,
  }
});

export default App;