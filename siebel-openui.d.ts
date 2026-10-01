/**
 * Siebel Open UI - IntelliSense declarations for PM / PR / PW development
 * ------------------------------------------------------------------------
 * Unofficial, community-style typings compiled from the documented Open UI
 * client API. Oracle does not ship an official .d.ts, so verify members
 * against your IP version. Every class keeps an index signature
 * ([key: string]: any) so undeclared members never raise errors.
 *
 * Usage: place next to jsconfig.json and add it to "include".
 */

/* ======================================================================== */
/* AMD loader                                                               */
/* ======================================================================== */
declare function define(deps: string[], factory: (...args: any[]) => any): void;
declare function define(name: string, deps: string[], factory: (...args: any[]) => any): void;
declare function require(deps: string[], callback: (...args: any[]) => void): void;

/* ======================================================================== */
/* SiebelJS                                                                 */
/* ======================================================================== */
declare namespace SiebelJS {
  /** Creates the namespace object, e.g. "SiebelAppFacade.MyPM". */
  function Namespace(ns: string): void;
  /** Prototype inheritance helper; also sets Sub.superclass. */
  function Extend(subClass: Function, superClass: Function): void;
  /** Writes to the browser console / Siebel client log. */
  function Log(...msg: any[]): void;
  function DebugLog(...msg: any[]): void;
  /** Declares a dependency on a namespace. */
  function Dependency(name: string): void;
}

/* ======================================================================== */
/* Constants                                                                */
/* ======================================================================== */
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
interface SiebelControl {
  GetName(): string;
  GetDisplayName(): string;
  GetFieldName(): string;
  GetMethodName(): string;
  GetUIType(): string;
  GetInputName(): string;
  GetControlType?(): string;
  GetProperty(name: string): any;
  IsReadOnly?(): boolean;
  IsPostChanges?(): boolean;
  GetPopupType?(): string;
  GetHeight?(): string;
  GetWidth?(): string;
  GetRowId?(): string;
  GetIndex?(): number;
  [key: string]: any;
}

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

/* ======================================================================== */
/* SiebelApp                                                                */
/* ======================================================================== */
interface SiebelAppObject {
  GetActiveView(): SiebelView;
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
/* SiebelAppFacade                                                          */
/* ======================================================================== */
declare namespace SiebelAppFacade {

  /** Options for AddMethod. */
  interface AddMethodOptions {
    /** true = run after the base method, false = before. */
    sequence?: boolean;
    /** "this" context for the handler. */
    scope?: any;
    /** true = replace the base method instead of wrapping it. */
    override?: boolean;
  }

  /** Options for AttachPMBinding / proxy-execute bindings. */
  interface BindingOptions {
    scope?: any;
    [key: string]: any;
  }

  /* ---------------------------- Presentation Model -------------------- */
  class PresentationModel {
    constructor(propSet?: SiebelPropertySet);

    Init(): void;
    Setup(propSet: SiebelPropertySet): void;
    EndLife?(): void;

    /* Properties */
    Get(name: "GetName"): string;
    Get(name: "GetFullId"): string;
    Get(name: "GetControls"): { [controlName: string]: SiebelControl };
    Get(name: "GetRecordSet"): Array<{ [fieldName: string]: any }>;
    Get(name: "GetSelection"): number;
    Get(name: "GetRowListRowCount"): number;
    Get(name: "GetPlaceholder"): string;
    Get(name: "IsInQueryState"): boolean;
    Get(name: "GetActiveControl"): SiebelControl;
    Get(name: "GetBusComp"): SiebelBusComp;
    Get(name: string): any;
    Set(name: string, value: any): void;
    AddProperty(name: string, value: any): void;
    SetProperty?(name: string, value: any): void;
    GetProperty?(name: string): any;

    /* Methods */
    AddMethod(name: string, fn: (...args: any[]) => any, opts?: AddMethodOptions): void;
    ExecuteMethod(name: string, ...args: any[]): any;
    CanInvokeMethod?(name: string): boolean;
    OnControlEvent(method: string, ...args: any[]): any;

