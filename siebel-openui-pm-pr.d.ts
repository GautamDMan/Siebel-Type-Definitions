/**
 * Unofficial TypeScript definitions for the Siebel OpenUI client-side
 * Presentation Model (PM) / Physical Renderer (PR) / Plug-in Wrapper (PW) API.
 *
 * Source: Oracle "Configuring Siebel Open UI" guide, chapter "Application
 * Programming Interface". Method signatures are stable across IP2015 through
 * Siebel CRM 23.7 Update (IP23) and later (24.6 / 24.9) — no PM/PR method
 * signature changes were introduced in those updates, only new applet-level
 * configuration topics unrelated to this API surface.
 *
 * These are NOT provided by Oracle. Build/verify against your own IP23
 * client JS (presentationmodel.js / phyrenderer.js / siebelappfacade.js)
 * if you need 100% fidelity, since some internal/undocumented members
 * are intentionally omitted here.
 *
 * NOTE ON PARAMETER TYPES: Oracle's docs describe most arguments only in
 * prose ("a string", "an object"), rarely with strict shapes. Where the
 * official doc does not specify a shape, `any` is used deliberately rather
 * than guessed — tighten these as you confirm real usage.
 */

declare namespace SiebelAppFacade {
  // ---------------------------------------------------------------------
  // Common / shared types
  // ---------------------------------------------------------------------

  /** Generic Siebel hierarchical property set (server <-> client payloads). */
  interface JSSPropertySet {
    GetChild(index: number): JSSPropertySet;
    GetChildByType(type: string): JSSPropertySet | null;
    GetProperty(name: string): string;
    SetProperty(name: string, value: string): void;
    GetChildCount(): number;
    GetType(): string;
    [key: string]: any;
  }

  interface AjaxConfig {
    scope?: any;
    sequence?: boolean;
    override?: boolean;
    [key: string]: any;
  }

  type MethodConfig = {
    /** true = call before predefined method; false (default) = call after */
    sequence?: boolean;
    /** true = replace predefined method entirely (where allowed) */
    override?: boolean;
    /** `this` binding used when Siebel Open UI calls methodDef */
    scope?: any;
  };

  type BindingConfig = {
    scope?: any;
    when?: (...args: any[]) => boolean;
  };

  // ---------------------------------------------------------------------
  // PresentationModel — base class (pmodel.js)
  // ---------------------------------------------------------------------

  /** Base class for every Presentation Model. Defined in pmodel.js. */
  class PresentationModel {
    /**
     * Binds a communication method to a target method that Siebel Open UI
     * calls after methodName finishes, in the PM's context.
     */
    AddComponentCommunication(
      methodName: string,
      targetMethod: string,
      targetMethodConfig?: { scope?: any; args?: any[] }
    ): void;

    /** Adds a text string retrievable via the locale object. */
    AddLocalString(id: string, customString: string): void;

    /**
     * Adds a method to the presentation model. If a method with the same
     * name already exists (predefined), the new one customizes it,
     * subject to `methodConfig.sequence` / `methodConfig.override`.
     * @returns true if added successfully.
     */
    AddMethod(
      methodName: string,
      methodDef: (...args: any[]) => any,
      methodConfig?: MethodConfig
    ): boolean;

    /**
     * Adds a property to the presentation model, retrievable via Get().
     * A subsequent call with the same propertyName overwrites the value.
     * propertyValue may itself be a function (derived property) — in
     * that case Get() invokes it and returns its result.
     */
    AddProperty(propertyName: string, propertyValue: any | (() => any)): boolean;

    /**
     * Registers a custom validator for an event. Return true/false from
     * the validator to indicate whether validation passed.
     */
    AddValidator(
      eventName: string,
      validator: (row: number, ctrl: AppletControl, val: any) => boolean
    ): boolean;

    /**
     * Attaches an event handler. Siebel Open UI invokes it via
     * OnControlEvent. Handlers run LIFO across the inheritance chain.
     */
    AttachEventHandler(
      eventName: string,
      functionReference: (...args: any[]) => any
    ): void;

