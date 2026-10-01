/**
 * Siebel Open UI - MERGED IntelliSense declarations (PM / PR / PW)
 * ========================================================================
 * Merged from github.com/GautamDMan/Siebel-Type-Definitions:
 *   1. siebel-openui.d.ts               (global proxies, PM/PR/PW stubs)
 *   2. siebel-openui-pm-pr.d.ts         (Oracle-doc based PM/PR/PW API)
 *   3. siebel_ip23_openui_toolkit.zip -> siebel-openui-ip23.d.ts
 *                                       (SiebelOpenUI namespace, globals, jQuery stubs)
 *
 * Conflicts resolved:
 *   - SiebelApp / SiebelJS / SiebelAppFacade were declared as const, namespace
 *     and "any" in different files -> one typed declaration of each.
 *   - Duplicate classes (PresentationModel, ListPresentationModel,
 *     PhysicalRenderer, BasePW vs BasePlugInWrapper, PluginBuilder) -> merged
 *     into one class each, taking the union of members.
 *   - Return types follow the Oracle-doc file (e.g. AddMethod -> boolean).
 *   - Names from the source files are all kept; aliases added where they differ.
 *
 * Unofficial, NOT provided by Oracle. Verify against your IP version's
 * pmodel.js / phyrenderer.js. Most classes keep [key: string]: any so
 * undeclared members never raise errors.
 *
 * Usage: put next to jsconfig.json and list it under "include".
 */

/* ======================================================================== */
/* AMD loader                                                               */
/* ======================================================================== */
declare function define(deps: string[], factory: (...args: any[]) => any): void;
declare function define(moduleName: string, deps: string[], factory: (...args: any[]) => any): void;
declare function require(deps: string[], callback: (...args: any[]) => void): void;

/* ======================================================================== */
/* SiebelJS / misc globals                                                  */
/* ======================================================================== */
declare namespace SiebelJS {
  /** Creates the namespace object, e.g. "SiebelAppFacade.MyPM". */
  function Namespace(path: string): void;
  /** Prototype inheritance helper; also sets Sub.superclass. */
  function Extend<T extends Function, B extends Function>(childClass: T, parentClass: B): T;
  /** Declares a dependency on a namespace. */
  function Dependency(path: string): any;
  /** Writes to the browser console / Siebel client log. */
  function Log(...args: any[]): void;
  function DebugLog(...args: any[]): void;
}
declare const SiebelJSNamespace: any;
declare const SiebelCfg: any;

interface SiebelConstantsStatic {
  /** Look up an SWE constant, e.g. get("SWE_PROP_BC_NOTI_GENERIC"). */
  get(name: string): string;
  [key: string]: any;
}
declare const SiebelConstants: SiebelConstantsStatic;

/* ======================================================================== */
/* PropertySet                                                              */
/* ======================================================================== */
interface SiebelPropertySet {
  Clone(): SiebelPropertySet;
  Copy(): SiebelPropertySet;
  DeepCopy(): SiebelPropertySet;
  Reset(): void;

  GetType(): string;
  SetType(type: string): void;
  GetValue(): string;
  SetValue(value: string): void;

  GetProperty(name: string): string;
  SetProperty(name: string, value: any): void;
  RemoveProperty(name: string): void;
  PropertyExists(name: string): boolean;
  GetPropertyCount(): number;
  GetFirstProperty(): string;
  GetNextProperty(): string;
  EnumProperties?(): any;
  GetPropertyMap?(): { [name: string]: string };

  GetChildCount(): number;
  GetChild(index: number): SiebelPropertySet;
  GetChildByType(type: string): SiebelPropertySet | null;
  AddChild(child: SiebelPropertySet): number;
  InsertChildAt(child: SiebelPropertySet, index: number): void;
  RemoveChild(index: number): void;

  [key: string]: any;
}

/* ======================================================================== */
/* Proxy objects: Control, BusComp, BusObj, Applet, View, Service           */
/* ======================================================================== */
/** Control instance (merged: SiebelControl + AppletControl + SiebelOpenUI.Control). */
type SiebelControl = SiebelAppFacade.AppletControl;

interface SiebelBusComp {
  GetName(): string;
  GetFieldValue(fieldName: string): any;
  SetFieldValue?(fieldName: string, value: any): void;
  GetFieldMap?(): any;
  GetRecordSet?(): any[];
  GetFieldList?(): string[];
  GetSelection?(): number;
  GetRowListRowCount?(): number;
  [key: string]: any;
}

