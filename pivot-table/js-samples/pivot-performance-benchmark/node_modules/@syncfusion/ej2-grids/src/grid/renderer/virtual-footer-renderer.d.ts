import { IRenderer, IGrid } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { FooterRenderer } from './footer-renderer';
import { VirtualElementHandler } from './virtual-content-renderer';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
/**
 * Provides virtual footer rendering with column virtualization.
 *
 * @hidden
 */
export declare class VirtualFooterRenderer extends FooterRenderer implements IRenderer {
    /** @hidden */
    virtualElement: VirtualElementHandler;
    /** @hidden */
    rowModelGenerator: VirtualRowModelGenerator;
    /**
     * Initializes the VirtualFooterRenderer with the parent grid and required services.
     *
     * @param {IGrid} parent - Parent grid module
     * @param {ServiceLocator} serviceLocator - Service locator for dependency injection
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator);
    /**
     * Creates the virtual footer panel structure.
     *
     * @returns {void}
     * @hidden
     */
    renderPanel(): void;
    /**
     * Create virtual footer table.
     *
     * @returns {void}
     * @hidden
     */
    renderTable(): void;
    /**
     * Refreshes the virtual footer when aggregate or column data changes.
     *
     * @param {Object} [e] - Aggregate data object
     * @param {Object} [e.aggregates] - Aggregate values used to render summary rows
     * @returns {void}
     * @hidden
     */
    refresh(e?: {
        aggregates?: Object;
    }): void;
    private updateColGroup;
    /**
     * Registers required event listeners for virtual footer rendering and updates
     *
     * @returns {void}
     */
    addEventListener(): void;
    /**
     * Removes all event listeners associated with the virtual footer renderer.
     *
     * @returns {void}
     */
    removeEventListener(): void;
}
