import { INotifyPropertyChanged, Component } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Observer } from '@syncfusion/ej2-base';
import { ButtonModel } from './button-model';
/**
 * Defines the arguments for the clicked event of the Button component.
 */
export interface ClickedEventArgs {
    /** The original DOM event that triggered the click. */
    originalEvent: Event;
    /** Indicates whether this click was a repeat fire (`true`) or the initial press (`false`). */
    isRepeat: boolean;
}
/**
 * Defines the icon position of button.
 */
export declare enum IconPosition {
    /**
     * Positions the Icon at the left of the text content in the Button.
     */
    Left = "Left",
    /**
     * Positions the Icon at the right of the text content in the Button.
     */
    Right = "Right",
    /**
     * Positions the Icon at the top of the text content in the Button.
     */
    Top = "Top",
    /**
     * Positions the Icon at the bottom of the text content in the Button.
     */
    Bottom = "Bottom"
}
export declare const buttonObserver: Observer;
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
export declare class Button extends Component<HTMLButtonElement> implements INotifyPropertyChanged {
    private removeRippleEffect;
    private repeatDelayTimer;
    private repeatIntervalTimer;
    private repeatPointerDownHandler;
    private repeatPointerUpHandler;
    private repeatPointerLeaveHandler;
    private repeatPointerCancelHandler;
    private repeatKeyDownHandler;
    private repeatKeyUpHandler;
    private repeatBlurHandler;
    private btnClickHandler;
    private suppressToggleOnNextClick;
    private mutationObserver;
    /**
     * Positions the icon before/after the text content in the Button.
     * The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Right: The icon will be positioned to the right of the text content.
     *
     * @isenumeration true
     * @default IconPosition.Left
     * @asptype IconPosition
     */
    iconPosition: string | IconPosition;
    /**
     * Defines class/multiple classes separated by a space for the Button that is used to include an icon.
     * Buttons can also include font icon and sprite image.
     *
     * @default ""
     */
    iconCss: string;
    /**
     * Specifies a value that indicates whether the Button is `disabled` or not.
     *
     * @default false.
     */
    disabled: boolean;
    /**
     * Allows the appearance of the Button to be enhanced and visually appealing when set to `true`.
     *
     * @default false
     */
    isPrimary: boolean;
    /**
     * Defines class/multiple classes separated by a space in the Button element. The Button types, styles, and
     * size can be defined by using
     * [`this`](https://ej2.syncfusion.com/documentation/button/how-to/create-a-block-button).
     * {% codeBlock src='button/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default ""
     */
    cssClass: string;
    /**
     * Defines the text `content` of the Button element.
     * {% codeBlock src='button/content/index.md' %}{% endcodeBlock %}
     *
     * @default ""
     */
    content: string;
    /**
     * Makes the Button toggle, when set to `true`. When you click it, the state changes from normal to active.
     *
     * @default false
     */
    isToggle: boolean;
    /**
     * Enables hold-to-repeat behavior on the Button when set to `true`.
     * While the button is held down (pointer or keyboard), repeated `clicked` events are fired
     * at the rate controlled by `repeatDelay` and `repeatInterval`.
     *
     * @default false
     */
    enableRepeat: boolean;
    /**
     * Specifies the delay in milliseconds before repeat firing begins after the initial press.
     * Only applicable when `enableRepeat` is `true`.
     * Changes to this property take effect on the next hold cycle.
     *
     * @default 400
     */
    repeatDelay: number;
    /**
     * Specifies the interval in milliseconds between repeated `clicked` fires during a hold.
     * When set to `0` (default), pointer repeat uses 100ms; keyboard repeat defers to the native OS rate.
     * Changes to this property take effect on the next hold cycle.
     *
     * @default 0
     */
    repeatInterval: number;
    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @private
     */
    locale: string;
    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the Button component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    enableHtmlSanitizer: boolean;
    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    created: EmitType<Event>;
    /**
     * Triggers on every click fire — both the initial press and each repeat while the button is held.
     * The event argument carries `originalEvent` (the originating DOM event) and `isRepeat`
     * (`false` for the first press, `true` for subsequent repeat fires).
     * Only emitted when `enableRepeat` is `true`.
     *
     * @event clicked
     */
    clicked: EmitType<ClickedEventArgs>;
    /**
     * Constructor for creating the widget
     *
     * @param  {ButtonModel} options - Specifies the button model
     * @param  {string|HTMLButtonElement} element - Specifies the target element
     */
    constructor(options?: ButtonModel, element?: string | HTMLButtonElement);
    protected preRender(): void;
    /**
     * Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    render(): void;
    private observeDomAttributeChanges;
    private initialize;
    private controlStatus;
    private setIconCss;
    /**
     * Fires the native click on the element and emits the `clicked` EJ2 event.
     *
     * @param {Event} originalEvent - The originating DOM event.
     * @param {boolean} isRepeat - `true` when this is a repeat fire, `false` for the initial press.
     * @returns {void}
     */
    private fireClick;
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
    private startRepeat;
    /**
     * Stops any active repeat timers.
     *
     * @returns {void}
     */
    private stopRepeat;
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
    private onRepeatKeyDown;
    protected wireEvents(): void;
    private wireRepeatEvents;
    private unwireRepeatEvents;
    protected unWireEvents(): void;
    /**
     * Handles the toggle click behavior.
     * When called from a repeat fire (`isRepeat === true`) the `e-active` state is NOT toggled,
     * preserving the state set on the initial press.
     *
     * @param {boolean} [isRepeat] - `true` when invoked from a repeat fire.
     * @returns {void}
     */
    private onClickToggle;
    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Get component name.
     *
     * @returns {string} - Module name
     * @private
     */
    getModuleName(): string;
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist Data
     * @private
     */
    getPersistData(): string;
    /**
     * Dynamically injects the required modules to the component.
     *
     * @private
     * @returns {void}
     */
    static Inject(): void;
    /**
     * Called internally if any of the property value changed.
     *
     * @param  {ButtonModel} newProp - Specifies new properties
     * @param  {ButtonModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp: ButtonModel, oldProp: ButtonModel): void;
    /**
     * Click the button element
     * its native method
     *
     * @public
     * @returns {void}
     */
    click(): void;
    /**
     * Sets the focus to Button
     * its native method
     *
     * @public
     * @returns {void}
     */
    focusIn(): void;
}