interface SiebelBusObj {
  GetName(): string;
  GetBusComp(name: string): SiebelBusComp;
  GetBCMap?(): { [name: string]: SiebelBusComp };
  GetBusCompNames?(): string[];
  [key: string]: any;
}

interface SiebelApplet {
  GetName(): string;
  GetFullId(): string;
  GetBusComp(): SiebelBusComp;
  GetBusObj(): SiebelBusObj;
  GetPModel(): SiebelAppFacade.PresentationModel;
  GetControls(): { [name: string]: SiebelControl };
  GetControl(name: string): SiebelControl;
  GetAppletLabel?(): string;
  GetPlaceholder?(): string;
  GetRecordSet?(): any[];
  GetSelection?(): number;
  AddClientControl?(ctrlInfo: any): void;
  GetProperty?(name: string): any;
  SetProperty?(name: string, value: any): any;
  CanInvokeMethod(methodName: string): boolean;
  InvokeMethod(methodName: string, inputPS?: SiebelPropertySet | null, config?: any): any;
  [key: string]: any;
}

interface SiebelView {
  GetName(): string;
  GetAppletMap(): { [name: string]: SiebelApplet };
  GetApplet(name: string): SiebelApplet;
  GetActiveApplet(): SiebelApplet;
  GetActiveBusObj?(): SiebelBusObj;
  GetPModel?(): SiebelAppFacade.PresentationModel;
  [key: string]: any;
}

interface SiebelService {
  InvokeMethod(
    methodName: string,
    inputPS: SiebelPropertySet,
    config?: {
      async?: boolean;
      scope?: any;
      selfbusy?: boolean;
      mask?: boolean;
      opdecode?: boolean;
      errcb?: (...args: any[]) => void;
      cb?: (methodName: string, inputPS: SiebelPropertySet, outputPS: SiebelPropertySet) => void;
      [key: string]: any;
    }
  ): SiebelPropertySet;
  [key: string]: any;
}

/** Plug-in wrapper registration (SiebelApp.S_App.PluginBuilder / SiebelAppFacade.PluginBuilder). */
interface SiebelPluginBuilder {
  AttachPW(
    controlType: string,
    pwClass: Function,
    condition?: (control: SiebelAppFacade.AppletControl, objName?: string) => boolean
  ): void;
  AttachEventsToPW?(...args: any[]): void;
  [key: string]: any;
}

/* ======================================================================== */
/* SiebelApp                                                                */
/* ======================================================================== */
interface SiebelAppObject {
  GetActiveView(): SiebelView;
  GetActiveApplet(): SiebelApplet;
  GetActiveBusObj(): SiebelBusObj;
  GetAppName?(): string;
  GetUserName(): string;
  GetLoginName?(): string;
  GetPageURL?(): string;
  GetProfileAttr(name: string): string;
  SetProfileAttr?(name: string, value: string): void;
  GetService(serviceName: string): SiebelService;
  NewPropertySet(): SiebelPropertySet;
  GotoView(viewName: string, viewId?: string, url?: string, extra?: any): void;
  GetDirectLoginInfo?(): any;
  LogOff?(): void;
  /** Look up an active applet's PM by name. */
  GetAppletPModel?(name: string): SiebelAppFacade.PresentationModel;
  PluginBuilder: SiebelPluginBuilder;
  [key: string]: any;
}

interface SiebelAppStatic {
  S_App: SiebelAppObject;
  Constants: SiebelConstantsStatic;
  Utils: {
    Trim?(s: string): string;
    IsEmpty?(v: any): boolean;
    GetUILanguage?(): string;
    [key: string]: any;
  };
  [key: string]: any;
}
declare const SiebelApp: SiebelAppStatic;

/* ======================================================================== */
/* SiebelAppFacade: PM / PR / PW                                            */
/* ======================================================================== */
declare namespace SiebelAppFacade {

  /* ---------------------------- Shared types -------------------------- */

  /** Generic Siebel hierarchical property set. */
  type JSSPropertySet = SiebelPropertySet;

  interface AjaxConfig {
    scope?: any;
    sequence?: boolean;
    override?: boolean;
    [key: string]: any;
  }

  /** Options for AddMethod. */
  type MethodConfig = {
    /** true = call before predefined method; false (default) = call after */
    sequence?: boolean;
    /** true = replace predefined method entirely (where allowed) */
    override?: boolean;
    /** `this` binding used when Siebel Open UI calls methodDef */
    scope?: any;
    [key: string]: any;
  };
  type AddMethodOptions = MethodConfig;

