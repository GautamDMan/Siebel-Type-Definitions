/**
 * @file Unofficial JSDoc type definitions for the Siebel OpenUI client-side
 * Presentation Model (PM) / Physical Renderer (PR) / Plug-in Wrapper (PW) API.
 *
 * Source: Oracle "Configuring Siebel Open UI" guide, chapter "Application
 * Programming Interface". Method signatures are stable across IP2015 through
 * Siebel CRM 23.7 Update (IP23) and later (24.6 / 24.9) — no PM/PR method
 * signature changes were introduced in those updates.
 *
 * This is a companion to siebel-openui-pm-pr.d.ts, written as pure JSDoc so
 * plain-JavaScript projects (checked with `// @ts-check` or VS Code's JS
 * IntelliSense) get autocomplete/hover docs without a TypeScript build step.
 *
 * These are NOT provided by Oracle. Verify against your own IP23 client JS
 * (presentationmodel.js / phyrenderer.js / siebelappfacade.js) for full
 * fidelity — some internal/undocumented members are intentionally omitted.
 *
 * Usage: reference this file from jsconfig.json ("include") or add
 *   /** @type {typeof import('./siebel-openui-pm-pr.jsdoc.js')} *\/
 * at the top of your custom PM/PR files, or simply keep it open in the
 * same VS Code workspace — the ambient typedefs below are picked up
 * automatically for .js files with `// @ts-check`.
 */

// @ts-check

/**
 * @typedef {Object} JSSPropertySet
 * @property {(index: number) => JSSPropertySet} GetChild
 * @property {(type: string) => (JSSPropertySet|null)} GetChildByType
 * @property {(name: string) => string} GetProperty
 * @property {(name: string, value: string) => void} SetProperty
 * @property {() => number} GetChildCount
 * @property {() => string} GetType
 */

/**
 * @typedef {Object} MethodConfig
 * @property {boolean} [sequence] true = call before predefined method; false (default) = call after
 * @property {boolean} [override] true = replace predefined method entirely (where allowed)
 * @property {*} [scope] `this` binding used when Siebel Open UI calls methodDef
 */

/**
 * @typedef {Object} BindingConfig
 * @property {*} [scope]
 * @property {(...args: any[]) => boolean} [when]
 */

/**
 * @typedef {Object} ListColumnDescriptor
 * @property {string} name
 * @property {string} controlType
 * @property {boolean} isLink
 * @property {number} index
 * @property {boolean} bCanUpdate
 * @property {AppletControl} control
 */

/**
 * @typedef {'EDITABLE'|'ENABLE'|'SHOW'|'FOCUS'} PWState
 */

// ---------------------------------------------------------------------
// PresentationModel — base class (pmodel.js)
// ---------------------------------------------------------------------

/**
 * Base class for every Presentation Model. Defined in pmodel.js.
 * @constructor
 */
function PresentationModel() {}

/**
 * Binds a communication method to a target method that Siebel Open UI
 * calls after methodName finishes, in the PM's context.
 * @param {string} methodName
 * @param {string} targetMethod
 * @param {{scope?: *, args?: any[]}} [targetMethodConfig]
 * @returns {void}
 */
PresentationModel.prototype.AddComponentCommunication = function (methodName, targetMethod, targetMethodConfig) {};

/**
 * Adds a text string retrievable via the locale object.
 * @param {string} id
 * @param {string} customString
 * @returns {void}
 */
PresentationModel.prototype.AddLocalString = function (id, customString) {};

/**
 * Adds a method to the presentation model. If a method with the same name
 * already exists (predefined), the new one customizes it, subject to
 * `methodConfig.sequence` / `methodConfig.override`.
 * @param {string} methodName
 * @param {(...args: any[]) => any} methodDef
 * @param {MethodConfig} [methodConfig]
 * @returns {boolean} true if added successfully
 */
PresentationModel.prototype.AddMethod = function (methodName, methodDef, methodConfig) { return true; };

/**
 * Adds a property to the presentation model, retrievable via Get().
 * A subsequent call with the same propertyName overwrites the value.
 * propertyValue may itself be a function (derived property) — Get()
 * then invokes it and returns its result.
 * @param {string} propertyName
 * @param {*|(() => any)} propertyValue
 * @returns {boolean} true if added successfully
 */
PresentationModel.prototype.AddProperty = function (propertyName, propertyValue) { return true; };

