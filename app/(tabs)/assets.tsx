import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Added MaterialCommunityIcons for additional icons
import { useEffect } from 'react';
import { updateAsset, addAsset, deleteAsset, getAssets } from '../../services/authService';




type Asset = {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
  assignedTo?: string; // Employee name is optional
  employeeId: string;
  serialNumber: string;
};

export default function Assets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'Name' | 'Type' | 'Status' | 'Employee ID'>('Employee ID'); // Default to Employee ID
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    type: 'Laptop',
    status: 'Available',
    assignedTo: '',
    employeeId: '',
    serialNumber: '',
  });

  

  const fetchAssetsFromDB = async () => {
    try {
      const data = await getAssets();
      console.log("✅ Data received from backend:", data);
  
      if (Array.isArray(data)) {
        const formatted = data.map(item => ({
          ...item,
          id: item._id, // 🔁 convert _id to id for UI
        }));
        setAssets(formatted); // ✅ finally set it
      } else {
        console.warn("❌ Data is not an array:", data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch assets:", err);
    }
  };
  useEffect(() => {
    fetchAssetsFromDB(); // Fetch assets when the component mounts
  }, []);

  const [assets, setAssets] = useState<Asset[]>([]); 
  
  
  
  

  // Function to get the color based on asset status
  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'Available':
        return '#34C759';
      case 'Assigned':
        return '#FF9500';
      case 'Maintenance':
        return '#FF3B30';
      case 'Retired':
        return '#8E8E93';
      default:
        return '#000';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Laptop':
        return <Ionicons name="laptop-outline" size={24} color="#007AFF" />;
      case 'Phone':
        return <Ionicons name="phone-portrait-outline" size={24} color="#007AFF" />;
      case 'Tablet':
        return <Ionicons name="tablet-landscape-outline" size={24} color="#007AFF" />;
      case 'Server':
        return <MaterialCommunityIcons name="server" size={24} color="#007AFF" />;
      case 'Mouse':
        return <MaterialCommunityIcons name="mouse" size={24} color="#007AFF" />;
      case 'Keyboard':
        return <MaterialCommunityIcons name="keyboard" size={24} color="#007AFF" />;
      case 'Monitor':
        return <MaterialCommunityIcons name="monitor" size={24} color="#007AFF" />;
      case 'Printer':
        return <MaterialCommunityIcons name="printer" size={24} color="#007AFF" />;
      default:
        return <Ionicons name="help-outline" size={24} color="#007AFF" />;
    }
  };

  const handleSaveAsset = async () => {
    
    if (editAsset) {
      try {
        if (editAsset) {
          try {
            const response = await updateAsset(editAsset.id, editAsset);
        
            if (response?.success && response.asset) {
              await fetchAssetsFromDB(); // ✅ refresh latest list
        
              setEditAsset(null);
              setShowModal(false);
            } else {
              alert("Failed to update asset. Please try again.");
            }
          } catch (error) {
            console.error("Error saving changes to asset:", error);
            alert("Error saving changes to asset");
          }
        }
        
      } catch (error) {
        console.error("Error saving changes to asset:", error);
        alert("Error saving changes to asset");
      }
    } else if (newAsset.serialNumber && newAsset.type && newAsset.employeeId) {
      try {
        const response = await addAsset(newAsset);
        const savedAsset = {
          ...newAsset,
          id: response.asset?._id || (assets.length + 1).toString(),
        };
  
        setAssets([...assets, savedAsset as Asset]);
        setNewAsset({
          name: '',
          type: 'Laptop',
          status: 'Available',
          assignedTo: '',
          employeeId: '',
          serialNumber: '',
        });
        setShowModal(false);
      } catch (err) {
        console.error('Add asset error:', err);
        alert('Failed to add asset');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };
  


  const handleEditAsset = (asset: Asset) => {
    setEditAsset(asset);
    setShowModal(true);
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteAsset(id);
      await fetchAssetsFromDB(); // 🔁 Refresh the asset list
    } catch (error) {
      alert("Failed to delete asset");
    }
  };
  
  

  const filteredAssets = assets.filter((asset) => {
    if (!asset) return false; // Skip undefined/null
    if (filterCategory === 'Name') {
      return asset.name?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterCategory === 'Type') {
      return asset.type?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterCategory === 'Status') {
      return asset.status?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filterCategory === 'Employee ID') {
      return asset.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });
  

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Assets</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editAsset ? 'Edit Asset' : 'Add New Asset'}</Text>

            {/* Asset Name Input */}
            <Text style={styles.modalLabel}>Asset Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Asset Name"
              value={editAsset ? editAsset.name : newAsset.name}
              onChangeText={(text) =>
                editAsset
                  ? setEditAsset((prev) => (prev ? { ...prev, name: text } : null))
                  : setNewAsset({ ...newAsset, name: text })
              }
            />

            {/* Employee ID Input */}
            <Text style={styles.modalLabel}>Employee ID</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Employee ID"
              value={editAsset ? editAsset.employeeId : newAsset.employeeId}
              onChangeText={(text) =>
                editAsset
                  ? setEditAsset((prev) => (prev ? { ...prev, employeeId: text } : null))
                  : setNewAsset({ ...newAsset, employeeId: text })
              }
            />

            {/* Assigned To (Optional) */}
            <Text style={styles.modalLabel}>Assigned To (Optional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Assigned To"
              value={editAsset ? editAsset.assignedTo : newAsset.assignedTo}
              onChangeText={(text) =>
                editAsset
                  ? setEditAsset((prev) => (prev ? { ...prev, assignedTo: text } : null))
                  : setNewAsset({ ...newAsset, assignedTo: text })
              }
            />

            {/* Device Type Picker */}
            <Text style={styles.modalLabel}>Device Type</Text>
            <Picker
              selectedValue={editAsset ? editAsset.type : newAsset.type}
              onValueChange={(itemValue) =>
                editAsset
                  ? setEditAsset((prev) => (prev ? { ...prev, type: itemValue } : null))
                  : setNewAsset((prev) => ({ ...prev, type: itemValue }))
              }
              style={styles.modalPicker}
            >
              <Picker.Item label="Laptop" value="Laptop" />
              <Picker.Item label="Phone" value="Phone" />
              <Picker.Item label="Tablet" value="Tablet" />
              <Picker.Item label="Server" value="Server" />
              <Picker.Item label="Mouse" value="Mouse" />
              <Picker.Item label="Keyboard" value="Keyboard" />
              <Picker.Item label="Monitor" value="Monitor" />
              <Picker.Item label="Printer" value="Printer" />
            </Picker>

            {/* Status Picker */}
            <Text style={styles.modalLabel}>Status</Text>
            <Picker
              selectedValue={editAsset ? editAsset.status : newAsset.status}
              onValueChange={(itemValue) =>
                editAsset
                  ? setEditAsset((prev) => (prev ? { ...prev, status: itemValue } : null))
                  : setNewAsset((prev) => ({ ...prev, status: itemValue }))
              }
              style={styles.modalPicker}
            >
              <Picker.Item label="Available" value="Available" />
              <Picker.Item label="Assigned" value="Assigned" />
              <Picker.Item label="Maintenance" value="Maintenance" />
              <Picker.Item label="Retired" value="Retired" />
            </Picker>

            {/* Serial Number Input */}
            <Text style={styles.modalLabel}>Serial Number</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Serial Number"
              value={editAsset ? editAsset.serialNumber : newAsset.serialNumber}
              onChangeText={(text) =>
                editAsset
                  ? setEditAsset((prev) => (prev ? { ...prev, serialNumber: text } : null))
                  : setNewAsset({ ...newAsset, serialNumber: text })
              }
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setShowModal(false)} />
              <Button title="Save" onPress={handleSaveAsset} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Search and Filter Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Picker
          selectedValue={filterCategory}
          onValueChange={(itemValue) => setFilterCategory(itemValue as 'Name' | 'Type' | 'Status' | 'Employee ID')}
          style={styles.filterPicker}
        >
          <Picker.Item label="Name" value="Name" />
          <Picker.Item label="Type" value="Type" />
          <Picker.Item label="Status" value="Status" />
          <Picker.Item label="Employee ID" value="Employee ID" />
        </Picker>
      </View>

      {/* Existing Asset List */}
      <ScrollView style={styles.list}>
        {filteredAssets.map((asset) => (
          <View key={asset.id} style={styles.assetCard}>
            <View style={styles.assetHeader}>
              {getDeviceIcon(asset.type)}
              <Text style={styles.assetName}>{asset.name}</Text>
            </View>
            <Text style={styles.assetSerial}>SN: {asset.serialNumber}</Text>
            <Text style={styles.assignedTo}>Employee ID: {asset.employeeId}</Text>
            {asset.assignedTo && <Text style={styles.assignedTo}>Assigned to: {asset.assignedTo}</Text>}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(asset.status) }]}>
              <Text style={styles.statusText}>{asset.status}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditAsset(asset)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAsset(asset.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  filterPicker: {
    width: 120,
    marginLeft: 10,
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dashboardCard: {
    alignItems: 'center',
  },
  dashboardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  dashboardLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  list: {
    padding: 10,
  },
  assetCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  assetSerial: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  assignedTo: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row', // Align buttons side by side
    alignItems: 'center', // Align buttons with the content
    marginTop: 10,
    gap: 10, // Add spacing between buttons
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1, // Ensure buttons are evenly sized
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    flex: 1, // Ensure buttons are evenly sized
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  modalPicker: {
    height: 40,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});