  /** Options for AttachPMBinding / proxy-execute bindings. */
  type BindingConfig = {
    scope?: any;
    when?: (...args: any[]) => boolean;
    [key: string]: any;
  };
  type BindingOptions = BindingConfig;

  type PWState = "EDITABLE" | "ENABLE" | "SHOW" | "FOCUS";

  /* ---------------------------- Property maps for Get() --------------- */

  /** Properties available via Get() on an applet-level PM. */
  interface AppletPMProperties {
    GetActiveControl: string;
    GetAppletLabel: string;
    /** Spelled as in the source repo / Oracle doc table. */
    GetAppleLabel: string;
    GetAppletSummary: string;
    GetControls: Record<string, AppletControl>;
    GetDefaultFocusOnNew: string;
    GetDefaultFocusOnQuery: string;
    GetFullId: string;
    GetId: string;
    GetMode: string;
    GetName: string;
    GetPlaceholder: string;
    GetPrsrvControl: string;
    GetQueryModePrompt: string;
    GetRecordSet: Array<{ [fieldName: string]: any }>;
    GetSelection: number;
    GetTitle: string;
    GetUIEventMap: Array<{ ev: string; ar: any[] }>;
    IsInQueryMode: boolean;
    IsInQueryState: boolean;
    IsPure: boolean;
  }

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

  interface MenuPMProperties {
    GetObjectType: string;
    GetRepstrName: string;
    GetUIName: string;
    GetId: string;
    GetLabel: string;
  }

  /* ---------------------------- Presentation Model (pmodel.js) -------- */

  /** Base class for every Presentation Model. */
  class PresentationModel {
    constructor(propSet?: JSSPropertySet);

    /** Lifecycle: configure properties/methods/bindings here. Base Init runs before a derived Init. */
    Init(...args: any[]): void;
    /** Lifecycle: extract values from the initial server property set. */
    Setup(propertySet: JSSPropertySet): any;
    EndLife?(): void;

    /* Properties */
    /** Value of a property added via AddProperty or a built-in applet PM property. */
    Get<K extends keyof AppletPMProperties>(propertyName: K): AppletPMProperties[K];
    Get<T = any>(propertyName: string): T;
    /** Sets (or creates) a PM property value. */
    SetProperty<T = any>(propertyName: string, propertyValue: T): boolean;
    Set?(name: string, value: any): void;
    GetProperty?(name: string): any;
    /**
     * Adds a property retrievable via Get(). propertyValue may be a function
     * (derived property) - Get() then invokes it.
     */
    AddProperty<T = any>(propertyName: string, propertyValue: T | (() => T)): boolean;

    /* Methods */
    /**
     * Adds or customizes a PM method.
     * @returns true if added successfully.
     */
    AddMethod(methodName: string, methodDef: (...args: any[]) => any, methodConfig?: MethodConfig): boolean;
    /** Runs a predefined or custom PM method. Returns "undefined" (string) if the method does not exist. */
    ExecuteMethod<T = any>(methodName: string, ...args: any[]): T;
    CanInvokeMethod?(methodName: string): boolean;
    /** Calls a logical event; dispatches to handlers registered via AttachEventHandler. */
    OnControlEvent(eventName: string, ...eventArguments: any[]): any;

    /* Events, bindings, notifications */
    /** Attaches an event handler, invoked via OnControlEvent (LIFO across the inheritance chain). */
    AttachEventHandler(eventName: string, functionReference: (...args: any[]) => any): void;
    /** Attaches a handler for a server-sent notification (record created/deleted/modified, etc). */
    AttachNotificationHandler(notificationName: string, handler: (...args: any[]) => any): boolean;
    /** Runs methodToCall immediately after methodName finishes. */
    AttachPMBinding(methodName: string, methodToCall: (...args: any[]) => any, config?: BindingConfig): boolean;
    /** Runs after the applet proxy finishes processing a server reply. */
    AttachPostProxyExecuteBinding(
      methodToCall: string,
      binder: (methodName: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet) => any,
      config?: BindingConfig
    ): void;
    /** Runs before the applet proxy processes a server reply. */
    AttachPreProxyExecuteBinding(
      methodToCall: string,
      binder: (methodName: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet) => any,
      config?: BindingConfig
    ): void;
    /** Registers a custom validator for an event. */
    AddValidator(
      eventName: string,
      validator: (row: number, ctrl: AppletControl, val: any) => boolean
    ): boolean;
    /** Binds a communication method to a target method called after methodName finishes. */
    AddComponentCommunication(
      methodName: string,
      targetMethod: string,
      targetMethodConfig?: { scope?: any; args?: any[] }
    ): void;
    /** Adds a string retrievable via the locale object. */
    AddLocalString(id: string, customString: string): any;
    /** Gets a control template used to build a control's property set. */
    GetCtrlTemplate(controlName: string, displayName: string, controlType: any, columnIndex: number): any;

