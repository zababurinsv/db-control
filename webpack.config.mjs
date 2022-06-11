import { merge } from "webpack-merge";
import common from "./webpack/common.mjs";
import commonRules from "./webpack/commonRules.mjs";
import styles from "./webpack/styles.mjs";
import commonPlugins from "./webpack/commonPlugins.mjs";
import globalParams from './webpack/globalParams.mjs';
import alias from './webpack/alias.mjs'
import optimization  from './webpack/optimization.mjs'
import devServer from "./webpack/devServer.mjs";
import hotReload from './webpack/hotReload.mjs'

export default function(env, options) {
  const isProduction = options.mode === 'production';
  const isDevelopment = options.mode === 'development';
  console.log({
    type: 'main',
    isProduction: isProduction,
    isDevelopment: isDevelopment
  })
  if (isProduction) {
    return merge([
      common(isProduction), // Общие настройки
      commonRules(isDevelopment), // Общие правила обработки импортов
      styles(), // Правила обработки стилей
      commonPlugins(isDevelopment), // Общие плагины
      globalParams(isDevelopment), // Глобальные переменные
      alias(), // Алиасы
      optimization(), // Настройки оптимизации и разбивки на чанки
      devServer(), // Сервер для разработки
      hotReload(), // Горячая перезагрузка
    ]);
  }
  if (isDevelopment) {
    return merge([
      // common(isProduction), // Общие настройки
      // commonRules(isDevelopment), // Общие правила обработки импортов
      // commonPlugins(isDevelopment), // Общие плагины
      // styles(), // Правила обработки стилей
      // globalParams(isProduction), // Глобальные переменные
      // alias(), // Алиасы
      // devServer(), // Сервер для разработки
      // hotReload(), // Горячая перезагрузка
      // version()
    ]);
  }
};
