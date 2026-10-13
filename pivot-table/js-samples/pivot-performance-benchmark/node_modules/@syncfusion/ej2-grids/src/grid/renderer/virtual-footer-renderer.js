var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { refreshVirtualBlock, colGroupRefresh, columnWidthChanged, columnVisibilityChanged, refreshFooterRenderer } from '../base/constant';
import { FooterRenderer } from './footer-renderer';
import { VirtualElementHandler } from './virtual-content-renderer';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
import { addRemoveEventListener } from '../base/util';
/**
 * Provides virtual footer rendering with column virtualization.
 *
 * @hidden
 */
var VirtualFooterRenderer = /** @class */ (function (_super) {
    __extends(VirtualFooterRenderer, _super);
    /**
     * Initializes the VirtualFooterRenderer with the parent grid and required services.
     *
     * @param {IGrid} parent - Parent grid module
     * @param {ServiceLocator} serviceLocator - Service locator for dependency injection
     */
    function VirtualFooterRenderer(parent, serviceLocator) {
        var _this = _super.call(this, parent, serviceLocator) || this;
        /** @hidden */
        _this.virtualElement = new VirtualElementHandler();
        _this.rowModelGenerator = new VirtualRowModelGenerator(_this.parent);
        _this.parent.on(refreshVirtualBlock, function (e) { return e.virtualInfo.sentinelInfo.axis === 'X' ? _this.refresh() : null; }, _this);
        return _this;
    }
    /**
     * Creates the virtual footer panel structure.
     *
     * @returns {void}
     * @hidden
     */
    VirtualFooterRenderer.prototype.renderPanel = function () {
        _super.prototype.renderPanel.call(this);
    };
    /**
     * Create virtual footer table.
     *
     * @returns {void}
     * @hidden
     */
    VirtualFooterRenderer.prototype.renderTable = function () {
        this.rowModelGenerator.refreshColOffsets();
        var contentElement = this.getPanel().querySelector('.e-summarycontent');
        if (contentElement) {
            this.parent.setColumnIndexesInView(this.rowModelGenerator.getColumnIndexes(contentElement));
            _super.prototype.renderTable.call(this);
            var footerTable = this.getTable();
            this.virtualElement.table = footerTable;
            this.virtualElement.content = contentElement;
            this.virtualElement.content.style.position = 'relative';
            this.virtualElement.renderWrapper();
            this.virtualElement.renderPlaceHolder('absolute');
        }
    };
    /**
     * Refreshes the virtual footer when aggregate or column data changes.
     *
     * @param {Object} [e] - Aggregate data object
     * @param {Object} [e.aggregates] - Aggregate values used to render summary rows
     * @returns {void}
     * @hidden
     */
    VirtualFooterRenderer.prototype.refresh = function (e) {
        this.rowModelGenerator.refreshColOffsets();
        var contentElement = this.getPanel().querySelector('.e-summarycontent');
        if (contentElement) {
            this.parent.setColumnIndexesInView(this.rowModelGenerator.getColumnIndexes(contentElement));
            _super.prototype.refresh.call(this, e);
        }
    };
    VirtualFooterRenderer.prototype.updateColGroup = function () {
        if (this.getColGroup()) {
            var colGroup = this.getHeaderColGroup();
            this.getTable().replaceChild(colGroup, this.getColGroup());
            this.setColGroup(colGroup);
        }
    };
    /**
     * Registers required event listeners for virtual footer rendering and updates
     *
     * @returns {void}
     */
    VirtualFooterRenderer.prototype.addEventListener = function () {
        this.evtHandlers = [
            { event: columnWidthChanged, handler: _super.prototype.onWidthChange },
            { event: columnVisibilityChanged, handler: _super.prototype.columnVisibilityChanged },
            { event: refreshFooterRenderer, handler: _super.prototype.refreshFooterRenderer },
            { event: colGroupRefresh, handler: this.updateColGroup }
        ];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    };
    /**
     * Removes all event listeners associated with the virtual footer renderer.
     *
     * @returns {void}
     */
    VirtualFooterRenderer.prototype.removeEventListener = function () {
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    };
    return VirtualFooterRenderer;
}(FooterRenderer));
export { VirtualFooterRenderer };