    /* Misc */
    GetObjName(): string;
    GetProxy<T = any>(): T;
    GetRenderer(): PhysicalRenderer;
    SetRenderer?(renderer: any): void;
    GetPM?(): PresentationModel;

    [key: string]: any;
  }

  /** Presentation model for applets (form or list). Table A-1: Callable / Bindable methods. */
  class AppletPresentationModel extends PresentationModel {
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
    /** Bindable. Runs after InvokeMethod finishes and the server call returns. */
    PostExecute(cmd: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet, lpcsa?: any): void;
    /** Bindable. Cancels the query dialog box. */
    ProcessCancelQueryPopup(): void;
    /** Bindable. Refreshes the applet in the client. */
    RefreshData(value: boolean): void;
    /** Bindable. Sets the applet to active state if not already active. */
    ResetAppletState(): void;
    /** Callable/Bindable. Sets the active control of the applet. */
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
  }
  /** Alias kept for the (misspelled) name used in the source repo. */
  type ApplePresentationModel = AppletPresentationModel;
  const ApplePresentationModel: typeof AppletPresentationModel;

  /** listpmodel.js - list applets. */
  class ListPresentationModel extends AppletPresentationModel {
    Get<K extends keyof ListPMProperties>(propertyName: K): ListPMProperties[K];
    Get<T = any>(propertyName: string): T;

    /** Bindable. Whether Siebel Open UI modified a control's value; returns new value. */
    CellChange(rowId: number, fieldName: string, value: any): any;
    /** Callable/Bindable. Selects a row. */
    HandleRowSelect(rowId: number, controlKey: boolean, shiftKey: boolean): boolean;
    /** Callable. Sorts a column. Asynchronous - cannot be bound. */
    OnClickSort(name: string, direction: "asc" | "desc"): void;
    /** Callable. Blurs (deactivates) a control. Requires prior OnCtrlFocus. */
    OnCtrlBlur(rowId: number, control: string, value: any): void;
    /** Callable. Brings a control into focus. Fails if another control is already active. */
    OnCtrlFocus(rowId: number, control: string, value: any): void;
    /** Callable. Drills down on a control. */
    OnDrillDown(controlName: string, rowId: number): boolean;
    /** Callable. Scrolls records. Async - cannot be bound. */
    OnVerticalScroll(scrollAction: "nxrc" | "pvrc" | "pgdn" | "pgup"): void;
    /** Bindable. Whether the list applet is in multiselect mode. */
    SetMultiSelectMode(bInMultiSelMode: boolean): void;
  }

  /** Menu presentation model. */
  class MenuPresentationModel extends PresentationModel {
    Get<K extends keyof MenuPMProperties>(propertyName: K): MenuPMProperties[K];
    Get<T = any>(propertyName: string): T;

    /** Returns a property set describing the menu and its menu items. */
    GetMenuPS(): JSSPropertySet;
    /** Creates a menu. */
    OnMenuInvoke(appletName: string, ...args: any[]): void;
    /** Runs when the user chooses a menu item. */
    ProcessMenuCommand(menuItemCommand: string): void;
    /** Binding-only method; signals menu display is complete. */
    ShowMenu(): void;
  }

  /* Other commonly extended PM classes (members via index signature) */
  class TreePresentationModel extends PresentationModel {}
  class ViewPresentationModel extends PresentationModel {}
  class FormPresentationModel extends AppletPresentationModel {}

  /* ---------------------------- Physical Renderer --------------------- */

  /** Core renderer lifecycle. */
  class BasePR {
    constructor(pm: PresentationModel);
    Init(...args: any[]): void;
    GetPM<T extends PresentationModel = PresentationModel>(): T;
    /** Downloads metadata/data to the client proxy and binds it to the UI. */
    BindData(searchData?: any, options?: any): void;
    /** Binds UI events to DOM elements, translating user actions into logical PM events. */
    BindEvents(controls?: Record<string, AppletControl>): void;
    /** Displays the physical control(s) corresponding to applet controls. */
    ShowUI(...args: any[]): void;
    /** Ends the life of the renderer - unbind events here. */
    EndLife(): void;
    [key: string]: any;
  }

