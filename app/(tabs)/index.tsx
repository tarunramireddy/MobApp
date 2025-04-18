import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useEffect, useState } from 'react';
import { getAssetStats } from '../../services/authService';

import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import Head from 'expo-router/head';

export default function Dashboard() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'IT Asset Dashboard';
    }
  }, []);

  const [statsData, setStatsData] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
  });

  const fetchStats = async () => {
    try {
      const data = await getAssetStats();
      setStatsData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const stats = [
    {
      title: 'Total Assets',
      value: statsData.total.toString(),
      icon: 'laptop-outline',
      color: '#6366F1',
      onPress: () => router.push('/assets'),
    },
    {
      title: 'Available',
      value: statsData.available.toString(),
      icon: 'checkmark-circle-outline',
      color: '#10B981',
      onPress: () => router.push('/assets?filter=available'),
    },
    {
      title: 'Assigned',
      value: statsData.assigned.toString(),
      icon: 'person-outline',
      color: '#F59E0B',
      onPress: () => router.push('/assets?filter=assigned'),
    },
    {
      title: 'Maintenance',
      value: statsData.maintenance.toString(),
      icon: 'construct-outline',
      color: '#EF4444',
      onPress: () => router.push('/assets?filter=maintenance'),
    },
  ];

  const quickActions = [
    {
      title: 'Add Asset',
      icon: 'add-circle-outline',
      color: '#6366F1',
      onPress: () => router.push('/assets'),
    },
    {
      title: 'Scan QR',
      icon: 'qr-code-outline',
      color: '#10B981',
      onPress: () => router.push('/scan'),
    },
    {
      title: 'Reports',
      icon: 'document-text-outline',
      color: '#F59E0B',
      onPress: () => router.push('/reports'),
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      color: '#EF4444',
      onPress: () => router.push('/settings'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerOverlay}>
        <Text style={styles.welcomeLine}>Welcome back 👋</Text>
        <Text style={styles.dashboardTitle}>IT Asset Dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Pressable
              key={index}
              onPress={stat.onPress}
              style={({ pressed }) => [styles.statCard, pressed && styles.statCardPressed]}
            >
              <View style={[styles.statIconBg, { backgroundColor: stat.color + '20' }]}> 
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <Pressable
              onPress={() => router.push('/reports')}
              style={({ pressed }) => [styles.viewAllButton, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color="#6366F1" />
            </Pressable>
          </View>
          <View style={styles.activityList}>
            <Pressable style={({ pressed }) => [styles.activityItem, pressed && { opacity: 0.7 }]}>
              <View style={[styles.activityIcon, { backgroundColor: '#6366F120' }]}>
                <Ionicons name="time-outline" size={20} color="#6366F1" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>MacBook Pro assigned</Text>
                <Text style={styles.activityDescription}>to John Doe • Design Team</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.activityItem, pressed && { opacity: 0.7 }]}>
              <View style={[styles.activityIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="alert-circle-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Server maintenance due</Text>
                <Text style={styles.activityDescription}>Server #4 • Data Center</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />

                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerOverlay: {
    backgroundColor: 'rgba(30, 27, 75, 0.65)',
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeLine: {
    color: '#E0E7FF',
    fontSize: 16,
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -50,
    marginHorizontal: -8,
  },
  statCard: {
    width: '45%',
    backgroundColor: 'white',
    margin: '2.5%',
    padding: 15,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  statCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  activityDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  quickActions: {
    marginTop: 24,
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
  },
  actionCard: {
    width: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  actionCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
});