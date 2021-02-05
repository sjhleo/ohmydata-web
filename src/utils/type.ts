/**
 * 提供一些常用类型检测与反射相关的方法。
 * @static
 * @class
 * @version 1.0.0
 */
export class Type {
    private static readonly _metadatas = new Map<any, any>();

    /**
     * 私有构造方法，使类型成为静态类。
     * @private
     */
    private constructor() {}

    /**
     * 检测一个值是否为数组。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isArray(value: any): boolean {
        return this.getTypeString(value) === "array";
    }

    /**
     * 检测一个值是否为对象。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isObject(value: any): boolean {
        return this.getTypeString(value) === "object";
    }

    /**
     * 检测一个值是否为字符串。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isString(value: any): boolean {
        return typeof value === "string";
    }

    /**
     * 检测一个值是否为日期。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isDate(value: any): boolean {
        return this.getTypeString(value) === "date";
    }

    /**
     * 检测一个值是否为正则表达式。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isRegExp(value: any): boolean {
        return this.getTypeString(value) === "regexp";
    }

    /**
     * 检测一个值是否为函数。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isFunction(value: any): boolean {
        return typeof value === "function";
    }

    /**
     * 检测一个值是否为布尔值。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isBoolean(value: any): boolean {
        return typeof value === "boolean";
    }

    /**
     * 检测一个值是否为数值。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isNumber(value: any): boolean {
        return typeof value === "number";
    }

    /**
     * 检测一个值是否为 null。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isNull(value: any): boolean {
        return value === null;
    }

    /**
     * 检测一个值是否为 undefined。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isUndefined(value: any): boolean {
        return typeof value === "undefined";
    }

    /**
     * 检测一个值是否为 null 或 undefined。
     * @static
     * @param  {any} value
     * @returns boolean
     */
    public static isEmptyObject(value: any): boolean {
        return Type.isNull(value) || Type.isUndefined(value);
    }

    /**
     * 表示一个字符串值是否为 null 或 undefined 或 空值。
     * @static
     * @param  {string} value 要检测的字符串实例。
     * @returns boolean
     */
    public static isEmptyString(value: string): boolean {
        return Type.isEmptyObject(value) || value.trim() === "";
    }

    /**
     * 设置指定类型的元数据。
     * @param  {any} type 目标类型。
     * @param  {any} metadata 元数据。
     * @returns void
     */
    public static setMetadata(type: any, metadata: any): void {
        if (!type || !metadata) {
            throw new Error();
        }

        this._metadatas.set(type, metadata);
    }

    /**
     * 获取指定类型的元数据。
     * @param  {any} type 目标类型。
     * @returns any 元数据。
     */
    public static getMetadata(type: any): any {
        return this._metadatas.get(type) || null;
    }

    /**
     * 返回对象的类型(即构造函数)。
     * @param  {string|any} value 实例或类型路径。
     * @returns Function 如果成功解析则返回类型的构造函数，否则为 undefined。
     */
    public static getClassType(
        value: string | any
    ): Function | null | undefined {
        if (Type.isNull(value)) {
            return null;
        } else if (Type.isUndefined(value)) {
            return undefined;
        } else if (Type.isBoolean(value)) {
            return Boolean;
        } else if (Type.isNumber(value)) {
            return Number;
        } else if (Type.isString(value)) {
            try {
                // 通过 eval 解析字符串所指向的实际类型
                // tslint:disable-next-line:no-eval
                let ctor = eval(value);

                return Type.isFunction(ctor) ? ctor : String;
            } catch (e) {
                return String;
            }
        } else {
            let prototype = value.prototype
                ? value.prototype
                : Object.getPrototypeOf(value);

            return prototype.constructor;
        }
    }

    /**
     * 返回 value 参数指定的对象的类名。
     * @param  {any} value 需要取得类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number)和类对象。
     * @returns string 类名称的字符串。
     */
    public static getClassName(value: any): string {
        let className = this.getQualifiedClassName(value).split(".");

        return className[className.length - 1];
    }