  /** Base class every custom Physical Renderer extends. */
  class PhysicalRenderer extends BasePR {
    constructor(pm: PresentationModel);
    /** Enables a control. */
    EnableControl(controlName: string): void;
    /** Sets the value on the physical DOM instance of a control. */
    SetControlValue(control: AppletControl, value: any): void;
    GetPhysicalControlValue?<T = any>(control: AppletControl): T;
    GetUIWrapper(control: AppletControl): BasePlugInWrapper;
    /** Registers an additional PM binding from the PR. */
    AttachPMBinding(methodName: string, methodToCall: (...args: any[]) => any, config?: BindingConfig): any;
    ExecuteMethod<T = any>(methodName: string, ...args: any[]): T;
    GetProxy<T = any>(): T;
    GetRenderer<T = any>(): T;
    GetContainer?(): JQuery | HTMLElement | null;
    GetPMName?(): string;
    GetProfileAttr?(name: string): string;
    Bind?(): void;
    Unbind?(): void;
  }

  class JQGridRenderer extends PhysicalRenderer {}
  class ListRenderer extends PhysicalRenderer {}
  class TreeRenderer extends PhysicalRenderer {}

  /* ---------------------------- Plug-in Wrappers ---------------------- */

  /** Base Plug-in Wrapper; manages a single applet control's lifecycle. */
  class BasePlugInWrapper {
    constructor(control?: AppletControl, pm?: PresentationModel);
    Init?(): void;
    /** Gets the jQuery-wrapped DOM element(s) for the control. */
    GetEl(index?: number): JQuery | null;
    ShowUI(): void;
    BindEvents(): void;
    BindData(): void;
    EndLife(): void;
    SetValue(value: any, index?: number): void;
    GetValue(index?: number): any;
    BeginQuery(): void;
    EndQuery(): void;
    GetIconMap(): any;
    /**
     * Sets a DOM state on the associated instance(s).
     * @param flag true reverses the state (e.g. EDITABLE + true = NON-EDITABLE)
     */
    SetState(state: PWState | (string & {}), flag: boolean, index?: number): void;
    GetState?(state: string): any;
    [key: string]: any;
  }
  class BasePW extends BasePlugInWrapper {}
  class PluginWrapper extends BasePW {}
  class FieldPW extends BasePW {}
  class ListPW extends BasePW {}

  /* ---------------------------- Applet / Control ---------------------- */

  /** applet.js */
  class Applet {
    /** Adds a client-only control (no server-side representation). */
    AddClientControl(ctrlInfo: any): void;
    GetControls(): Record<string, AppletControl>;
    GetName(): string;
    GetRecordSet(): any[];
    GetSelection(): number;
    [key: string]: any;
  }

  /** appletcontrol.js */
  class AppletControl {
    /** 1 = case sensitive, 0 = not. */
    GetCaseSensitive(): 0 | 1;
    GetControlType?(): string;
    GetDisabledBmp(): string;
    GetDisplayName(): string;
    GetDispMode(): string;
    GetEDEnabled(): boolean;
    GetEnabledBmp(): string;
    GetFieldName(): string;
    GetHeight(): number;
    GetIndex?(): number;
    GetInputElement?(): HTMLElement | null;
    GetInputName(): string;
    GetJustification(): string;
    GetMaxSize(): number;
    GetMethodName(): string;
    GetName(): string;
    GetPMPropSet(): JSSPropertySet;
    GetPopupHeight(): number;
    GetPopupType(): string;
    GetPopupWidth(): number;
    GetProperty(name: string): any;
    GetPrompt(): string;
    GetRowId?(): string;
    GetUIType(): string;
    GetWidth(): number;
    HandleDeleteNotification(...args: any[]): void;
    IsBoundedPick(): boolean;
    IsCalc(): boolean;
    IsDynamic(): boolean;
    IsEditEnabled(): boolean;
    IsPostChanges?(): boolean;
    IsReadOnly?(): boolean;
    IsSortable(): boolean;
    NewRecord(...args: any[]): void;
    NotifyNewData(...args: any[]): void;
    PostLeaveField(...args: any[]): void;
    PreGetFormattedFieldValue(...args: any[]): void;
    SetIndex(index: number): void;
    SetProperty?(name: string, value: any): void;
    [key: string]: any;
  }

