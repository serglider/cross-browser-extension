import { browserAction, tabs } from 'webextension-polyfill';
import { HIGHLIGHT_EVENT } from './src/constants';

browserAction.onClicked.addListener((tab) => tabs.sendMessage(tab.id, HIGHLIGHT_EVENT));