    /**
     * Attaches a handler for a server-sent notification (e.g. record
     * created/deleted/modified) to an applet.
     */
    AttachNotificationHandler(
      notificationName: string,
      handler: (...args: any[]) => any
    ): boolean;

    /**
     * Binds a method to run immediately after an existing method
     * finishes processing. Commonly used from the Physical Renderer's
     * Init to react to PM state changes.
     */
    AttachPMBinding(
      methodName: string,
      methodToCall: (...args: any[]) => any,
      config?: BindingConfig
    ): boolean;

    /** Runs after the applet proxy finishes processing a server reply. */
    AttachPostProxyExecuteBinding(
      methodToCall: string,
      binder: (methodName: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet) => void
    ): void;

    /** Runs before the applet proxy processes a server reply (pre-PostExecute). */
    AttachPreProxyExecuteBinding(
      methodToCall: string,
      binder: (methodName: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet) => void
    ): void;

    /**
     * Runs a predefined or custom PM method, resolving dependency chains.
     * @returns the method's return value, or the string "undefined" if
     * the method does not exist.
     */
    ExecuteMethod(methodName: string, ...args: any[]): any;

    /** Returns the value of a property added via AddProperty. */
    Get(propertyName: string): any;

    /** Gets a control template used to build a control's property set. */
    GetCtrlTemplate(
      controlName: string,
      displayName: string,
      controlType: string,
      columnIndex: number
    ): void;

    /**
     * Lifecycle method: configure properties/methods/bindings here
     * (AddMethod, AttachNotificationHandler, AttachPMBinding, etc.).
     * Predefined Init always runs before a derived class's Init.
     */
    Init(): void;

    /** Calls a logical event; dispatches to handlers via AttachEventHandler. */
    OnControlEvent(eventName: string, ...eventArguments: any[]): any;

    /** Sets (or creates, if absent) the value of a PM property. */
    SetProperty(propertyName: string, propertyValue: any): boolean;

    /**
     * Lifecycle method: extracts values from the initial server property
     * set into PM properties. Predefined Setup always runs before a
     * derived class's Setup.
     */
    Setup(propertySet: JSSPropertySet): void;

    /** Presentation-model instance of the currently active/host object. */
    GetProxy(): any;
    GetRenderer(): PhysicalRenderer;
  }

  // ---------------------------------------------------------------------
  // Presentation Model — Applets (extends PresentationModel)
  // ---------------------------------------------------------------------

  /** Properties available via Get() on an applet-level PresentationModel. */
  interface AppletPMProperties {
    GetActiveControl: string;
    GetAppleLabel: string; // sic — matches Oracle doc's property name
    GetAppletSummary: string;
    GetControls: Record<string, AppletControl>;
    GetDefaultFocusOnNew: string;
    GetDefaultFocusOnQuery: string;
    GetFullId: string;
    GetId: string;
    GetMode: string;
    GetName: string;
    GetPrsrvControl: string;
    GetQueryModePrompt: string;
    GetRecordset: any[];
    GetSelection: number;
    GetTitle: string;
    GetUIEventMap: Array<{ ev: string; ar: any[] }>;
    IsInQueryMode: boolean;
    IsPure: boolean;
  }

