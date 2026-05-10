import React from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

interface NormalizaImagemProps extends Omit<ImageProps, 'source'> {
  base64?: string | null;
}

export const NormalizaImagem = ({ base64, style, ...props }: NormalizaImagemProps) => {
  if (!base64) return null;

  const getSource = (value: string): ImageSourcePropType => {
    let cleanBase64 = value.trim();

    if (cleanBase64.includes('base64,')) {
      const parts = cleanBase64.split('base64,');
      cleanBase64 = parts[parts.length - 1];
    }

    return { uri: `data:image/jpeg;base64,${cleanBase64}` };
  };

  return (
    <Image 
      source={getSource(base64)} 
      style={style} 
      {...props} 
    />
  );
};