    /**
     * 返回 value 参数指定的对象的完全限定类名。
     * @static
     * @param  {any} value 需要取得完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number)和类对象。
     * @returns string 包含完全限定类名称的字符串。
     */
    public static getQualifiedClassName(value: any): string {
        let type = typeof value;

        if (!value || (type !== "object" && !value.prototype)) {
            return type;
        }

        let prototype: any = value.prototype
            ? value.prototype
            : Object.getPrototypeOf(value);

        if (prototype.hasOwnProperty("__class__")) {
            // tslint:disable-next-line:no-string-literal
            return prototype["__class__"];
        }

        let constructorString: string = prototype.constructor.toString().trim();
        let index: number = constructorString.indexOf("(");
        // tslint:disable-next-line:no-magic-numbers
        let className: string = constructorString.substring(9, index);

        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });

        return className;
    }

    /**
     * 返回 value 参数指定的对象的基类的类名。
     * @param  {any} value 需要取得父类类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number）和类对象。
     * @returns string 基类名称，或 null（如果不存在基类名称）。
     */
    public static getSuperclassName(value: any): string {
        let className = this.getQualifiedSuperclassName(value).split(".");

        return className[className.length - 1];
    }

    /**
     * 返回 value 参数指定的对象的基类的完全限定类名。
     * @param  {any} value 需要取得父类完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number）和类对象。
     * @returns string 完全限定的基类名称，或 null（如果不存在基类名称）。
     */
    public static getQualifiedSuperclassName(value: any): string {
        if (!value || (typeof value !== "object" && !value.prototype)) {
            return "";
        }

        let prototype: any = value.prototype
            ? value.prototype
            : Object.getPrototypeOf(value);
        let superProto = Object.getPrototypeOf(prototype);

        if (!superProto) {
            return "";
        }

        let superClass = this.getQualifiedClassName(superProto.constructor);

        if (!superClass) {
            return "";
        }

        return superClass;
    }

    /**
     * 确定指定类型的实例是否可以分配给当前类型的实例。
     * @param  {Function} parentType 指定基类的类型。
     * @param  {Function} subType 指定的实例类型。
     * @returns boolean
     */
    public static isAssignableFrom(
        parentType: Function | String,
        subType: Function
    ): boolean {
        // 两个参数任意却少一个都不会进行比较
        if (!parentType || !subType) {
            return false;
        }

        // 如果基类等于子类，则直接返回 true
        if (parentType === subType) {
            return true;
        }

        // 如果基类是 Object 则直接返回 true
        if (parentType === Object || parentType === "Object") {
            return true;
        }

        // 获取子类的原型实例
        let subPrototype = subType.prototype;

        // 1.首先，如果原型中有定义"__types__"则直接根据类型名称查找
        // 注意: "__types__" 这个属性是由 TypeScript 引擎在生成代码时加入的
        if (subPrototype.hasOwnProperty("__types__")) {
            // 如果参数 parentType 不是字符串则获取基类的完全限定名称(包含命名空间)
            let parentName = Type.isString(parentType)
                ? parentType
                : Type.getQualifiedClassName(parentType);

            // 通过"__types__"去匹配基类名称
            return subPrototype["__types__"].indexOf(parentName) !== -1;
        }

        // 2.其次，如果类型没有定义"__types__"，则根据原型链进行查找
        // 获取子类的直属父类型(即上一级父类)
        let superType = Object.getPrototypeOf(subPrototype).constructor;

        // 如果已经查到顶层还没匹配到，则直接返回 false
        if (superType === Object) {
            return false;
        }

        if (Type.isString(parentType)) {
            // 如果传进来的基类是字符串，则根据上级父类的名称进行匹配
            if (Type.getQualifiedClassName(superType) === parentType) {
                return true;
            }
        } else {
            // 否则根据传递进来的基类与直属父类进行匹配
            if (superType === parentType) {
                return true;
            }
        }

        // 3.最后，如果当前层没匹配到，则通过递归原型向上一级一级查找
        return Type.isAssignableFrom(parentType, superType);
    }

    /**
     * 获取指定值的类型字符串(小写)。
     * @private
     * @static
     * @param  {any} value
     * @returns string
     */
    private static getTypeString(value: any): string {
        return Object.prototype.toString
            .call(value)
            .slice(8, -1)
            .toLowerCase();
    }
}
