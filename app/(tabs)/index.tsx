import React, { useCallback, useState } from 'react';
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

  const handlePress = useCallback((value: string) => {
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
      
      if (!isFinite(calculatedResult) || isNaN(calculatedResult)) {
         setResult('ERR_COMPUTATION');
         return;
      }

      const finalResult = String(Math.round(calculatedResult * 100000000) / 100000000);
      setResult(finalResult);
    } catch (error) {
      setResult('SYNTAX_ERR');
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
        {/* Hacker Display Section */}
        <View style={styles.displayContainer}>
          <Text style={styles.terminalHeader}>TERMINAL // CALC_NODE_V3.1</Text>
          <View style={styles.screenInner}>
            <Text style={styles.expressionText} numberOfLines={2} adjustsFontSizeToFit>
              {expression ? `> ${expression}` : '> _'}
            </Text>
            <Text style={styles.resultText} numberOfLines={1} adjustsFontSizeToFit>
              {result ? `[ ${result} ]` : ''}
            </Text>
          </View>
        </View>

        {/* Cyberpunk Keypad Section */}
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
                      ['÷', '×', '-', '+'].includes(btn) && styles.operatorButton,
                      ['C', 'DEL'].includes(btn) && styles.actionButton
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

// --- CYBERPUNK / TERMINAL STYLESHEET ---
const FONT_FAMILY = Platform.OS === 'ios' ? 'Courier' : 'monospace';

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#050505', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 420, 
    backgroundColor: '#09090B', 
    ...(Platform.OS === 'web' && {
      maxHeight: 850,
      borderWidth: 2,
      borderColor: '#39FF14', // Neon green border for web
    }),
  },
  displayContainer: {
    flex: 1.2,
    padding: 15,
    backgroundColor: '#09090B',
  },
  terminalHeader: {
    color: '#39FF14',
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    marginBottom: 10,
    opacity: 0.7,
  },
  screenInner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: '#030303', // Slightly darker for the "screen"
    borderWidth: 1,
    borderColor: '#39FF14',
    borderStyle: 'dashed', // Dashed border for retro feel
  },
  expressionText: {
    fontSize: 24,
    color: '#00FFFF', // Cyan for input
    fontFamily: FONT_FAMILY,
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
  resultText: {
    fontSize: 48,
    color: '#39FF14', // Neon green for output
    fontFamily: FONT_FAMILY,
    textAlign: 'right',
    fontWeight: 'bold',
    width: '100%',
  },
  keypadContainer: {
    flex: 2.5, 
    padding: 15,
    backgroundColor: '#09090B',
  },
  advancedPad: {
    flex: 1.2,
    marginBottom: 15,
  },
  basicPad: {
    flex: 3, 
  },
  row: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1, 
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#444', // Dark grey default border
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2, // Sharp corners
  },
  advancedButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  advancedButtonText: {
    color: '#888',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
  },
  buttonText: {
    fontSize: 28,
    color: '#E0E0E0',
    fontFamily: FONT_FAMILY,
  },
  actionButton: {
    borderColor: '#FF003C', // Cyberpunk Red
    backgroundColor: 'rgba(255, 0, 60, 0.05)', // Faint red tint
  },
  actionButtonText: {
    color: '#FF003C', 
  },
  operatorButton: {
    borderColor: '#FF00FF', // Magenta
    backgroundColor: 'rgba(255, 0, 255, 0.05)',
  },
  operatorButtonText: {
    color: '#FF00FF', 
    fontSize: 32,
  },
  equalsButton: {
    backgroundColor: '#39FF14', // Solid Neon Green
    borderColor: '#39FF14',
  },
  equalsButtonText: {
    color: '#000000', // Black text to pop against the green
    fontWeight: 'bold',
    fontSize: 34,
  },
});