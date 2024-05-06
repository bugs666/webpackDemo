type ISafeAny = any;

declare module '*.svg' {
    const content: ISafeAny;
    export = content;
}

declare module '*.module.less' {
    const resource: { [key: string]: string };
    export = resource;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

interface Window {
    _STORES: ISafeAny;
    _BUILD_INFO: ISafeAny;
}
