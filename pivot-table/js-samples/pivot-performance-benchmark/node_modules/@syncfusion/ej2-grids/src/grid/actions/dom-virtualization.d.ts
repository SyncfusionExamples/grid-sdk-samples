import { IGrid, IAction } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
/**
 * @hidden
 */
export declare class DomVirtualization implements IAction {
    private parent;
    private locator;
    constructor(parent: IGrid, locator?: ServiceLocator);
    getModuleName(): string;
    private instantiateRenderer;
    addEventListener(): void;
    removeEventListener(): void;
    destroy(): void;
}
