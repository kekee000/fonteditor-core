/**
 * @file ajax获取文本数据
 * @author mengke01(kekee000@gmail.com)
 */

interface AjaxOptions {
    url: string;
    type?: string;
    method?: string;
    params?: Record<string, any>;
    onSuccess?: (data: any) => void;
    onError?: (xhr: XMLHttpRequest, status?: number) => void;
}


/**
 * ajax获取数据
 */
export default function ajaxFile(options: AjaxOptions): void {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const status = xhr.status;
            if (status >= 200 && status < 300 || status === 304) {
                if (options.onSuccess) {
                    if (options.type === 'binary') {
                        const buffer = (xhr as any).responseBlob || xhr.response;
                        options.onSuccess(buffer);
                    }
                    else if (options.type === 'xml') {
                        options.onSuccess(xhr.responseXML);
                    }
                    else if (options.type === 'json') {
                        options.onSuccess(JSON.parse(xhr.responseText));
                    }
                    else {
                        options.onSuccess(xhr.responseText);
                    }
                }

            }
            else if (options.onError) {
                options.onError(xhr, xhr.status);
            }
        }
    };

    const method = (options.method || 'GET').toUpperCase();
    let params: string | null = null;
    if (options.params) {

        const arr: string[] = [];
        Object.keys(options.params).forEach(key => {
            arr.push(key + '=' + encodeURIComponent((options.params as any)[key]));
        });
        const str = arr.join('&');
        if (method === 'GET') {
            options.url += (options.url.indexOf('?') === -1 ? '?' : '&') + str;
        }
        else {
            params = str;
        }
    }

    xhr.open(method, options.url, true);

    if (options.type === 'binary') {
        xhr.responseType = 'arraybuffer';
    }
    xhr.send(params);
}

export function loadFile(url: string, type: string = 'binary'): Promise<any> {
    return new Promise((resolve, reject) => {
        ajaxFile({
            type,
            url,
            onSuccess(buffer) {
                resolve(buffer);
            },
            onError(e) {
                reject(e);
            }
        });
    });
}