/**
 * Registers a custom validator for an event.
 * @param {string} eventName
 * @param {(row: number, ctrl: AppletControl, val: any) => boolean} validator
 * @returns {boolean} true if validation passed
 */
PresentationModel.prototype.AddValidator = function (eventName, validator) { return true; };

/**
 * Attaches an event handler. Siebel Open UI invokes it via OnControlEvent.
 * Handlers run LIFO across the inheritance chain.
 * @param {string} eventName
 * @param {(...args: any[]) => any} functionReference
 * @returns {void}
 */
PresentationModel.prototype.AttachEventHandler = function (eventName, functionReference) {};

/**
 * Attaches a handler for a server-sent notification (e.g. record
 * created/deleted/modified) to an applet.
 * @param {string} notificationName
 * @param {(...args: any[]) => any} handler
 * @returns {boolean}
 */
PresentationModel.prototype.AttachNotificationHandler = function (notificationName, handler) { return true; };

/**
 * Binds a method to run immediately after an existing method finishes
 * processing. Commonly used from the Physical Renderer's Init to react
 * to PM state changes.
 * @param {string} methodName
 * @param {(...args: any[]) => any} methodToCall
 * @param {BindingConfig} [config]
 * @returns {boolean}
 */
PresentationModel.prototype.AttachPMBinding = function (methodName, methodToCall, config) { return true; };

/**
 * Runs after the applet proxy finishes processing a server reply.
 * @param {string} methodToCall
 * @param {(methodName: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet) => void} binder
 * @returns {void}
 */
PresentationModel.prototype.AttachPostProxyExecuteBinding = function (methodToCall, binder) {};

/**
 * Runs before the applet proxy processes a server reply (pre-PostExecute).
 * @param {string} methodToCall
 * @param {(methodName: string, inputPS: JSSPropertySet, outputPS: JSSPropertySet) => void} binder
 * @returns {void}
 */
PresentationModel.prototype.AttachPreProxyExecuteBinding = function (methodToCall, binder) {};

/**
 * Runs a predefined or custom PM method, resolving dependency chains.
 * @param {string} methodName
 * @param {...any} args
 * @returns {*} the method's return value, or the string "undefined" if the method does not exist
 */
PresentationModel.prototype.ExecuteMethod = function (methodName, ...args) {};

/**
 * Returns the value of a property added via AddProperty.
 * @param {string} propertyName
 * @returns {*}
 */
PresentationModel.prototype.Get = function (propertyName) {};

/**
 * Gets a control template used to build a control's property set.
 * @param {string} controlName
 * @param {string} displayName
 * @param {string} controlType
 * @param {number} columnIndex
 * @returns {void}
 */
PresentationModel.prototype.GetCtrlTemplate = function (controlName, displayName, controlType, columnIndex) {};

/**
 * Lifecycle. Configure properties/methods/bindings here (AddMethod,
 * AttachNotificationHandler, AttachPMBinding, etc.). Predefined Init
 * always runs before a derived class's Init.
 * @returns {void}
 */
PresentationModel.prototype.Init = function () {};

/**
 * Calls a logical event; dispatches to handlers via AttachEventHandler.
 * @param {string} eventName
 * @param {...any} eventArguments
 * @returns {*}
 */
PresentationModel.prototype.OnControlEvent = function (eventName, ...eventArguments) {};

/**
 * Sets (or creates, if absent) the value of a PM property.
 * @param {string} propertyName
 * @param {*} propertyValue
 * @returns {boolean}
 */
PresentationModel.prototype.SetProperty = function (propertyName, propertyValue) { return true; };

/**
 * Lifecycle. Extracts values from the initial server property set into PM
 * properties. Predefined Setup always runs before a derived class's Setup.
 * @param {JSSPropertySet} propertySet
 * @returns {void}
 */
PresentationModel.prototype.Setup = function (propertySet) {};

/**
 * @returns {*} the proxy object for the currently active/host object
 */
PresentationModel.prototype.GetProxy = function () {};

/**
 * @returns {PhysicalRenderer}
 */
PresentationModel.prototype.GetRenderer = function () {};

// ---------------------------------------------------------------------
// Presentation Model — Applets (extends PresentationModel)
// ---------------------------------------------------------------------

