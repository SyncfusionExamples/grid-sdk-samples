import { initialLoad, destroy } from '../base/constant';
import { RenderType } from '../base/enum';
import { DomVirtualContentRenderer } from '../renderer/dom-virtual-content-renderer';
/**
 * @hidden
 */
var DomVirtualization = /** @class */ (function () {
    function DomVirtualization(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }
    DomVirtualization.prototype.getModuleName = function () {
        return 'domVirtualization';
    };
    DomVirtualization.prototype.instantiateRenderer = function () {
        var renderer = this.locator.getService('rendererFactory');
        renderer.addRenderer(RenderType.Content, new DomVirtualContentRenderer(this.parent, this.locator));
    };
    DomVirtualization.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initialLoad, this.instantiateRenderer, this);
        this.parent.on(destroy, this.destroy, this);
    };
    DomVirtualization.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initialLoad, this.instantiateRenderer);
        this.parent.off(destroy, this.destroy);
    };
    DomVirtualization.prototype.destroy = function () {
        this.removeEventListener();
        if (this.parent.contentModule && this.parent.contentModule.destroy) {
            this.parent.contentModule.destroy();
        }
    };
    return DomVirtualization;
}());
export { DomVirtualization };
