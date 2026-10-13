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
import { Property, NotifyPropertyChanges, Component, isBlazor, isRippleEnabled } from '@syncfusion/ej2-base';
import { addClass, Event, detach, removeClass } from '@syncfusion/ej2-base';
import { rippleEffect, EventHandler, Observer, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { getTextNode } from '../common/common';
/**
 * Defines the icon position of button.
 */
export var IconPosition;
(function (IconPosition) {
    /**
     * Positions the Icon at the left of the text content in the Button.
     */
    IconPosition["Left"] = "Left";
    /**
     * Positions the Icon at the right of the text content in the Button.
     */
    IconPosition["Right"] = "Right";
    /**
     * Positions the Icon at the top of the text content in the Button.
     */
    IconPosition["Top"] = "Top";
    /**
     * Positions the Icon at the bottom of the text content in the Button.
     */
    IconPosition["Bottom"] = "Bottom";
})(IconPosition || (IconPosition = {}));
export var buttonObserver = new Observer();
var cssClassName = {
    RTL: 'e-rtl',
    BUTTON: 'e-btn',
    PRIMARY: 'e-primary',
    ICONBTN: 'e-icon-btn'
};
/**
 * The Button is a graphical user interface element that triggers an event on its click action. It can contain a text, an image, or both.
 * ```html
 * <button id="button">Button</button>
 * ```
 * ```typescript
 * <script>
 * var btnObj = new Button();
 * btnObj.appendTo("#button");
 * </script>
 * ```
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    /**
     * Constructor for creating the widget
     *
     * @param  {ButtonModel} options - Specifies the button model
     * @param  {string|HTMLButtonElement} element - Specifies the target element
     */
    function Button(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.suppressToggleOnNextClick = false;
        return _this;
    }
    Button.prototype.preRender = function () {
        // Bind handler references once so EventHandler.remove can match them exactly.
        // Must be done here (not in constructor) because super() triggers render() → wireEvents()
        // before the constructor body after super() has a chance to run.
        this.repeatPointerDownHandler = this.startRepeat.bind(this);
        this.repeatPointerUpHandler = this.stopRepeat.bind(this);
        this.repeatPointerLeaveHandler = this.stopRepeat.bind(this);
        this.repeatPointerCancelHandler = this.stopRepeat.bind(this);
        this.repeatKeyDownHandler = this.onRepeatKeyDown.bind(this);
        this.repeatKeyUpHandler = this.stopRepeat.bind(this);
        this.repeatBlurHandler = this.stopRepeat.bind(this);
        this.btnClickHandler = this.onClickToggle.bind(this);
    };
    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    Button.prototype.render = function () {
        this.initialize();
        this.removeRippleEffect = rippleEffect(this.element, { selector: '.' + cssClassName.BUTTON });
        this.observeDomAttributeChanges();
        this.renderComplete();
    };
    Button.prototype.observeDomAttributeChanges = function () {
        var _this = this;
        this.mutationObserver = new MutationObserver(function (mutations) {
            var isDomDisabled = _this.element.hasAttribute('disabled');
            if (isDomDisabled !== _this.disabled) {
                _this.disabled = isDomDisabled;
            }
        });
        this.mutationObserver.observe(this.element, {
            attributes: true,
            attributeFilter: ['disabled'],
            subtree: false
        });
    };
    Button.prototype.initialize = function () {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        if (this.isPrimary) {
            this.element.classList.add(cssClassName.PRIMARY);
        }
        if (!isBlazor() || (isBlazor() && this.getModuleName() !== 'progress-btn')) {
            if (this.content) {
                var tempContent = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(this.content) : this.content;
                this.element.innerHTML = tempContent;
            }
            this.setIconCss();
        }
        if (this.enableRtl) {
            this.element.classList.add(cssClassName.RTL);
        }
        if (this.disabled) {
            this.controlStatus(this.disabled);
        }
        else {
            this.wireEvents();
        }
    };
    Button.prototype.controlStatus = function (disabled) {
        this.element.disabled = disabled;
        if (disabled) {
            this.element.classList.add('e-disabled');
        }
        else {
            this.element.classList.remove('e-disabled');
        }
    };
    Button.prototype.setIconCss = function () {
        if (this.iconCss) {
            var span = this.createElement('span', { className: 'e-btn-icon ' + this.iconCss });
            if (!this.element.textContent.trim()) {
                this.element.classList.add(cssClassName.ICONBTN);
            }
            else {
                span.classList.add('e-icon-' + this.iconPosition.toLowerCase());
                if (this.iconPosition === 'Top' || this.iconPosition === 'Bottom') {
                    this.element.classList.add('e-' + this.iconPosition.toLowerCase() + '-icon-btn');
                }
            }
            var node = this.element.childNodes[0];
            if (node && (this.iconPosition === 'Left' || this.iconPosition === 'Top')) {
                this.element.insertBefore(span, node);
            }
            else {
                this.element.appendChild(span);
            }
        }
    };
    /**
     * Fires the native click on the element and emits the `clicked` EJ2 event.
     *
     * @param {Event} originalEvent - The originating DOM event.
     * @param {boolean} isRepeat - `true` when this is a repeat fire, `false` for the initial press.
     * @returns {void}
     */
    Button.prototype.fireClick = function (originalEvent, isRepeat) {
        if (this.disabled) {
            return;
        }
        // For toggle buttons we rely on the DOM `click` to toggle state once.
        // For repeat fires, suppress the toggle on the next DOM click; for initial press, allow it.
        if (this.isToggle && isRepeat === true) {
            this.suppressToggleOnNextClick = true;
        }
        this.element.click();
        this.trigger('clicked', { originalEvent: originalEvent, isRepeat: isRepeat });
    };
    /**
     * Starts the hold-to-repeat cycle for pointer input.
     * Fires the initial click immediately, then after `repeatDelay` ms begins firing
     * at the effective interval (`repeatInterval > 0 ? repeatInterval : 100`).
     * Only processes events where `PointerEvent.button === 0` (primary button:
     * left-click, touch, primary pen). Non-primary buttons (right-click `button=2`,
     * middle-click `button=1`, back/forward `button=3/4`) are ignored to prevent
     * spurious `clicked` events and timer leaks caused by context-menu pointer capture.
     *
     * @param {Event} originalEvent - The originating event (PointerEvent or KeyboardEvent).
     * @returns {void}
     */
    Button.prototype.startRepeat = function (originalEvent) {
        var _this = this;
        if (originalEvent.button !== 0) {
            return;
        }
        this.fireClick(originalEvent, false);
        var effectiveInterval = this.repeatInterval > 0 ? this.repeatInterval : 100;
        if (this.repeatDelay === 0) {
            this.repeatIntervalTimer = setInterval(function () {
                _this.fireClick(originalEvent, true);
            }, effectiveInterval);
        }
        else {
            this.repeatDelayTimer = setTimeout(function () {
                _this.repeatIntervalTimer = setInterval(function () {
                    _this.fireClick(originalEvent, true);
                }, effectiveInterval);
            }, this.repeatDelay);
        }
    };
    /**
     * Stops any active repeat timers.
     *
     * @returns {void}
     */
    Button.prototype.stopRepeat = function () {
        clearTimeout(this.repeatDelayTimer);
        clearInterval(this.repeatIntervalTimer);
    };
    /**
     * Handles `keydown` events for keyboard-driven repeat.
     * - First keydown (`e.repeat === false`): fires the initial click; if `repeatInterval > 0`
     *   also starts the custom delay + interval cycle.
     * - Subsequent keydown with `e.repeat === true` and `repeatInterval === 0`: fires via native OS rate.
     * - Subsequent keydown with `e.repeat === true` and `repeatInterval > 0`: suppressed (custom interval handles it).
     *
     * @param {KeyboardEvent} e - The keyboard event.
     * @returns {void}
     */
    Button.prototype.onRepeatKeyDown = function (e) {
        var _this = this;
        if (e.key !== ' ' && e.key !== 'Enter') {
            return;
        }
        if (!e.repeat) {
            this.fireClick(e, false);
            if (this.repeatInterval > 0) {
                this.repeatDelayTimer = setTimeout(function () {
                    _this.repeatIntervalTimer = setInterval(function () {
                        _this.fireClick(e, true);
                    }, _this.repeatInterval);
                }, this.repeatDelay);
            }
        }
        else if (this.repeatInterval === 0) {
            this.fireClick(e, true);
        }
        // else: e.repeat === true && repeatInterval > 0 — suppress; custom interval is already running
    };
    Button.prototype.wireEvents = function () {
        if (this.isToggle) {
            EventHandler.add(this.element, 'click', this.btnClickHandler, this);
        }
        if (this.enableRepeat) {
            this.wireRepeatEvents();
        }
    };
    Button.prototype.wireRepeatEvents = function () {
        EventHandler.add(this.element, 'pointerdown', this.repeatPointerDownHandler, this);
        EventHandler.add(this.element, 'pointerup', this.repeatPointerUpHandler, this);
        EventHandler.add(this.element, 'pointerleave', this.repeatPointerLeaveHandler, this);
        EventHandler.add(this.element, 'pointercancel', this.repeatPointerCancelHandler, this);
        EventHandler.add(this.element, 'keydown', this.repeatKeyDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.repeatKeyUpHandler, this);
        EventHandler.add(this.element, 'blur', this.repeatBlurHandler, this);
    };
    Button.prototype.unwireRepeatEvents = function () {
        EventHandler.remove(this.element, 'pointerdown', this.repeatPointerDownHandler);
        EventHandler.remove(this.element, 'pointerup', this.repeatPointerUpHandler);
        EventHandler.remove(this.element, 'pointerleave', this.repeatPointerLeaveHandler);
        EventHandler.remove(this.element, 'pointercancel', this.repeatPointerCancelHandler);
        EventHandler.remove(this.element, 'keydown', this.repeatKeyDownHandler);
        EventHandler.remove(this.element, 'keyup', this.repeatKeyUpHandler);
        EventHandler.remove(this.element, 'blur', this.repeatBlurHandler);
        this.stopRepeat();
    };
    Button.prototype.unWireEvents = function () {
        if (this.isToggle) {
            EventHandler.remove(this.element, 'click', this.btnClickHandler);
        }
        if (this.enableRepeat) {
            this.unwireRepeatEvents();
        }
    };
    /**
     * Handles the toggle click behavior.
     * When called from a repeat fire (`isRepeat === true`) the `e-active` state is NOT toggled,
     * preserving the state set on the initial press.
     *
     * @param {boolean} [isRepeat] - `true` when invoked from a repeat fire.
     * @returns {void}
     */
    Button.prototype.onClickToggle = function (isRepeat) {
        // If called directly with `true` (repeat) bail out.
        if (isRepeat === true) {
            return;
        }
        // If a repeat fired and we suppressed the next DOM click, consume the suppression and bail.
        if (this.suppressToggleOnNextClick) {
            this.suppressToggleOnNextClick = false;
            return;
        }
        if (this.element.classList.contains('e-active')) {
            this.element.classList.remove('e-active');
        }
        else {
            this.element.classList.add('e-active');
        }
    };
    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    Button.prototype.destroy = function () {
        this.stopRepeat();
        var classList = [cssClassName.PRIMARY, cssClassName.RTL, cssClassName.ICONBTN, 'e-success', 'e-info', 'e-danger',
            'e-warning', 'e-flat', 'e-outline', 'e-small', 'e-bigger', 'e-active', 'e-round',
            'e-top-icon-btn', 'e-bottom-icon-btn', 'e-disabled'];
        if (this.cssClass) {
            classList = classList.concat(this.cssClass.split(/\s+/).filter(function (c) { return c.length > 0; }));
        }
        _super.prototype.destroy.call(this);
        removeClass([this.element], classList);
        if (!this.element.getAttribute('class')) {
            this.element.removeAttribute('class');
        }
        if (this.disabled) {
            this.element.removeAttribute('disabled');
        }
        if (this.content) {
            this.element.textContent = '';
        }
        var span = this.element.querySelector('span.e-btn-icon');
        if (span) {
            detach(span);
        }
        this.unWireEvents();
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        if (isRippleEnabled) {
            this.removeRippleEffect();
        }
    };
    /**
     * Get component name.
     *
     * @returns {string} - Module name
     * @private
     */
    Button.prototype.getModuleName = function () {
        return 'btn';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist Data
     * @private
     */
    Button.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Dynamically injects the required modules to the component.
     *
     * @private
     * @returns {void}
     */
    Button.Inject = function () {
        // Inject code snippets
    };
    /**
     * Called internally if any of the property value changed.
     *
     * @param  {ButtonModel} newProp - Specifies new properties
     * @param  {ButtonModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    Button.prototype.onPropertyChanged = function (newProp, oldProp) {
        var span = this.element.querySelector('span.e-btn-icon');
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'isPrimary':
                    if (newProp.isPrimary) {
                        this.element.classList.add(cssClassName.PRIMARY);
                    }
                    else {
                        this.element.classList.remove(cssClassName.PRIMARY);
                    }
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.stopRepeat();
                    }
                    this.controlStatus(newProp.disabled);
                    break;
                case 'iconCss': {
                    span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        if (newProp.iconCss) {
                            span.className = 'e-btn-icon ' + newProp.iconCss;
                            if (this.element.textContent.trim()) {
                                if (this.iconPosition === 'Left') {
                                    span.classList.add('e-icon-left');
                                }
                                else {
                                    span.classList.add('e-icon-right');
                                }
                            }
                        }
                        else {
                            detach(span);
                        }
                    }
                    else {
                        this.setIconCss();
                    }
                    break;
                }
                case 'iconPosition':
                    removeClass([this.element], ['e-top-icon-btn', 'e-bottom-icon-btn']);
                    span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        detach(span);
                    }
                    this.setIconCss();
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(/\s+/).filter(function (c) { return c.length > 0; }));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        this.element.classList.add(cssClassName.RTL);
                    }
                    else {
                        this.element.classList.remove(cssClassName.RTL);
                    }
                    break;
                case 'content': {
                    var node = getTextNode(this.element);
                    if (!node) {
                        this.element.classList.remove(cssClassName.ICONBTN);
                    }
                    if (!isBlazor() || (isBlazor() && !this.isServerRendered && this.getModuleName() !== 'progress-btn')) {
                        if (this.enableHtmlSanitizer) {
                            newProp.content = SanitizeHtmlHelper.sanitize(newProp.content);
                        }
                        this.element.innerHTML = newProp.content;
                        this.setIconCss();
                    }
                    break;
                }
                case 'isToggle':
                    if (newProp.isToggle) {
                        EventHandler.add(this.element, 'click', this.btnClickHandler, this);
                    }
                    else {
                        EventHandler.remove(this.element, 'click', this.btnClickHandler);
                        removeClass([this.element], ['e-active']);
                    }
                    break;
                case 'enableRepeat':
                    if (newProp.enableRepeat) {
                        this.wireRepeatEvents();
                    }
                    else {
                        this.unwireRepeatEvents();
                    }
                    break;
                case 'repeatDelay':
                    // Changes take effect on the next hold cycle; no re-wiring needed.
                    break;
                case 'repeatInterval':
                    // Changes take effect on the next hold cycle; no re-wiring needed.
                    break;
            }
        }
    };
    /**
     * Click the button element
     * its native method
     *
     * @public
     * @returns {void}
     */
    Button.prototype.click = function () {
        this.element.click();
    };
    /**
     * Sets the focus to Button
     * its native method
     *
     * @public
     * @returns {void}
     */
    Button.prototype.focusIn = function () {
        this.element.focus();
    };
    __decorate([
        Property('Left')
    ], Button.prototype, "iconPosition", void 0);
    __decorate([
        Property('')
    ], Button.prototype, "iconCss", void 0);
    __decorate([
        Property(false)
    ], Button.prototype, "disabled", void 0);
    __decorate([
        Property(false)
    ], Button.prototype, "isPrimary", void 0);
    __decorate([
        Property('')
    ], Button.prototype, "cssClass", void 0);
    __decorate([
        Property('')
    ], Button.prototype, "content", void 0);
    __decorate([
        Property(false)
    ], Button.prototype, "isToggle", void 0);
    __decorate([
        Property(false)
    ], Button.prototype, "enableRepeat", void 0);
    __decorate([
        Property(400)
    ], Button.prototype, "repeatDelay", void 0);
    __decorate([
        Property(0)
    ], Button.prototype, "repeatInterval", void 0);
    __decorate([
        Property()
    ], Button.prototype, "locale", void 0);
    __decorate([
        Property(true)
    ], Button.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        Event()
    ], Button.prototype, "created", void 0);
    __decorate([
        Event()
    ], Button.prototype, "clicked", void 0);
    Button = __decorate([
        NotifyPropertyChanges
    ], Button);
    return Button;
}(Component));
export { Button };
