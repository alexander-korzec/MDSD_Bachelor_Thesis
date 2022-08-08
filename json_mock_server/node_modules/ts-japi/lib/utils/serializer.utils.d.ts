import Relator from '../classes/relator';
import { SerializerOptions } from '../interfaces/serializer.interface';
import { Dictionary } from '../types/global.types';
export declare function recurseRelators(data: any[], relators: Record<string, Relator<any>>, depth: number, keys: string[], relatorDataCache?: Map<Relator<any>, Dictionary<any>[]>): Promise<any[]>;
export declare function normalizeRelators<T>(relators: SerializerOptions<T>['relators']): Record<string, Relator<T, any>> | undefined;
export declare class Helpers<PrimaryType> {
    projectAttributes: (data: PrimaryType) => Partial<PrimaryType> | undefined;
    relators: Record<string, Relator<PrimaryType, any>> | undefined;
    constructor(options: SerializerOptions<PrimaryType>);
}
//# sourceMappingURL=serializer.utils.d.ts.map