  /** Presentation model used for applets (form or list). Callable/bindable per Oracle Table A-1. */
  class ApplePresentationModel extends PresentationModel {
    /** Callable. Whether Siebel Open UI can invoke method_name. */
    CanInvokeMethod(methodName: string): boolean;
    /** Callable. Whether the user can navigate to a control. */
    CanNavigate(fieldName: string): boolean;
    /** Callable. Whether a control can be updated. */
    CanUpdate(controlName: string): boolean;
    /** Bindable. Updates objects in the user interface. */
    ExecuteUIUpdate(): void;
    /** Bindable. Modifies the value of a field. */
    FieldChange(control: AppletControl, fieldValue: any): void;
    /** Bindable. Sets focus on the first control. */
    FocusFirstControl(): void;
    /** Callable. Returns a control instance. */
    GetControl(controlName: string): AppletControl;
    /** Callable. Gets the control id of a toggle applet. */
    GetControlId(): string;
    /** Callable. Returns the value of a field. */
    GetFieldValue(fieldName: string): any;
    /** Callable. Returns the (locale-)formatted value of a control. */
    GetFormattedFieldValue(controlName: string, fromWorkset: boolean, index: number): string;
    /** Bindable. Gets the value of a physical control from the PR. */
    GetPhysicalControlValue(control: AppletControl): any;
    /** Callable. Calls a method on the applet proxy. */
    InvokeMethod(name: string, inputs?: JSSPropertySet, asyncOrConfig?: boolean | AjaxConfig): JSSPropertySet;
    /** Bindable. Invoked on a can-invoke notification update from the server. */
    InvokeStateChange(): void;
    /** Callable. Whether the field behind a control is private. */
    IsPrivateField(fieldName: string): boolean;
    /**
     * Callable. Whether Siebel Open UI has removed focus from a field.
     * @param doNotLeave true = keep focus on control; false = allow leave.
     */
    LeaveField(control: AppletControl, value: any, doNotLeave: boolean): boolean;
    /** Bindable. Returns properties of a new file attachment. */
    NewFileAttachment(): any;
    /**
     * Bindable. Runs after InvokeMethod finishes and the server call
     * returns. Only method customizable/overridable on this PM class.
     */
    PostExecute(cmd: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet, lpcsa?: any): void;
    /** Bindable. Cancels the query dialog box. */
    ProcessCancelQueryPopup(): void;
    /** Bindable. Refreshes the applet in the client. */
    RefreshData(value: boolean): void;
    /** Bindable. Sets the applet to active state if not already active. */
    ResetAppletState(): void;
    /**
     * Callable/Bindable. Sets the active control of the applet.
     * Not recommended to call directly outside of framework context.
     */
    SetActiveControl(controlName: string | null): void;
    /** Callable. Sets the default-focus flag. */
    SetFocusDefaultControl(): void;
    /** Bindable. Sets highlight state for the active applet. */
    SetHighlightState(isActive: boolean, newActiveApplet?: any): void;
    /** Callable. Toggles update-conditional processing. */
    SetUpdateConditionals(condition: boolean): void;
    /** Callable. Displays the currency pick applet. */
    ShowPickPopup(): void;
    /** Bindable. Displays a dialog for calculator/date/date-time controls. */
    ShowPopup(control: AppletControl): void;
    /** Bindable. Makes a record the active record. */
    ShowSelection(): void;
    /** Bindable. Updates an applet message per server-side changes. */
    UpdateAppletMessage(): void;
    /** Bindable. Runs when Siebel Open UI displays the applet. */
    UpdateConditionals(): void;
    /** Bindable. Updates currency-calculation info. */
    UpdateCurrencyCalcInfo(index: number, args: any): void;
    /** Bindable. Updates List-of-Values info sent from the server. */
    UpdateQuickPickInfo(field: string, replace: boolean, values: any[], index: number): void;
    /** Bindable. Handles notification updates from the server. */
    UpdateStateChange(): void;

    Get<K extends keyof AppletPMProperties>(propertyName: K): AppletPMProperties[K];
    Get(propertyName: string): any;
  }

  // ---------------------------------------------------------------------
  // Presentation Model — List Applets (extends ApplePresentationModel)
  // ---------------------------------------------------------------------

  interface ListColumnDescriptor {
    name: string;
    controlType: string;
    isLink: boolean;
    index: number;
    bCanUpdate: boolean;
    control: AppletControl;
  }

  interface ListPMProperties extends AppletPMProperties {
    GetBeginRow: number;
    GetListOfColumns: Record<string, ListColumnDescriptor>;
    GetRowIdentifier: string;
    GetRowListRowCount: number;
    GetRowsSelectedArray: boolean[];
    HasHierarchy: boolean;
  }

