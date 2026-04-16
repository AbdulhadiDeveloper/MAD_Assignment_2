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
    <View style={styles.webWrapper}>
      <SafeAreaView style={styles.container}>
        {/* Display Section */}
        <View style={styles.displayContainer}>
          <Text style={styles.expressionText} numberOfLines={1} adjustsFontSizeToFit>
            {expression}
          </Text>
          <Text style={styles.resultText} numberOfLines={1} adjustsFontSizeToFit>
            {result || '0'}
          </Text>
        </View>

        {/* Keypad Section */}
        <View style={styles.keypadContainer}>
          {/* Advanced Operations Pad */}
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

          {/* Basic Operations Pad */}
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
                      ['C', 'DEL'].includes(btn) && styles.actionButtonText,
                      ['÷', '×', '-', '+'].includes(btn) && styles.operatorButtonText
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

// --- FULLY RESPONSIVE LIGHT THEME ---
const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Lighter grey for outer web background
    alignItems: 'center', 
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 420, 
    backgroundColor: '#F9FAFB', 
    ...(Platform.OS === 'web' && {
      maxHeight: 850, // Prevents it from getting absurdly tall on large monitors
      borderRadius: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.15,
      shadowRadius: 30,
      overflow: 'hidden',
    }),
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 30,
    backgroundColor: '#F9FAFB',
  },
  expressionText: {
    fontSize: 28,
    color: '#9CA3AF',
    marginBottom: 5,
    fontWeight: '400',
  },
  resultText: {
    fontSize: 64,
    color: '#111827',
    fontWeight: '300',
  },
  keypadContainer: {
    flex: 2.5, // Gives more relative space to the keypad vs display
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 10,
  },
  advancedPad: {
    flex: 1.2, // Proportional height
    marginBottom: 10,
  },
  basicPad: {
    flex: 3, // Basic pad gets more height than the advanced pad
  },
  row: {
    flex: 1, // Forces rows to equally share the vertical space
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1, // Forces buttons to share the horizontal space evenly
    marginHorizontal: 5, // Replaces fixed widths to allow fluid scaling
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000, // Extremely high number forces pill/circle shape
  },
  advancedButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  advancedButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    fontSize: 26,
    color: '#374151',
    fontWeight: '500',
  },
  operatorButton: {
    backgroundColor: '#EEF2FF',
  },
  operatorButtonText: {
    color: '#4F46E5',
    fontSize: 32,
  },
  actionButtonText: {
    color: '#F43F5E',
    fontWeight: '600',
  },
  equalsButton: {
    backgroundColor: '#4F46E5',
  },
  equalsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 34,
  },
});