/**
 * @typedef {Object} AppletPMProperties
 * @property {string} GetActiveControl
 * @property {string} GetAppleLabel
 * @property {string} GetAppletSummary
 * @property {Object.<string, AppletControl>} GetControls
 * @property {string} GetDefaultFocusOnNew
 * @property {string} GetDefaultFocusOnQuery
 * @property {string} GetFullId
 * @property {string} GetId
 * @property {string} GetMode
 * @property {string} GetName
 * @property {string} GetPrsrvControl
 * @property {string} GetQueryModePrompt
 * @property {any[]} GetRecordset
 * @property {number} GetSelection
 * @property {string} GetTitle
 * @property {Array<{ev: string, ar: any[]}>} GetUIEventMap
 * @property {boolean} IsInQueryMode
 * @property {boolean} IsPure
 */

/**
 * Presentation model used for applets (form or list). Extends PresentationModel.
 * @constructor
 * @extends PresentationModel
 */
function ApplePresentationModel() {}
ApplePresentationModel.prototype = Object.create(PresentationModel.prototype);

/** Callable. Whether Siebel Open UI can invoke method_name.
 * @param {string} methodName @returns {boolean} */
ApplePresentationModel.prototype.CanInvokeMethod = function (methodName) { return true; };

/** Callable. Whether the user can navigate to a control.
 * @param {string} fieldName @returns {boolean} */
ApplePresentationModel.prototype.CanNavigate = function (fieldName) { return true; };

/** Callable. Whether a control can be updated.
 * @param {string} controlName @returns {boolean} */
ApplePresentationModel.prototype.CanUpdate = function (controlName) { return true; };

/** Bindable. Updates objects in the user interface.
 * @returns {void} */
ApplePresentationModel.prototype.ExecuteUIUpdate = function () {};

/** Bindable. Modifies the value of a field.
 * @param {AppletControl} control @param {*} fieldValue @returns {void} */
ApplePresentationModel.prototype.FieldChange = function (control, fieldValue) {};

/** Bindable. Sets focus on the first control.
 * @returns {void} */
ApplePresentationModel.prototype.FocusFirstControl = function () {};

/** Callable. Returns a control instance.
 * @param {string} controlName @returns {AppletControl} */
ApplePresentationModel.prototype.GetControl = function (controlName) {};

/** Callable. Gets the control id of a toggle applet.
 * @returns {string} */
ApplePresentationModel.prototype.GetControlId = function () { return ''; };

/** Callable. Returns the value of a field.
 * @param {string} fieldName @returns {*} */
ApplePresentationModel.prototype.GetFieldValue = function (fieldName) {};

/** Callable. Returns the (locale-)formatted value of a control.
 * @param {string} controlName @param {boolean} fromWorkset @param {number} index @returns {string} */
ApplePresentationModel.prototype.GetFormattedFieldValue = function (controlName, fromWorkset, index) { return ''; };

/** Bindable. Gets the value of a physical control from the PR.
 * @param {AppletControl} control @returns {*} */
ApplePresentationModel.prototype.GetPhysicalControlValue = function (control) {};

/** Callable. Calls a method on the applet proxy.
 * @param {string} name @param {JSSPropertySet} [inputs] @param {boolean|Object} [asyncOrConfig] @returns {JSSPropertySet} */
ApplePresentationModel.prototype.InvokeMethod = function (name, inputs, asyncOrConfig) {};

/** Bindable. Invoked on a can-invoke notification update from the server.
 * @returns {void} */
ApplePresentationModel.prototype.InvokeStateChange = function () {};

/** Callable. Whether the field behind a control is private.
 * @param {string} fieldName @returns {boolean} */
ApplePresentationModel.prototype.IsPrivateField = function (fieldName) { return false; };

/**
 * Callable. Whether Siebel Open UI has removed focus from a field.
 * @param {AppletControl} control
 * @param {*} value
 * @param {boolean} doNotLeave true = keep focus on control; false = allow leave
 * @returns {boolean}
 */
ApplePresentationModel.prototype.LeaveField = function (control, value, doNotLeave) { return true; };

/** Bindable. Returns properties of a new file attachment.
 * @returns {*} */
ApplePresentationModel.prototype.NewFileAttachment = function () {};

/**
 * Bindable. Runs after InvokeMethod finishes and the server call returns.
 * The only method customizable/overridable on this PM class.
 * @param {string} cmd @param {JSSPropertySet} inputPS @param {JSSPropertySet} outputPS @param {*} [lpcsa] @returns {void}
 */
