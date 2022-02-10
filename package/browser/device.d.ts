import UAParser from 'ua-parser-js';
declare const device: UAParser.IDevice, browser: UAParser.IBrowser, engine: UAParser.IEngine, os: UAParser.IOS;
declare let isLegacy: boolean;
declare let isRadius: boolean;
declare let isIOS: boolean;
declare let isAndroid: boolean;
declare let isPC: boolean;
declare let isTablet: boolean;
declare let isMobile: boolean;
declare let isBlink: boolean;
declare let isMacSafari: boolean;
declare let isIOSlegacy: boolean;
export { device, browser, engine, os, isLegacy, isRadius, isIOS, isAndroid, isPC, isTablet, isMobile, isBlink, isMacSafari, isIOSlegacy };