    /* Bindings & notifications */
    AttachPMBinding(propertyName: string, fn: (...args: any[]) => void, opts?: BindingOptions): void;
    AttachNotificationHandler(type: string, fn: (propSet: SiebelPropertySet) => void): void;
    AttachPreProxyExecuteBinding(methodName: string, fn: (methodName: string, inputPS: SiebelPropertySet, outputPS: SiebelPropertySet) => any, opts?: BindingOptions): void;
    AttachPostProxyExecuteBinding(methodName: string, fn: (methodName: string, inputPS: SiebelPropertySet, outputPS: SiebelPropertySet) => any, opts?: BindingOptions): void;

    /* Misc */
    GetObjName(): string;
    GetRenderer(): PhysicalRenderer;
    SetRenderer?(renderer: any): void;
    GetPM?(): PresentationModel;

    [key: string]: any;
  }

  class ListPresentationModel extends PresentationModel {
    Get(name: "GetListOfColumns"): SiebelControl[];
    Get(name: "GetRowsSelectedArray"): boolean[];
    Get(name: "GetRowListRowCount"): number;
    Get(name: "GetRecordSet"): Array<{ [fieldName: string]: any }>;
    Get(name: "GetSelection"): number;
    Get(name: string): any;
    OnVerticalScroll?(...args: any[]): any;
    OnDrillDown?(controlName: string, rowIndex: number): any;
  }

  /* Other commonly extended PM classes (members via index signature) */
  class TreePresentationModel extends PresentationModel {}
  class ViewPresentationModel extends PresentationModel {}
  class FormPresentationModel extends PresentationModel {}

  /* ---------------------------- Physical Renderer --------------------- */
  class BasePR {
    constructor(pm: PresentationModel);
    Init(): void;
    GetPM(): PresentationModel;
    BindEvents(): void;
    BindData(bRefresh?: boolean): void;
    ShowUI(): void;
    EndLife(): void;
    [key: string]: any;
  }

  class PhysicalRenderer extends BasePR {
    constructor(pm: PresentationModel);
    GetUIWrapper(control: SiebelControl): PluginWrapper;
    /** Registers an additional PM binding from the PR. */
    AttachPMBinding?(propertyName: string, fn: (...args: any[]) => void, opts?: BindingOptions): void;
    GetPMName?(): string;
    GetProfileAttr?(name: string): string;
  }

  class JQGridRenderer extends PhysicalRenderer {}
  class ListRenderer extends PhysicalRenderer {}
  class TreeRenderer extends PhysicalRenderer {}

  /* ---------------------------- Plugin wrappers ----------------------- */
  class BasePW {
    constructor(control: SiebelControl, pm?: PresentationModel);
    Init(): void;
    GetEl(): JQuery | HTMLElement | any;
    SetValue(value: any): void;
    GetValue(): any;
    SetState(state: string, value: any): void;
    GetState?(state: string): any;
    ShowUI(): void;
    BindEvents(): void;
    BindData(): void;
    EndLife(): void;
    [key: string]: any;
  }
  class PluginWrapper extends BasePW {}
  class FieldPW extends BasePW {}
  class ListPW extends BasePW {}

  /* ---------------------------- Facade-level utilities ---------------- */
  const PluginBuilder: {
    AttachPW(controlType: string, pwClass: any, ...rest: any[]): void;
    AttachEventsToPW?(...args: any[]): void;
    [key: string]: any;
  };
  const PhysicalRendererFactory: { [key: string]: any };
  const Utils: { [key: string]: any };
  const ComponentMgr: { [key: string]: any };
}

/* ======================================================================== */
/* jQuery: install typings for $ completion                                 */
/*   npm i -D @types/jquery                                                 */
/* ======================================================================== */
interface JQuery { [key: string]: any }
