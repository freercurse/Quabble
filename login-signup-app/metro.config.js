const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs', 'js', 'ts', 'tsx', 'jsx');
module.exports = defaultConfig;