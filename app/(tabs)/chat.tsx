import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
};

type ConnectedDevice = {
  id: string;
  name: string | null;
};

const CHAT_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const MESSAGE_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [username, setUsername] = useState('');
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const bleManagerRef = useRef<BleManager | null>(null);

  useEffect(() => {
    bleManagerRef.current = new BleManager();
    return () => {
      bleManagerRef.current?.destroy();
    };
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;

        if (apiLevel >= 31) {
          // Android 12+
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );

          if (allGranted) {
            setHasPermissions(true);
            Alert.alert('Succès', 'Permissions Bluetooth accordées');
          } else {
            Alert.alert('Erreur', 'Permissions Bluetooth requises pour utiliser le chat');
          }
        } else {
          // Android < 12
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );

          if (allGranted) {
            setHasPermissions(true);
            Alert.alert('Succès', 'Permissions Bluetooth accordées');
          } else {
            Alert.alert('Erreur', 'Permissions Bluetooth requises pour utiliser le chat');
          }
        }
      } catch (error) {
        console.error('Erreur permissions:', error);
        Alert.alert('Erreur', 'Impossible de demander les permissions');
      }
    } else {
      // iOS - les permissions sont gérées automatiquement
      setHasPermissions(true);
    }
  };

  const setupChat = () => {
    if (!username.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom d\'utilisateur');
      return;
    }
    setIsSetup(true);
    startAdvertising();
    startScanning();
  };

  const startScanning = async () => {
    if (!bleManagerRef.current || !hasPermissions) {
      Alert.alert('Erreur', 'Permissions Bluetooth non accordées');
      return;
    }

    setIsScanning(true);
    setDiscoveredDevices([]);

    bleManagerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Erreur scan:', error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        setDiscoveredDevices((prevDevices) => {
          const exists = prevDevices.find((d) => d.id === device.id);
          if (!exists) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Arrêter le scan après 30 secondes
    setTimeout(() => {
      stopScanning();
    }, 30000);
  };

  const stopScanning = () => {
    bleManagerRef.current?.stopDeviceScan();
    setIsScanning(false);
  };

  const startAdvertising = () => {
    // Note: L'advertising BLE nécessite une configuration native plus complexe
    // Pour une vraie implémentation, il faut utiliser des modules natifs supplémentaires
    setIsAdvertising(true);
    console.log('Advertising démarré (simulation)');
  };

  const connectToDevice = async (device: Device) => {
    try {
      if (!bleManagerRef.current) return;

      const connectedDevice = await device.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();

      setConnectedDevices((prev) => [
        ...prev,
        { id: device.id, name: device.name },
      ]);

      Alert.alert('Succès', `Connecté à ${device.name}`);

      // Écouter les messages entrants
      listenForMessages(connectedDevice);
    } catch (error) {
      console.error('Erreur connexion:', error);
      Alert.alert('Erreur', 'Impossible de se connecter à cet appareil');
    }
  };

  const listenForMessages = async (device: Device) => {
    try {
      device.monitorCharacteristicForService(
        CHAT_SERVICE_UUID,
        MESSAGE_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Erreur monitoring:', error);
            return;
          }

          if (characteristic?.value) {
            const messageData = atob(characteristic.value);
            const message = JSON.parse(messageData);

            setMessages((prev) => [...prev, message]);
          }
        }
      );
    } catch (error) {
      console.error('Erreur écoute messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: username,
      timestamp: Date.now(),
    };

    // Ajouter le message localement
    setMessages((prev) => [...prev, message]);

    // Envoyer aux appareils connectés
    const messageData = JSON.stringify(message);
    const base64Message = btoa(messageData);

    for (const device of connectedDevices) {
      try {
        const connectedDevice = await bleManagerRef.current?.devices([device.id]);
        if (connectedDevice && connectedDevice.length > 0) {
          await connectedDevice[0].writeCharacteristicWithResponseForService(
            CHAT_SERVICE_UUID,
            MESSAGE_CHARACTERISTIC_UUID,
            base64Message
          );
        }
      } catch (error) {
        console.error('Erreur envoi message:', error);
      }
    }

    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender === username;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name || 'Appareil inconnu'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  if (!hasPermissions) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.setupContainer}>
          <Text style={styles.title}>Chat Bluetooth de Proximité</Text>
          <Text style={styles.description}>
            Cette application nécessite les permissions Bluetooth pour fonctionner
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={requestBluetoothPermissions}
          >
            <Text style={styles.buttonText}>Demander les permissions</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!isSetup) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.setupContainer}>
          <Text style={styles.title}>Configuration du Chat</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={setupChat}>
            <Text style={styles.buttonText}>Démarrer le chat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Bluetooth</Text>
        <Text style={styles.username}>Connecté en tant que: {username}</Text>
        <Text style={styles.connectedCount}>
          {connectedDevices.length} appareil(s) connecté(s)
        </Text>
      </View>

      <View style={styles.devicesContainer}>
        <View style={styles.devicesHeader}>
          <Text style={styles.devicesTitle}>Appareils disponibles</Text>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanningButton]}
            onPress={isScanning ? stopScanning : startScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Arrêter' : 'Scanner'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.devicesList}>
          {discoveredDevices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceChip}
              onPress={() => connectToDevice(device)}
            >
              <Text style={styles.deviceChipText}>
                {device.name || 'Inconnu'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Écrivez un message..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    marginBottom: 24,
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  connectedCount: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  devicesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  devicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  scanButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scanningButton: {
    backgroundColor: '#E74C3C',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  devicesList: {
    maxHeight: 50,
  },
  deviceChip: {
    backgroundColor: '#ECF0F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  deviceChipText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '500',
  },
  deviceItem: {
    backgroundColor: '#ECF0F1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498DB',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2C3E50',
  },
  messageText: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#7F8C8D',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2C3E50',
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