  /* ---------------------------- Facade-level utilities ---------------- */
  const PluginBuilder: SiebelPluginBuilder;
  const PhysicalRendererFactory: { [key: string]: any };
  const Utils: { [key: string]: any };
  const ComponentMgr: { [key: string]: any };
}

/* ======================================================================== */
/* Global convenience classes + SiebelOpenUI namespace (from IP23 toolkit)  */
/* ======================================================================== */
/** Global base constructors; normally derive via SiebelJS.Extend(). */
declare class PresentationModel extends SiebelAppFacade.PresentationModel {}
declare class PhysicalRenderer extends SiebelAppFacade.PhysicalRenderer {}

declare namespace SiebelOpenUI {
  type AnyFunction = (...args: any[]) => any;
  type Dictionary<T = any> = Record<string, T>;
  interface ReturnStructure {
    CancelOperation?: boolean;
    [key: string]: any;
  }
  type AddMethodOptions = SiebelAppFacade.MethodConfig;
  type PresentationModel = SiebelAppFacade.PresentationModel;
  type PhysicalRenderer = SiebelAppFacade.PhysicalRenderer;
  type Control = SiebelAppFacade.AppletControl;
  type AppletProxy = SiebelApplet;
  type Application = SiebelAppObject;
  type SiebelApp = SiebelAppStatic;
}

/**
 * Typical custom PM/PR constructor shapes.
 *   const CustomPM = function (pm) { ... };
 *   SiebelJS.Extend(CustomPM, SiebelAppFacade.PresentationModel);
 */
declare type SiebelPMConstructor = new (...args: any[]) => SiebelAppFacade.PresentationModel;
declare type SiebelPRConstructor = new (...args: any[]) => SiebelAppFacade.PhysicalRenderer;

/* ======================================================================== */
/* OPTIONAL: jQuery fallback stubs (from the IP23 toolkit)                  */
/* Delete everything below this banner if you install @types/jquery         */
/* (npm i -D @types/jquery), otherwise the two will conflict.               */
/* ======================================================================== */
declare const $: JQueryStatic;
declare const jQuery: JQueryStatic;

declare interface JQueryStatic {
  (selector?: string | Element | Document | Window | Node | any, context?: any): JQuery;
  ajax(settings: JQueryAjaxSettings): JQueryXHR;
  ajax(url: string, settings?: JQueryAjaxSettings): JQueryXHR;
  get(url: string, data?: any, success?: Function, dataType?: string): JQueryXHR;
  post(url: string, data?: any, success?: Function, dataType?: string): JQueryXHR;
  extend(...objects: any[]): any;
  each(collection: any, callback: (index: number, value: any) => any): any;
  [key: string]: any;
}

declare interface JQuery {
  length: number;
  [index: number]: HTMLElement;
  addClass(className: string): this;
  removeClass(className?: string): this;
  toggleClass(className: string, state?: boolean): this;
  hasClass(className: string): boolean;
  attr(name: string, value?: any): any;
  prop(name: string, value?: any): any;
  val(value?: any): any;
  text(value?: string): any;
  html(value?: string): any;
  append(content: any): this;
  prepend(content: any): this;
  before(content: any): this;
  after(content: any): this;
  empty(): this;
  remove(): this;
  find(selector: string): JQuery;
  closest(selector: string): JQuery;
  parent(selector?: string): JQuery;
  children(selector?: string): JQuery;
  on(events: string, handler: Function): this;
  on(events: string, selector: string, handler: Function): this;
  off(events?: string, selector?: string, handler?: Function): this;
  bind(events: string, handler: Function): this;
  unbind(events?: string, handler?: Function): this;
  click(handler?: Function): this;
  change(handler?: Function): this;
  each(callback: (index: number, element: HTMLElement) => any): this;
  data(key?: string, value?: any): any;
  css(property: string, value?: any): any;
  show(): this;
  hide(): this;
  [key: string]: any;
}

declare interface JQueryAjaxSettings {
  url?: string;
  type?: string;
  method?: string;
  data?: any;
  dataType?: string;
  contentType?: string;
  success?: Function;
  error?: Function;
  complete?: Function;
  timeout?: number;
  [key: string]: any;
}

declare interface JQueryXHR {
  done(callback: Function): this;
  fail(callback: Function): this;
  always(callback: Function): this;
  abort?(): void;
  [key: string]: any;
}