ApplePresentationModel.prototype.PostExecute = function (cmd, inputPS, outputPS, lpcsa) {};

/** Bindable. Cancels the query dialog box.
 * @returns {void} */
ApplePresentationModel.prototype.ProcessCancelQueryPopup = function () {};

/** Bindable. Refreshes the applet in the client.
 * @param {boolean} value @returns {void} */
ApplePresentationModel.prototype.RefreshData = function (value) {};

/** Bindable. Sets the applet to active state if not already active.
 * @returns {void} */
ApplePresentationModel.prototype.ResetAppletState = function () {};

/**
 * Callable/Bindable. Sets the active control of the applet. Not
 * recommended to call directly outside of framework context.
 * @param {string|null} controlName @returns {void}
 */
ApplePresentationModel.prototype.SetActiveControl = function (controlName) {};

/** Callable. Sets the default-focus flag.
 * @returns {void} */
ApplePresentationModel.prototype.SetFocusDefaultControl = function () {};

/** Bindable. Sets highlight state for the active applet.
 * @param {boolean} isActive @param {*} [newActiveApplet] @returns {void} */
ApplePresentationModel.prototype.SetHighlightState = function (isActive, newActiveApplet) {};

/** Callable. Toggles update-conditional processing.
 * @param {boolean} condition @returns {void} */
ApplePresentationModel.prototype.SetUpdateConditionals = function (condition) {};

/** Callable. Displays the currency pick applet.
 * @returns {void} */
ApplePresentationModel.prototype.ShowPickPopup = function () {};

/** Bindable. Displays a dialog for calculator/date/date-time controls.
 * @param {AppletControl} control @returns {void} */
ApplePresentationModel.prototype.ShowPopup = function (control) {};

/** Bindable. Makes a record the active record.
 * @returns {void} */
ApplePresentationModel.prototype.ShowSelection = function () {};

/** Bindable. Updates an applet message per server-side changes.
 * @returns {void} */
ApplePresentationModel.prototype.UpdateAppletMessage = function () {};

/** Bindable. Runs when Siebel Open UI displays the applet.
 * @returns {void} */
ApplePresentationModel.prototype.UpdateConditionals = function () {};

/** Bindable. Updates currency-calculation info.
 * @param {number} index @param {*} args @returns {void} */
ApplePresentationModel.prototype.UpdateCurrencyCalcInfo = function (index, args) {};

/** Bindable. Updates List-of-Values info sent from the server.
 * @param {string} field @param {boolean} replace @param {any[]} values @param {number} index @returns {void} */
ApplePresentationModel.prototype.UpdateQuickPickInfo = function (field, replace, values, index) {};

/** Bindable. Handles notification updates from the server.
 * @returns {void} */
ApplePresentationModel.prototype.UpdateStateChange = function () {};

/**
 * @param {keyof AppletPMProperties | string} propertyName
 * @returns {*}
 */
ApplePresentationModel.prototype.Get = function (propertyName) {};

// ---------------------------------------------------------------------
// Presentation Model — List Applets (extends ApplePresentationModel)
// ---------------------------------------------------------------------

/**
 * @typedef {AppletPMProperties & {
 *   GetBeginRow: number,
 *   GetListOfColumns: Object.<string, ListColumnDescriptor>,
 *   GetRowIdentifier: string,
 *   GetRowListRowCount: number,
 *   GetRowsSelectedArray: boolean[],
 *   HasHierarchy: boolean
 * }} ListPMProperties
 */

/**
 * Defined in listpmodel.js; used for list applets.
 * @constructor
 * @extends ApplePresentationModel
 */
function ListPresentationModel() {}
ListPresentationModel.prototype = Object.create(ApplePresentationModel.prototype);

/** Bindable. Whether Siebel Open UI modified a control's value; returns new value.
 * @param {number} rowId @param {string} fieldName @param {*} value @returns {*} */
ListPresentationModel.prototype.CellChange = function (rowId, fieldName, value) {};

/** Callable/Bindable. Selects a row.
 * @param {number} rowId @param {boolean} controlKey @param {boolean} shiftKey @returns {boolean} */
ListPresentationModel.prototype.HandleRowSelect = function (rowId, controlKey, shiftKey) { return true; };

