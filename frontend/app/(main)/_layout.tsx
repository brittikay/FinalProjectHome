import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MainLayout() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const MenuItem = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <FontAwesome5 name={icon} size={20} color="#2c3e50" />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <Pressable
              onPress={() => setIsMenuOpen(true)}
              style={{ marginLeft: 15 }}
            >
              <FontAwesome5 name="bars" size={24} color="#2c3e50" />
            </Pressable>
          ),
          headerTitle: () => (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search recipes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <FontAwesome5 name="search" size={16} color="#2c3e50" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <Pressable
                onPress={() => router.push('/recipe-suggestions')}
                style={{ marginRight: 15 }}
              >
                <FontAwesome5 name="magic" size={24} color="#2c3e50" />
              </Pressable>
              <Pressable
                onPress={() => router.push('/profile')}
                style={{ marginRight: 15 }}
              >
                <FontAwesome5 name="user-circle" size={24} color="#2c3e50" />
              </Pressable>
            </View>
          ),
          headerTitleAlign: 'center',
        }}
      />

      <Modal
        visible={isMenuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.menuContainer}>
            <SafeAreaView style={styles.menuContent}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menu</Text>
                <Pressable onPress={() => setIsMenuOpen(false)}>
                  <FontAwesome5 name="times" size={24} color="#2c3e50" />
                </Pressable>
              </View>
              
              <MenuItem
                icon="home"
                label="Home"
                onPress={() => {
                  router.push('/');
                  setIsMenuOpen(false);
                }}
              />
              <MenuItem
                icon="calendar-alt"
                label="Meal Planning"
                onPress={() => {
                  router.push('/meal-planning');
                  setIsMenuOpen(false);
                }}
              />
              <MenuItem
                icon="book-open"
                label="Recipe Collection"
                onPress={() => {
                  router.push('/recipes');
                  setIsMenuOpen(false);
                }}
              />
              <MenuItem
                icon="shopping-basket"
                label="Shopping List"
                onPress={() => {
                  router.push('/shopping-list');
                  setIsMenuOpen(false);
                }}
              />
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 20,
    width: '100%',
    maxWidth: 280,
    paddingRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#2c3e50',
  },
  searchButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 