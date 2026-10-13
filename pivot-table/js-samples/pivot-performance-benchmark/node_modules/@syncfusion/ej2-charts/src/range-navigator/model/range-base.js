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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable valid-jsdoc */
import { ChildProperty, Property, Complex } from '@syncfusion/ej2-base';
import { Border, Animation, Font } from '../../common/model/base';
import { Rect } from '@syncfusion/ej2-svg-base';
/**
 * Series class for the range navigator
 */
var RangeNavigatorSeries = /** @class */ (function (_super) {
    __extends(RangeNavigatorSeries, _super);
    function RangeNavigatorSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.clipRect = new Rect(0, 0, 0, 0);
        /** @private */
        _this.name = 'Series';
        /** @private */
        _this.category = 'Series';
        /** @private */
        _this.seriesType = 'XY';
        /** @private */
        _this.removedPointIndex = null;
        /** @private */
        _this.cornerRadius = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
        /** @private */
        _this.columnFacet = 'Rectangle';
        /** @private */
        _this.accessibility = { accessibilityDescriptionFormat: null };
        return _this;
    }
    /**
     * Sets the point color based on fill property.
     * This method is required for Chart series compatibility when rendering column series in Range Navigator.
     *
     * @param _point - Unused point argument passed by the chart rendering flow.
     * @param {string} color - The default color.
     * @returns {string} - The color to apply to the point.
     * @private
     */
    RangeNavigatorSeries.prototype.setPointColor = function (_point, color) {
        // For Range Navigator, use point interior if available, otherwise use the provided color
        return this.fill || color;
    };
    /**
     * Sets the border color of a data point.
     * This method is required for Chart series compatibility when rendering column series in Range Navigator.
     *
     *  @param _point - Unused point argument passed by the chart rendering flow.
     * @param {BorderModel} border - The border model.
     * @returns {BorderModel} - The updated border model.
     * @private
     */
    RangeNavigatorSeries.prototype.setBorderColor = function (_point, border) {
        // For Range Navigator, use the series border color
        return border;
    };
    /**
     * Formats the accessibility description for a data point.
     * This method is required for Chart series compatibility when rendering column series in Range Navigator.
     *
     * @param {DataPoint} point - The data point.
     * @param {any} series - The series object.
     * @returns {string} - The formatted accessibility description.
     * @private
     */
    RangeNavigatorSeries.prototype.formatAccessibilityDescription = function (point) {
        // For Range Navigator, return a simple accessibility description
        return point.x + ": " + point.yValue + ", " + this.name;
    };
    __decorate([
        Property(null)
    ], RangeNavigatorSeries.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], RangeNavigatorSeries.prototype, "xName", void 0);
    __decorate([
        Property(null)
    ], RangeNavigatorSeries.prototype, "yName", void 0);
    __decorate([
        Property()
    ], RangeNavigatorSeries.prototype, "query", void 0);
    __decorate([
        Property('Line')
    ], RangeNavigatorSeries.prototype, "type", void 0);
    __decorate([
        Complex({ enable: false }, Animation)
    ], RangeNavigatorSeries.prototype, "animation", void 0);
    __decorate([
        Complex({ color: 'transparent', width: 2 }, Border)
    ], RangeNavigatorSeries.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], RangeNavigatorSeries.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], RangeNavigatorSeries.prototype, "width", void 0);
    __decorate([
        Property(1)
    ], RangeNavigatorSeries.prototype, "opacity", void 0);
    __decorate([
        Property('0')
    ], RangeNavigatorSeries.prototype, "dashArray", void 0);
    return RangeNavigatorSeries;
}(ChildProperty));
export { RangeNavigatorSeries };
/**
 * Thumb settings
 */
var ThumbSettings = /** @class */ (function (_super) {
    __extends(ThumbSettings, _super);
    function ThumbSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], ThumbSettings.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], ThumbSettings.prototype, "height", void 0);
    __decorate([
        Complex({ width: 1, color: null }, Border)
    ], ThumbSettings.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], ThumbSettings.prototype, "fill", void 0);
    __decorate([
        Property('Circle')
    ], ThumbSettings.prototype, "type", void 0);
    return ThumbSettings;
}(ChildProperty));
export { ThumbSettings };
/**
 * Style settings
 */
var StyleSettings = /** @class */ (function (_super) {
    __extends(StyleSettings, _super);
    function StyleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Complex({}, ThumbSettings)
    ], StyleSettings.prototype, "thumb", void 0);
    __decorate([
        Property(null)
    ], StyleSettings.prototype, "selectedRegionColor", void 0);
    __decorate([
        Property(null)
    ], StyleSettings.prototype, "unselectedRegionColor", void 0);
    return StyleSettings;
}(ChildProperty));
export { StyleSettings };
/*
 * Configures the ToolTips in the chart.
 */
var RangeTooltipSettings = /** @class */ (function (_super) {
    __extends(RangeTooltipSettings, _super);
    function RangeTooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], RangeTooltipSettings.prototype, "enable", void 0);
    __decorate([
        Property(null)
    ], RangeTooltipSettings.prototype, "opacity", void 0);
    __decorate([
        Property(null)
    ], RangeTooltipSettings.prototype, "fill", void 0);
    __decorate([
        Property(null)
    ], RangeTooltipSettings.prototype, "format", void 0);
    __decorate([
        Complex({ fontFamily: null, size: '12px', fontStyle: 'Normal', fontWeight: null, color: null }, Font)
    ], RangeTooltipSettings.prototype, "textStyle", void 0);
    __decorate([
        Property(null)
    ], RangeTooltipSettings.prototype, "template", void 0);
    __decorate([
        Complex({ color: null, width: null }, Border)
    ], RangeTooltipSettings.prototype, "border", void 0);
    __decorate([
        Property('OnDemand')
    ], RangeTooltipSettings.prototype, "displayMode", void 0);
    return RangeTooltipSettings;
}(ChildProperty));
export { RangeTooltipSettings };