/** Callable. Sorts a column. Asynchronous — cannot be bound.
 * @param {string} name @param {'asc'|'desc'} direction @returns {void} */
ListPresentationModel.prototype.OnClickSort = function (name, direction) {};

/** Callable. Blurs (deactivates) a control. Requires prior OnCtrlFocus.
 * @param {number} rowId @param {string} control @param {*} value @returns {void} */
ListPresentationModel.prototype.OnCtrlBlur = function (rowId, control, value) {};

/** Callable. Brings a control into focus. Fails if another control is already active.
 * @param {number} rowId @param {string} control @param {*} value @returns {void} */
ListPresentationModel.prototype.OnCtrlFocus = function (rowId, control, value) {};

/** Callable. Drills down on a control.
 * @param {string} controlName @param {number} rowId @returns {boolean} */
ListPresentationModel.prototype.OnDrillDown = function (controlName, rowId) { return true; };

/** Callable. Scrolls records. Asynchronous — cannot be bound.
 * @param {'nxrc'|'pvrc'|'pgdn'|'pgup'} scrollAction @returns {void} */
ListPresentationModel.prototype.OnVerticalScroll = function (scrollAction) {};

/** Bindable. Whether the list applet is in multiselect mode.
 * @param {boolean} bInMultiSelMode @returns {void} */
ListPresentationModel.prototype.SetMultiSelectMode = function (bInMultiSelMode) {};

/**
 * @param {keyof ListPMProperties | string} propertyName
 * @returns {*}
 */
ListPresentationModel.prototype.Get = function (propertyName) {};

// ---------------------------------------------------------------------
// Presentation Model — Menus
// ---------------------------------------------------------------------

/**
 * @constructor
 * @extends PresentationModel
 */
function MenuPresentationModel() {}
MenuPresentationModel.prototype = Object.create(PresentationModel.prototype);

/** Returns a property set describing the menu and its menu items.
 * @returns {JSSPropertySet} */
MenuPresentationModel.prototype.GetMenuPS = function () {};

/** Creates a menu.
 * @param {string} appletName @param {...any} args @returns {void} */
MenuPresentationModel.prototype.OnMenuInvoke = function (appletName, ...args) {};

/** Runs when the user chooses a menu item.
 * @param {string} menuItemCommand @returns {void} */
MenuPresentationModel.prototype.ProcessMenuCommand = function (menuItemCommand) {};

/** Binding-only method; signals menu display is complete.
 * @returns {void} */
MenuPresentationModel.prototype.ShowMenu = function () {};

// ---------------------------------------------------------------------
// PhysicalRenderer — base class
// ---------------------------------------------------------------------

/**
 * Base class every custom Physical Renderer extends.
 * @constructor
 * @param {PresentationModel} pm
 */
function PhysicalRenderer(pm) {}

/**
 * Lifecycle. Downloads metadata/data to the client proxy and binds it to
 * the UI. Must be defined by every PR (directly or via superclass).
 * @param {*} [searchData]
 * @param {*} [options]
 * @returns {void}
 */
PhysicalRenderer.prototype.BindData = function (searchData, options) {};

/**
 * Lifecycle. Binds UI events to physical DOM elements, translating user
 * actions into logical PM events. Must be defined by every PR.
 * @param {Object.<string, AppletControl>} [controls]
 * @returns {void}
 */
PhysicalRenderer.prototype.BindEvents = function (controls) {};

/** Enables a control.
 * @param {string} controlName @returns {void} */
PhysicalRenderer.prototype.EnableControl = function (controlName) {};

/** Lifecycle. Ends the life of the renderer — unbind events here.
 * @returns {void} */
PhysicalRenderer.prototype.EndLife = function () {};

/** @returns {PresentationModel} the associated PresentationModel instance */
PhysicalRenderer.prototype.GetPM = function () {};

/** Sets the value on the physical DOM instance of a control.
 * @param {AppletControl} control @param {*} value @returns {void} */
PhysicalRenderer.prototype.SetControlValue = function (control, value) {};

/**
 * Lifecycle. Displays the physical control(s) that correspond to applet
 * controls. Must be defined by every PR.
 * @returns {void}
 */
PhysicalRenderer.prototype.ShowUI = function () {};

// ---------------------------------------------------------------------
// Plug-in Wrapper — base class (basepw)
// ---------------------------------------------------------------------

/**
 * Base Plug-in Wrapper class; manages a single applet control's lifecycle.
 * @constructor
 */
