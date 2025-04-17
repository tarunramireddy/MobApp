// Reports.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const sampleAssets = [
  {
    name: 'MacBook Pro',
    type: 'Laptop',
    status: 'Available',
    employeeId: 'EMP001',
    assignedTo: 'John Doe',
    serialNumber: 'SN123456',
  },
  {
    name: 'Dell Monitor',
    type: 'Monitor',
    status: 'Assigned',
    employeeId: 'EMP002',
    assignedTo: 'Alice Smith',
    serialNumber: 'SN567890',
  },
];

export default function Reports() {
  const handleExport = async () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleAssets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');

    if (Platform.OS === 'web') {
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'Asset_Inventory.xlsx');
    } else {
      const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.documentDirectory + 'Asset_Inventory.xlsx';
      await FileSystem.writeAsStringAsync(uri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(uri);
    }
  };

  const reports = [
    {
      title: 'Asset Inventory',
      description: 'Download current asset list as Excel',
      icon: 'cloud-download-outline',
      onPress: handleExport,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>
      <ScrollView style={styles.content}>
        {reports.map((report, index) => (
          <TouchableOpacity key={index} style={styles.reportCard} onPress={report.onPress}>
            <View style={styles.reportIcon}>
              <Ionicons name={report.icon as any} size={24} color="#007AFF" />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    color: '#1F2937',
  },
  content: {
    paddingHorizontal: 16,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});