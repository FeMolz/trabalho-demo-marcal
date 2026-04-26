import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Aviso', 'Preencha os campos!');
      return;
    }

    setLoading(true);
    try {
      if (username === 'johnd' && password === 'm38rmF$') {
        const loginRes = await fetch('https://fakestoreapi.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!loginRes.ok) throw new Error();
      }

      router.replace('/home');
    } catch (error) {
      Alert.alert('Erro', 'se ferrou');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bem-vindo à FakeStoreRosa</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#ff1493" style={{ marginVertical: 20 }} />
        ) : (
          <View style={{ width: '100%' }}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register')}>
              <Text style={styles.registerLinkText}>Não tem uma conta? Registre-se aqui</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4e1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffb6c1',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    width: '100%',
    backgroundColor: '#ff1493',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