function BasePlugInWrapper() {}

/** Gets the jQuery-wrapped DOM element(s) for the control.
 * @param {number} [index] @returns {*} jQuery object or null */
BasePlugInWrapper.prototype.GetEl = function (index) {};

/** Lifecycle. Show-related setup for the control.
 * @returns {void} */
BasePlugInWrapper.prototype.ShowUI = function () {};

/** Lifecycle. Attaches events to the control's DOM instance.
 * @returns {void} */
BasePlugInWrapper.prototype.BindEvents = function () {};

/** Lifecycle. Initializes data on the control's DOM instance.
 * @returns {void} */
BasePlugInWrapper.prototype.BindData = function () {};

/** Lifecycle. Ends the life of the plug-in wrapper.
 * @returns {void} */
BasePlugInWrapper.prototype.EndLife = function () {};

/** Sets the value in the DOM instance of the control.
 * @param {*} value @param {number} [index] @returns {void} */
BasePlugInWrapper.prototype.SetValue = function (value, index) {};

/** Gets the value of the control field from the DOM.
 * @param {number} [index] @returns {*} */
BasePlugInWrapper.prototype.GetValue = function (index) {};

/** Signals the wrapper is entering query mode.
 * @returns {void} */
BasePlugInWrapper.prototype.BeginQuery = function () {};

/** Signals the wrapper is exiting query mode.
 * @returns {void} */
BasePlugInWrapper.prototype.EndQuery = function () {};

/** Returns any configured icon map for this control.
 * @returns {*} */
BasePlugInWrapper.prototype.GetIconMap = function () {};

/**
 * Sets a DOM state on the associated instance(s).
 * @param {PWState} state
 * @param {boolean} flag true reverses the state (e.g. EDITABLE + true = NON-EDITABLE)
 * @param {number} [index]
 * @returns {void}
 */
BasePlugInWrapper.prototype.SetState = function (state, flag, index) {};

// ---------------------------------------------------------------------
// Applet class (applet.js)
// ---------------------------------------------------------------------

/** @constructor */
function Applet() {}

/** Adds a client-only control (no server-side representation).
 * @param {*} ctrlInfo @returns {void} */
Applet.prototype.AddClientControl = function (ctrlInfo) {};

/** Returns the set of controls the applet uses.
 * @returns {Object.<string, AppletControl>} */
Applet.prototype.GetControls = function () { return {}; };

/** Returns the applet's name.
 * @returns {string} */
Applet.prototype.GetName = function () { return ''; };

/** Returns the current record set displayed in the applet.
 * @returns {any[]} */
Applet.prototype.GetRecordSet = function () { return []; };

/** Returns the index of the active row.
 * @returns {number} */
Applet.prototype.GetSelection = function () { return 0; };

// ---------------------------------------------------------------------
// Applet Control class (appletcontrol.js) — partial per Oracle doc
// ---------------------------------------------------------------------

/** @constructor */
function AppletControl() {}

