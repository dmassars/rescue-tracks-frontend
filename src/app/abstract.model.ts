import * as _ from "lodash";

const NESTED_FIELD_REGEX = /^__(\w+)__$/;

export class AbstractModel {
    public id: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(params?: any) {
        params = (this as any).constructor.transform(params);
        Object.assign(this,
            _.omitBy(params, (value, key) => _.startsWith(key, "__"))
        );

        _.chain(params)
         .pickBy((value, key) => NESTED_FIELD_REGEX.test(key))
         .each((value, key) => {
             const lookup = `_${key.match(NESTED_FIELD_REGEX)[1]}`;
             if ((this as any).__lookupSetter__ && (this as any).__lookupSetter__(lookup)) {
                 this[lookup] = value;
             }
         }).value();
    }

    protected static transform(params: any) {
        return params;
    }

    protected addArray(key: string, klass: typeof AbstractModel, items: any[]) {
        this[key] = _.map(items, (i) => {
            if(!(i instanceof klass)) {
                return new klass(i)
            } else {
                return i;
            }
        });
    }

    protected add(key: string, klass: typeof AbstractModel, item: any) {
        if(!(item instanceof klass)) {
            this[key] = new klass(item)
        } else {
            this[key] = item;
        }
    }
}
