import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Settings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const handleSignOut = () => {
    router.replace('/(auth)/sign-in');
  };

  const handleLanguagePress = () => {
    const msg = 'Language setting is not editable in this version.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Language', msg);
  };

  const handleThemePress = () => {
    const msg = 'Toggle dark mode below.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Theme', msg);
  };

  const handleProfilePress = () => {
    const msg = 'Profile editing is under development.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Profile', msg);
  };

  const handleSecurityPress = () => {
    const msg = 'Please contact the system administrator for a temporary password.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Forgot Password', msg);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const themeStyles = isDarkMode ? darkStyles : styles;

  return (
    <View style={themeStyles.container}>
      <View style={themeStyles.header}>
        <Text style={themeStyles.title}>Settings</Text>
      </View>

      <ScrollView style={themeStyles.content}>
        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>Notifications</Text>
          <View style={themeStyles.settingItem}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Push Notifications</Text>
              <Text style={themeStyles.settingDescription}>Receive alerts about assets</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={themeStyles.settingItem}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Email Notifications</Text>
              <Text style={themeStyles.settingDescription}>Receive email reports and alerts</Text>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
        </View>

        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>App Settings</Text>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleLanguagePress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Language</Text>
              <Text style={themeStyles.settingDescription}>English</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleThemePress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Theme</Text>
              <Text style={themeStyles.settingDescription}>{isDarkMode ? 'Dark' : 'Light'}</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </TouchableOpacity>
        </View>

        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>Account</Text>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleProfilePress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Profile</Text>
              <Text style={themeStyles.settingDescription}>Manage your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleSecurityPress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Security</Text>
              <Text style={themeStyles.settingDescription}>Password and authentication</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={themeStyles.signOutButton} onPress={handleSignOut}>
          <Text style={themeStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const darkStyles = StyleSheet.create({
  ...styles,
  container: {
    ...styles.container,
    backgroundColor: '#1c1c1e',
  },
  header: {
    ...styles.header,
    backgroundColor: '#2c2c2e',
    borderBottomColor: '#3a3a3c',
  },
  title: {
    ...styles.title,
    color: '#fff',
  },
  section: {
    ...styles.section,
    backgroundColor: '#2c2c2e',
  },
  sectionTitle: {
    ...styles.sectionTitle,
    color: '#fff',
    borderBottomColor: '#3a3a3c',
  },
  settingTitle: {
    ...styles.settingTitle,
    color: '#fff',
  },
  settingDescription: {
    ...styles.settingDescription,
    color: '#d1d1d6',
  },
  signOutButton: {
    ...styles.signOutButton,
    backgroundColor: '#ff453a',
  },
  signOutText: {
    ...styles.signOutText,
    color: '#fff',
  },
});