/** @returns {0|1} 1 = case sensitive, 0 = not */
AppletControl.prototype.GetCaseSensitive = function () { return 0; };
/** @returns {string} */
AppletControl.prototype.GetDisabledBmp = function () { return ''; };
/** @returns {string} */
AppletControl.prototype.GetDisplayName = function () { return ''; };
/** @returns {string} */
AppletControl.prototype.GetDispMode = function () { return ''; };
/** @returns {boolean} */
AppletControl.prototype.GetEDEnabled = function () { return false; };
/** @returns {string} */
AppletControl.prototype.GetEnabledBmp = function () { return ''; };
/** @returns {string} */
AppletControl.prototype.GetFieldName = function () { return ''; };
/** @returns {number} */
AppletControl.prototype.GetHeight = function () { return 0; };
/** @returns {string} */
AppletControl.prototype.GetInputName = function () { return ''; };
/** @returns {string} */
AppletControl.prototype.GetJustification = function () { return ''; };
/** @returns {number} */
AppletControl.prototype.GetMaxSize = function () { return 0; };
/** @returns {string} */
AppletControl.prototype.GetMethodName = function () { return ''; };
/** @returns {string} */
AppletControl.prototype.GetName = function () { return ''; };
/** @returns {JSSPropertySet} */
AppletControl.prototype.GetPMPropSet = function () {};
/** @returns {number} */
AppletControl.prototype.GetPopupHeight = function () { return 0; };
/** @returns {string} */
AppletControl.prototype.GetPopupType = function () { return ''; };
/** @returns {number} */
AppletControl.prototype.GetPopupWidth = function () { return 0; };
/** @returns {string} */
AppletControl.prototype.GetPrompt = function () { return ''; };
/** @returns {string} */
AppletControl.prototype.GetUIType = function () { return ''; };
/** @returns {number} */
AppletControl.prototype.GetWidth = function () { return 0; };
/** @param {...any} args @returns {void} */
AppletControl.prototype.HandleDeleteNotification = function (...args) {};
/** @returns {boolean} */
AppletControl.prototype.IsBoundedPick = function () { return false; };
/** @returns {boolean} */
AppletControl.prototype.IsCalc = function () { return false; };
/** @returns {boolean} */
AppletControl.prototype.IsDynamic = function () { return false; };
/** @returns {boolean} */
AppletControl.prototype.IsEditEnabled = function () { return false; };
/** @returns {boolean} */
AppletControl.prototype.IsSortable = function () { return false; };
/** @param {...any} args @returns {void} */
AppletControl.prototype.NewRecord = function (...args) {};
/** @param {...any} args @returns {void} */
AppletControl.prototype.NotifyNewData = function (...args) {};
/** @param {...any} args @returns {void} */
AppletControl.prototype.PreGetFormattedFieldValue = function (...args) {};
/** @param {...any} args @returns {void} */
AppletControl.prototype.PostLeaveField = function (...args) {};
/** @param {number} index @returns {void} */
AppletControl.prototype.SetIndex = function (index) {};

// ---------------------------------------------------------------------
// Namespace registration helpers (SiebelAppFacade.*)
// ---------------------------------------------------------------------

/** @namespace SiebelAppFacade */
var SiebelAppFacade = SiebelAppFacade || {};
SiebelAppFacade.PresentationModel = PresentationModel;
SiebelAppFacade.ApplePresentationModel = ApplePresentationModel;
SiebelAppFacade.ListPresentationModel = ListPresentationModel;
SiebelAppFacade.MenuPresentationModel = MenuPresentationModel;
SiebelAppFacade.PhysicalRenderer = PhysicalRenderer;
SiebelAppFacade.BasePlugInWrapper = BasePlugInWrapper;
SiebelAppFacade.Applet = Applet;
SiebelAppFacade.AppletControl = AppletControl;

// ---------------------------------------------------------------------
// Global module-loader / framework helpers
// ---------------------------------------------------------------------

/**
 * Global `define` used by Siebel Open UI's module loader to register a
 * custom PM/PR/PW file.
 * @param {string} moduleName
 * @param {string[]} dependencies
 * @param {() => string} factory
 * @returns {void}
 */
function define(moduleName, dependencies, factory) {}

/** @namespace SiebelJS */
var SiebelJS = SiebelJS || {};
/** @param {string} path @returns {void} */
SiebelJS.Namespace = function (path) {};
/** @param {Function} childClass @param {Function} parentClass @returns {void} */
SiebelJS.Extend = function (childClass, parentClass) {};
/** @param {string} path @returns {*} */
SiebelJS.Dependency = function (path) {};
/** @param {...any} args @returns {void} */
SiebelJS.Log = function (...args) {};

/** @namespace SiebelApp */
var SiebelApp = SiebelApp || {};
SiebelApp.S_App = {
  /** @returns {*} */
  GetActiveView: function () {},
  PluginBuilder: {
    /**
     * @param {string} controlType
     * @param {Function} pwClass
     * @param {(control: AppletControl, objName?: string) => boolean} condition
     * @returns {void}
     */
    AttachPW: function (controlType, pwClass, condition) {}
  }
};
SiebelApp.Constants = {
  /** @param {string} name @returns {string} */
  get: function (name) { return ''; }
};

// Export for CommonJS/bundler consumers that want to `require()` the
// typedefs for jsconfig "typeAcquisition"-style tooling; harmless no-op
// in a browser <script> context.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PresentationModel,
    ApplePresentationModel,
    ListPresentationModel,
    MenuPresentationModel,
    PhysicalRenderer,
    BasePlugInWrapper,
    Applet,
    AppletControl,
    SiebelAppFacade,
    SiebelJS,
    SiebelApp,
    define
  };
}
