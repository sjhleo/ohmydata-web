import { ObjectFactory } from "@/utils/object-factory";

export default function autowired(serviceType: Function) {
    return function(target: any, name: any) {
        // 这里不使用serviceType.name即service类名做key的原因是因为打包生产代码过后，serviceType变成了一个匿名的函数，
        // 如果还用name做key，则生产环境的map中只有一个元素，key为e,因为所有注入的serviceType都是e
        let serviceInstanceName = serviceType;
        if (!ObjectFactory.has(serviceInstanceName)) {
            ObjectFactory.set(
                serviceInstanceName,
                ObjectFactory.create(serviceType)
            );
        }
        Object.defineProperty(target, name, {
            get: function() {
                return ObjectFactory.get(serviceInstanceName);
            }
        });
    };
}
