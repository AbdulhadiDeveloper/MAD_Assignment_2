import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  
  const [sound, setSound] = useState<Audio.Sound>();

  useEffect(() => {
    return sound
      ? () => { sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const playSound = () => {
    Audio.Sound.createAsync(
      require('../../assets/button_click.mp3') 
    )
      .then((response) => {
        setSound(response.sound);
        return response.sound.playAsync();
      })
      .catch((error) => {
        console.log('Sound playback failed', error);
      });
  };

  const handlePress = useCallback((value: string) => {
    playSound();

    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === '=') {
      calculateResult();
    } else {
      setExpression((prev) => prev + value);
    }
  }, [expression]);

  const calculateResult = () => {
    try {
      let evalString = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      const calculatedResult = new Function('return ' + evalString)();
      const finalResult = String(Math.round(calculatedResult * 100000000) / 100000000);
      setResult(finalResult);
    } catch (error) {
      setResult('Error');
    }
  };

  const basicButtons: string[][] = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['.', '0', 'DEL', '=']
  ];

  const advancedButtons: string[][] = [
    ['sin(', 'cos(', 'tan(', 'log('],
    ['√(', '^', 'π', 'e']
  ];

  return (
    // Outer wrapper centers the app on wide screens (Web)
    <View style={styles.webWrapper}>
      <SafeAreaView style={styles.container}>
        {/* Display Section */}
        <View style={styles.displayContainer}>
          <Text style={styles.expressionText}>{expression}</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>

        {/* Keypad Section */}
        <View style={styles.keypadContainer}>
          <View style={styles.advancedPad}>
            {advancedButtons.map((row, rowIndex) => (
              <View key={'adv-' + rowIndex} style={styles.row}>
                {row.map((btn) => (
                  <TouchableOpacity
                    key={btn}
                    style={styles.advancedButton}
                    onPress={() => handlePress(btn)}
                  >
                    <Text style={styles.advancedButtonText}>{btn}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.basicPad}>
            {basicButtons.map((row, rowIndex) => (
              <View key={'basic-' + rowIndex} style={styles.row}>
                {row.map((btn) => (
                  <TouchableOpacity
                    key={btn}
                    style={[
                      styles.button,
                      btn === '=' && styles.equalsButton,
                      ['÷', '×', '-', '+'].includes(btn) && styles.operatorButton
                    ]}
                    onPress={() => handlePress(btn)}
                  >
                    <Text style={[
                      styles.buttonText,
                      btn === '=' && styles.equalsButtonText,
                      ['C', 'DEL'].includes(btn) && styles.actionButtonText
                    ]}>{btn}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  // NEW: Wrapper specifically for desktop web browsers
  webWrapper: {
    flex: 1,
    backgroundColor: '#000', // Outer background
    alignItems: 'center', // Centers horizontally on wide screens
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Constrains width on desktop, doesn't affect mobile
    backgroundColor: '#121212',
    // Optional: add a border to make it look like a phone on web
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#333',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  expressionText: {
    fontSize: 24,
    color: '#888',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  keypadContainer: {
    flex: 2.5,
    padding: 10,
  },
  advancedPad: {
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 5,
  },
  basicPad: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#2c2c2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  advancedButton: {
    width: '22%',
    paddingVertical: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  advancedButtonText: {
    color: '#aaa',
    fontSize: 16,
  },
  buttonText: {
    fontSize: 28,
    color: '#fff',
  },
  operatorButton: {
    backgroundColor: '#3a3a3a',
  },
  actionButtonText: {
    color: '#ff4d4d',
  },
  equalsButton: {
    backgroundColor: '#4db8ff',
  },
  equalsButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});