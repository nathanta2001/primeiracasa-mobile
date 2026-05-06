import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Menu, TextInput } from 'react-native-paper';

interface Props {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: any) => void;
}

export function FormSelector({ label, value, options, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TextInput
            label={label}
            value={value}
            mode="outlined"
            editable={false} // O usuário não digita, apenas clica
            right={<TextInput.Icon icon="chevron-down" onPress={() => setVisible(true)} />}
            onPressIn={() => setVisible(true)}
          />
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}
            title={option}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 }
});