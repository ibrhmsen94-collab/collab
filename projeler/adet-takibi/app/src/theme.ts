import { useColorScheme } from 'react-native';

const light = {
  bg: '#FBF7F5', card: '#FFFFFF', text: '#2A2024', muted: '#7A6C72', border: '#EADFE0',
  primary: '#C2415B', onPrimary: '#FFFFFF', primarySoft: '#FBE4E8',
  period: '#D6455F', predicted: '#F7CDD5', fertile: '#CFEDEA', ovulation: '#1F8A83', onOvulation: '#FFFFFF',
  spotting: '#E9A9B4', warnBg: '#FFF4DD', warnText: '#6B4A00', danger: '#B3261E',
};
const dark: typeof light = {
  bg: '#171215', card: '#231B1F', text: '#F3EAEC', muted: '#B3A4AA', border: '#3A2E33',
  primary: '#F08BA0', onPrimary: '#2A0F17', primarySoft: '#40222B',
  period: '#E0647B', predicted: '#5A2E38', fertile: '#1F4441', ovulation: '#5CC9C1', onOvulation: '#0B2826',
  spotting: '#8E5560', warnBg: '#3D3115', warnText: '#FFE2A0', danger: '#FFB4AB',
};

export type Colors = typeof light;
export const useColors = (): Colors => (useColorScheme() === 'dark' ? dark : light);
