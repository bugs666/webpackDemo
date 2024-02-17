// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

interface IBixiConfig {
    system_name_visible: boolean;
    system_name: string;
    copyright_visible: boolean;
    copyright: string;
    login_descriptions_visible: boolean;
    login_descriptions: string[];
    stylesheet: string;
    small_logo_visible: boolean;
    small_logo_dark_visible: boolean;
    large_logo_visible: boolean;
    large_logo_dark_visible: boolean;
    small_logo: string;
    small_logo_dark: string;
    large_logo: string;
    large_logo_dark: string;
    login_background_visible: boolean;
    login_background: string;
    oss_url: string;
    login_footer_link: {
        text: string;
        link: string;
    }[];
    app_version?: string;
}

interface IResponse<T> {
    resultCode: string;
    resultMsg: string;
    result: T;
}

interface IResponseList<T> {
    resultCode: string;
    resultMsg: string;
    result: {
        total: number;
        items: T[];
    };
}

interface IPagination {
    current: number;
    pageSize: number;
    total?: number;
}

interface IFilter {
    [prop: string]: string | number | string[] | number[];
}

interface IOption {
    label: string;
    value: string | number;
}

interface IBreadcrumbObject {
    link?: string;
    title: string;
}

type IBreadcrumb = string | IBreadcrumbObject;

// declare module 'classnames';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function safeNumber(str: any, defaultVal?: number): number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function safeParse(str: any, defaultVal?: object): Record<string, any>;
