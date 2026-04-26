import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DEVELOPERS = [
  { name: 'Felipe de Borba Molz', ra: '1136074' },
  { name: 'Alessandro da Rosa Filho', ra: '1136281' },
  { name: 'Pedro Namba Pênis da Silva', ra: '1137877' }
];

export default function InfoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Sobre o Grupo</Text>
        <Text style={styles.description}>
          Somos um grupo de desenvolvedores penizudos e superdotados focados em criar experiências únicas,
          com muito rosa e sombras verdes, desafiando todos os padrões do design convencional.
        </Text>

        <View style={styles.devList}>
          {DEVELOPERS.map((dev, idx) => (
            <View key={idx} style={styles.devItem}>
              <Text style={styles.devName}>{dev.name}</Text>
              <Text style={styles.devRa}>RA: {dev.ra}</Text>
            </View>
          ))}
        </View>

      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4e1',
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffb6c1',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#008000', 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 128, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  devList: {
    marginTop: 10,
  },
  devItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  devName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff1493',
  },
  devRa: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ff1493',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
