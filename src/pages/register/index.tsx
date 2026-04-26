import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !password || !email) {
      Alert.alert('Aviso', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://fakestoreapi.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          name: {
            firstname: username,
            lastname: 'User'
          },
          address: {
            city: 'Unknown',
            street: 'Unknown',
            number: 0,
            zipcode: '00000',
            geolocation: {
              lat: '0',
              long: '0'
            }
          },
          phone: '00000000'
        })
      });

      if (!res.ok) {
        throw new Error('Falha no cadastro');
      }

      await res.json();
      
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
      
    } catch (error) {
      Alert.alert('Erro', 'se ferrou');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

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
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
              <Text style={styles.loginLinkText}>Voltar para o Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4e1',
  },
  scrollContainer: {
    flexGrow: 1,
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
    textAlign: 'center',
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
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