  /** Defined in listpmodel.js; used for list applets. */
  class ListPresentationModel extends ApplePresentationModel {
    /** Bindable. Whether Siebel Open UI modified a control's value; returns new value. */
    CellChange(rowId: number, fieldName: string, value: any): any;
    /** Callable/Bindable. Selects a row. */
    HandleRowSelect(rowId: number, controlKey: boolean, shiftKey: boolean): boolean;
    /** Callable. Sorts a column ("asc" | "desc"). Asynchronous — cannot be bound. */
    OnClickSort(name: string, direction: 'asc' | 'desc'): void;
    /** Callable. Blurs (deactivates) a control. Requires prior OnCtrlFocus. */
    OnCtrlBlur(rowId: number, control: string, value: any): void;
    /** Callable. Brings a control into focus. Fails if another control is already active. */
    OnCtrlFocus(rowId: number, control: string, value: any): void;
    /** Callable. Drills down on a control. */
    OnDrillDown(controlName: string, rowId: number): boolean;
    /** Callable. Scrolls records: "nxrc" | "pvrc" | "pgdn" | "pgup". Async — cannot be bound. */
    OnVerticalScroll(scrollAction: 'nxrc' | 'pvrc' | 'pgdn' | 'pgup'): void;
    /** Bindable. Whether the list applet is in multiselect mode. */
    SetMultiSelectMode(bInMultiSelMode: boolean): void;

    Get<K extends keyof ListPMProperties>(propertyName: K): ListPMProperties[K];
    Get(propertyName: string): any;
  }

  // ---------------------------------------------------------------------
  // Presentation Model — Menus
  // ---------------------------------------------------------------------

  interface MenuPMProperties {
    GetObjectType: string;
    GetRepstrName: string;
    GetUIName: string;
    GetId: string;
    GetLabel: string;
  }

  class MenuPresentationModel extends PresentationModel {
    /** Returns a property set describing the menu and its menu items. */
    GetMenuPS(): JSSPropertySet;
    /** Creates a menu. */
    OnMenuInvoke(appletName: string, ...args: any[]): void;
    /** Runs when the user chooses a menu item. */
    ProcessMenuCommand(menuItemCommand: string): void;
    /** Binding-only method; signals menu display is complete. */
    ShowMenu(): void;

    Get<K extends keyof MenuPMProperties>(propertyName: K): MenuPMProperties[K];
    Get(propertyName: string): any;
  }

  // ---------------------------------------------------------------------
  // PhysicalRenderer — base class
  // ---------------------------------------------------------------------

  /** Base class every custom Physical Renderer extends. */
  class PhysicalRenderer {
    constructor(pm: PresentationModel);

    /**
     * Lifecycle. Downloads metadata/data to the client proxy and binds it
     * to the UI. Must be defined by every PR (directly or via superclass).
     */
    BindData(searchData?: any, options?: any): void;

    /**
     * Lifecycle. Binds UI events to physical DOM elements, translating
     * user actions into logical PM events. Must be defined by every PR.
     */
    BindEvents(controls?: Record<string, AppletControl>): void;

    /** Enables a control. */
    EnableControl(controlName: string): void;

    /** Lifecycle. Ends the life of the renderer — unbind events here. */
    EndLife(): void;

    /** Returns the associated PresentationModel instance for this PR. */
    GetPM(): PresentationModel;

    /** Sets the value on the physical DOM instance of a control. */
    SetControlValue(control: AppletControl, value: any): void;

    /**
     * Lifecycle. Displays the physical control(s) that correspond to
     * applet controls. Must be defined by every PR.
     */
    ShowUI(): void;
  }

  // ---------------------------------------------------------------------
  // Plug-in Wrapper — base class (basepw)
  // ---------------------------------------------------------------------

  type PWState = 'EDITABLE' | 'ENABLE' | 'SHOW' | 'FOCUS';

