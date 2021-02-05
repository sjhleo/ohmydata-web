import BaseService from "@/services/base-service";
import { ObjectFactory } from "@/utils/object-factory";

/**
 *
 * 使用service 避免await async 都需要try catch进行处理
 */
export default function service(option?: {
    title?: string;
    dataName?: string;
}) {
    return function(target: any, name: any) {
        let method: Function = target[name];
        // let serviceName = target.constructor.name;
        // 这里改变是因为autowired中使用service示例本身作为key了 而不是使用service的类名
        let serviceName = target.constructor;
        let service: any = ObjectFactory.has(serviceName)
            ? ObjectFactory.get(serviceName)
            : ObjectFactory.create(target.constructor);
        Object.defineProperty(service, name, {
            get: function() {
                return ResponseHandler.handler(service, method, option);
            }
        });

        ObjectFactory.set(serviceName, service);
    };
}
class ResponseHandler {
    public static handler(
        service: BaseService,
        method: Function,
        option?: {
            title?: string;
            dataName?: string;
        }
    ) {
        return async (...arg: Array<any>) => {
            let { title = "", dataName = "" } = option as any;
            try {
                let result = await method.call(service, ...arg);
                let msg: string;
                if (!result.success) {
                    msg = title ? `${title}出错!` : "请求服务失败";
                    console.error(msg);
                    return result;
                }
                let data = (dataName ? result[dataName] : result) || "";
                return data;
            } catch (error) {
                let msg = title ? `${title}出错!` : "请求服务失败";
                console.error(msg, error);
            }
        };
    }
}
