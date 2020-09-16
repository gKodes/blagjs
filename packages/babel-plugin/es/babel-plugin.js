import * as types from '@babel/types';
import { declare } from '@babel/helper-plugin-utils';
import getOrCreateConstructor from './lib/getOrCreateConstructor';
import getSuperCallExpression from './lib/getSuperCallExpression';
import createSuperCallExpression from './lib/createSuperCallExpression';
import getNode from './lib/getNode';
import getOrCreateProp from './lib/getOrCreateProp';

const STR_OBJECT = 'Object';
const STR_MODEL_CLASS_NAME = 'Model';

const IDF_INIT = types.identifier('init');
const IDF_MODEL = types.identifier(STR_MODEL_CLASS_NAME);

const IDF_UID = types.identifier('uid');

const EXPR_OBJ_FREEZE = types.memberExpression(
  types.identifier(STR_OBJECT),
  types.identifier('freeze')
);

const DEFAULT_UID_PROPS = ['uid'];

export default declare((api, opts) => {
  api.assertVersion(7);
  const uidProps = opts.uidProps || DEFAULT_UID_PROPS;

  return {
    name: 'blinds-transform-class-property',
    visitor: {
      ImportDeclaration(path) {
        // console.info(path);
      },
      /**
       *
       * @param {import('@babel/traverse').NodePath} classNodePath
       * @param {import('@babel/core').PluginPass} state
       */
      Class(classNodePath, state) {
        if (
          classNodePath
            .get('superClass')
            .isIdentifier({ name: STR_MODEL_CLASS_NAME })
        ) {
          const classBodyNodePath = classNodePath.get('body');
          const classPropertyNodePaths = classBodyNodePath
            .get('body')
            .filter(nodePath => nodePath.isClassProperty());
          const constructor = getOrCreateConstructor(classNodePath);
          const constructorBody = constructor.get('body');
          const className = getNode(classNodePath, 'id.name');
          const classNameIdentifier = types.identifier(className);
          let propsObjectExpression = types.identifier('undefined');

          // If super call is missing, add that to the constructor
          let superCallNodePath = getSuperCallExpression(constructorBody);
          if (!superCallNodePath) {
            superCallNodePath = constructorBody.unshiftContainer(
              'body',
              types.expressionStatement(createSuperCallExpression())
            )[0];
          }

          superCallNodePath.isCallExpression;

          const modelMeta = types.objectExpression([
            types.objectProperty(
              types.identifier('name'),
              types.stringLiteral(className)
            ),
          ]);

          // Only run the logic if we properties defined on the Class
          if (classPropertyNodePaths.length) {
            // Create the meta object
            let objectPropertys = classPropertyNodePaths.map(
              propertyNodePath => {
                const propertyName = getNode(propertyNodePath, 'key.name');
                let value = getNode(propertyNodePath, 'value');

                if (types.isCallExpression(value)) {
                  const propertyNameLiteral = types.stringLiteral(propertyName);
                  value.arguments.push(propertyNameLiteral);
                  const attrType = value.callee.name;
                  if (uidProps.includes(attrType)) {
                    const prop = getOrCreateProp(
                      modelMeta,
                      IDF_UID,
                      propertyNameLiteral
                    );
                  }
                }

                propertyNodePath.remove();
                return types.objectProperty(
                  types.identifier(propertyName),
                  value
                );
              }
            );

            modelMeta.properties.push(
              types.objectProperty(
                types.identifier('props'),
                types.objectExpression(objectPropertys)
              )
            );
          }

          classNodePath.insertAfter([
            types.callExpression(types.memberExpression(IDF_MODEL, IDF_INIT), [
              classNameIdentifier,
              modelMeta,
            ]),
          ]);
        }
      },
    },
  };
});
