import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Menu, TextInput } from 'react-native-paper';

// seletor de opções para os formulários
interface Props {
  label?: string;
  value: string;
  options: readonly string[];
  onSelect: (value: any) => void;
}

// componente para selecionar opções em um formulário, usando um menu suspenso
export function FormSelector({ label, value, options, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  return (


    <View style={{ marginBottom: 15 }}>

      {/* Pressable para abrir o menu suspenso */}
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Pressable onPress={() => setVisible(true)}> 
            <View pointerEvents="none"> 
              <TextInput
                label={label}
                value={value}
                mode="outlined"
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>
          </Pressable>
        }
      >
        {/* Mapeia as opções para criar itens de menu */}
        {options.map((option) => (
          <Menu.Item
            key={option}
            onPress={() => { onSelect(option); setVisible(false); }}
            title={option}
          />
        ))}
      </Menu>
    </View>
  );
}