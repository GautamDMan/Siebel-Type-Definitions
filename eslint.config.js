// eslint.config.js — Flat config (ESLint 9+) for Siebel OpenUI PM/PR/PW code.
//
// Install:
//   npm install --save-dev eslint @eslint/js globals eslint-plugin-jsdoc
//
// This assumes the companion siebel-openui-pm-pr.jsdoc.js / .d.ts files from
// this conversation are present in your project (or globally referenced via
// jsconfig.json), so `no-undef` recognizes SiebelAppFacade base classes.

import js from '@eslint/js';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

/**
 * Globals injected by the Siebel Open UI runtime itself. These exist in the
 * browser before any custom PM/PR/PW file runs, so ESLint must treat them
 * as known globals rather than flagging no-undef.
 */
const siebelGlobals = {
  SiebelApp: 'readonly',
  // SiebelAppFacade is writable because every custom PM/PR/PW file adds a
  // new class to this namespace, e.g. SiebelAppFacade.MyCustomPR = ...
  SiebelAppFacade: 'writable',
  SiebelJS: 'readonly',
  define: 'readonly',
  require: 'readonly',
  requirejs: 'readonly',
  $: 'readonly',
  jQuery: 'readonly',
  // Common local aliases seen throughout Oracle's own examples:
  // var consts = SiebelJS.Dependency("SiebelApp.Constants");
  consts: 'writable',
  siebConsts: 'writable'
};

export default [
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.js'],
    ignores: [
      '**/*.min.js',
      '**/thirdparty/**',
      '**/vendor/**',
      '**/dist/**',
      '**/build/**'
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...siebelGlobals
      }
    },
    plugins: { jsdoc },
    rules: {
      // ------------------------------------------------------------
      // Core correctness
      // ------------------------------------------------------------
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      eqeqeq: ['warn', 'smart'],
      'no-implicit-globals': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'warn',
      'no-throw-literal': 'warn',
      'no-return-assign': 'warn',

      // ------------------------------------------------------------
      // Siebel Open UI conventions
      // ------------------------------------------------------------

      // Framework method names (ShowUI, BindData, Init, LeaveField, ...)
      // are PascalCase per Oracle's documented API, and control/property
      // names often come straight from the repository (e.g. "Account Id").
      // Don't fight the framework's own casing rules.
      camelcase: ['warn', { properties: 'never' }],

      // Oracle's docs recommend SiebelJS.Log over console output in
      // framework code — flag console.log specifically.
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name='log']",
          message:
            'Use SiebelJS.Log(...) instead of console.log in Siebel Open UI PM/PR/PW code.'
        },
        {
          selector: "CallExpression[callee.name='eval']",
          message: 'eval() is not permitted in Siebel Open UI customizations.'
        }
      ],

      // The superclass.constructor.apply(this, arguments) pattern that
      // every Siebel PM/PR/PW example uses relies on the `arguments`
      // object — don't force rest params/spread here.
      'prefer-rest-params': 'off',
      'prefer-spread': 'off',

      // Oracle's examples define constructors as `function Foo(){}` and
      // wire inheritance via SiebelJS.Extend(Foo, SiebelAppFacade.Bar) —
      // this is the idiomatic pattern, not something to "fix" to ES6
      // classes.
      'func-style': 'off',
      'no-underscore-dangle': 'off',

      // var + IIFE module pattern (per Oracle's Define()/namespace
      // examples) is idiomatic here; don't force let/const.
      'no-var': 'off',
      'one-var': 'off',
      'block-scoped-var': 'off',
      'vars-on-top': 'off',

      // Case sensitivity matters a lot in this framework (Oracle's docs:
      // "all code outside double quotes is case sensitive"). Catch the
      // most common real-world mistake: reassigning what looks like a
      // constructor/class reference with different casing.
      'new-cap': ['warn', { newIsCap: true, capIsNew: false }],

      // ------------------------------------------------------------
      // JSDoc — aligned with the companion siebel-openui-pm-pr.jsdoc.js
      // ------------------------------------------------------------
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: false,
            MethodDefinition: false
          },
          // Flag PascalCase-named prototype methods without doc comments —
          // i.e. custom PM/PR/PW API methods, not internal helpers.
          contexts: [
            "AssignmentExpression[right.type='FunctionExpression'][left.property.name=/^[A-Z]/]"
          ]
        }
      ],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/check-param-names': 'warn',
      // Oracle's own docs describe types loosely in prose ("a string",
      // "an object") — don't force strict type syntax everywhere.
      'jsdoc/check-types': 'off',
      'jsdoc/no-undefined-types': [
        'warn',
        {
          definedTypes: [
            'JSSPropertySet',
            'AppletControl',
            'PresentationModel',
            'ApplePresentationModel',
            'ListPresentationModel',
            'MenuPresentationModel',
            'PhysicalRenderer',
            'BasePlugInWrapper',
            'Applet',
            'MethodConfig',
            'BindingConfig',
            'ListColumnDescriptor',
            'PWState'
          ]
        }
      ]
    }
  },
  {
    // Manifest / bootstrap files reference modules that are never "used"
    // in the traditional sense — relax unused-vars there.
    files: ['**/manifest*.js', '**/*.manifest.js'],
    rules: {
      'no-unused-vars': 'off'
    }
  }
];