  /** Base Plug-in Wrapper class; manages a single applet control's lifecycle. */
  class BasePlugInWrapper {
    /** Gets the jQuery-wrapped DOM element(s) for the control. */
    GetEl(index?: number): JQuery | null;

    /** Lifecycle. Show-related setup for the control. */
    ShowUI(): void;
    /** Lifecycle. Attaches events to the control's DOM instance. */
    BindEvents(): void;
    /** Lifecycle. Initializes data on the control's DOM instance. */
    BindData(): void;
    /** Lifecycle. Ends the life of the plug-in wrapper. */
    EndLife(): void;

    /** Sets the value in the DOM instance of the control. */
    SetValue(value: any, index?: number): void;
    /** Gets the value of the control field from the DOM. */
    GetValue(index?: number): any;

    /** Signals the wrapper is entering query mode. */
    BeginQuery(): void;
    /** Signals the wrapper is exiting query mode. */
    EndQuery(): void;

    /** Returns any configured icon map for this control. */
    GetIconMap(): any;

    /**
     * Sets a DOM state on the associated instance(s).
     * @param flag true reverses the state (e.g. EDITABLE + true = NON-EDITABLE)
     */
    SetState(state: PWState, flag: boolean, index?: number): void;
  }

  // ---------------------------------------------------------------------
  // Applet class (applet.js)
  // ---------------------------------------------------------------------

  class Applet {
    /** Adds a client-only control (no server-side representation). */
    AddClientControl(ctrlInfo: any): void;
    /** Returns the set of controls the applet uses. */
    GetControls(): Record<string, AppletControl>;
    /** Returns the applet's name. */
    GetName(): string;
    /** Returns the current record set displayed in the applet. */
    GetRecordSet(): any[];
    /** Returns the index of the active row. */
    GetSelection(): number;
  }

  // ---------------------------------------------------------------------
  // Applet Control class (appletcontrol.js) — partial per Oracle doc
  // ---------------------------------------------------------------------

  class AppletControl {
    /** 1 = case sensitive, 0 = not. */
    GetCaseSensitive(): 0 | 1;
    GetDisabledBmp(): string;
    GetDisplayName(): string;
    GetDispMode(): string;
    GetEDEnabled(): boolean;
    GetEnabledBmp(): string;
    GetFieldName(): string;
    GetHeight(): number;
    GetInputName(): string;
    GetJustification(): string;
    GetMaxSize(): number;
    GetMethodName(): string;
    GetName(): string;
    GetPMPropSet(): JSSPropertySet;
    GetPopupHeight(): number;
    GetPopupType(): string;
    GetPopupWidth(): number;
    GetPrompt(): string;
    GetUIType(): string;
    GetWidth(): number;
    HandleDeleteNotification(...args: any[]): void;
    IsBoundedPick(): boolean;
    IsCalc(): boolean;
    IsDynamic(): boolean;
    IsEditEnabled(): boolean;
    IsSortable(): boolean;
    NewRecord(...args: any[]): void;
    NotifyNewData(...args: any[]): void;
    PreGetFormattedFieldValue(...args: any[]): void;
    PostLeaveField(...args: any[]): void;
    SetIndex(index: number): void;
  }
}

/**
 * Global `define` used by Siebel Open UI's module loader to register a
 * custom PM/PR/PW file.
 */
declare function define(
  moduleName: string,
  dependencies: string[],
  factory: () => string
): void;

declare namespace SiebelJS {
  function Namespace(path: string): void;
  function Extend(childClass: Function, parentClass: Function): void;
  function Dependency(path: string): any;
  function Log(...args: any[]): void;
}

declare namespace SiebelApp {
  const S_App: {
    GetActiveView(): any;
    PluginBuilder: {
      AttachPW(
        controlType: string,
        pwClass: Function,
        condition: (control: SiebelAppFacade.AppletControl, objName?: string) => boolean
      ): void;
    };
    [key: string]: any;
  };
  namespace Constants {
    function get(name: string): string;
  }
}
