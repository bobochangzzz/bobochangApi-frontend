import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  // 拂晓蓝
  colorPrimary: '#FA541C',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  splitMenus: false,
  title: 'API接口平台',
  pwa: false,
  logo: 'https://bobocahng-1309945187.cos.ap-guangzhou.myqcloud.com/logo.svg',
  iconfontUrl: '',
};

export default Settings;
