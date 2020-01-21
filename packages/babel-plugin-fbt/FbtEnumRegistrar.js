/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This file is shared between www and fbsource and www is the source of truth.
 * When you make change to this file on www, please make sure you test it on
 * fbsource and send a diff to update the files too so that the 2 versions are
 * kept in sync.
 *
 * Run the following command to sync the change from www to fbsource.
 *   js1 upgrade www-shared -p babel_plugin_fbt --local ~/www
 *
 * @emails oncall+internationalization
 * @flow
 */

'use strict';

/*::
import type {FbtBabelNodeCallExpression} from './index.js';
import type {NodePathOf} from '@babel/core';
type NodePath = NodePathOf<FbtBabelNodeCallExpression>;
*/

const {FBT_ENUM_MODULE_SUFFIX} = require('./FbtConstants');
const path = require('path');

const fbtEnumMapping /*: {[string]: ?string} */ = {};

const FbtEnumRegistrar = {
  /**
   * Associate a JS variable name to an Fbt enum module name
   * If the module name is invalid, then it's a no-op.
   */
  setModuleAlias(alias /*: string */, modulePath /*: string */) /*: void */ {
    const moduleName = path.parse(modulePath).name;
    if (!moduleName.endsWith(FBT_ENUM_MODULE_SUFFIX)) {
      return;
    }
    fbtEnumMapping[alias] = moduleName;
  },

  /**
   * Returns the Fbt enum module name for a given variable name (if any)
   */
  getModuleName(name /*: string */) /*: ?string */ {
    return fbtEnumMapping[name];
  },

  /**
   * Processes a `require(...)` call and registers the fbt enum if applicable.
   * @param path Babel path of a `require(...)` call expression
   */
  registerIfApplicable(path /*: NodePath */) /*: void */ {
    const {node} = path;
    const firstArgument = node.arguments[0];
    if (firstArgument.type !== 'StringLiteral') {
      return;
    }
    const modulePath = firstArgument.value;
    // $FlowFixMe Need to check that parent path exists and that the node is correct
    const alias = (path.parentPath.node.id.name /*: string */);
    this.setModuleAlias(alias, modulePath);
  },
};

module.exports = FbtEnumRegistrar;
