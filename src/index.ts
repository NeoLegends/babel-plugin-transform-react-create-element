import { NodePath } from "@babel/core";
import template from "@babel/template";
import * as t from "@babel/types";

type ReactImport =
  | NodePath<t.ImportDefaultSpecifier>
  | NodePath<t.ImportNamespaceSpecifier>
  | NodePath<t.VariableDeclarator>;

const LOCAL_VARIABLE_TEMPLATE = template(
  "const %%localIdentifier%% = /*#__PURE__*/ React.createElement;",
  { preserveComments: true },
);

const getReactImport = (path: NodePath<t.Identifier>): ReactImport | null => {
  const binding = path.scope.getBinding(path.node.name);

  if (!binding) {
    return null;
  }

  const bindingPath = binding.path;

  if (
    bindingPath.isImportDefaultSpecifier() ||
    bindingPath.isImportNamespaceSpecifier()
  ) {
    const parentPath = bindingPath.parentPath;

    if (
      parentPath.isImportDeclaration() &&
      parentPath.node.source.value === "react"
    ) {
      return bindingPath;
    }
  } else if (bindingPath.isVariableDeclarator()) {
    const init = bindingPath.get("init") as NodePath;

    if (
      init.isCallExpression() &&
      init.node.callee.isIdentifier() &&
      init.node.callee.name === "require" &&
      init.node.arguments.length === 1 &&
      (init.node.arguments[0] as any).isStringLiteral() &&
      (init.node.arguments[0] as any).value === "react"
    ) {
      return bindingPath;
    }
  }

  return null;
};

const getCreateElementCallAndReactImport = (
  path: NodePath<t.CallExpression>,
): [NodePath<t.MemberExpression>, ReactImport] | null => {
  const callee = path.get("callee");
  if (!callee.isMemberExpression()) {
    return null;
  }

  const property = callee.get("property") as NodePath<t.Node>;
  if (!property.isIdentifier() || property.node.name !== "createElement") {
    return null;
  }

  const object = callee.get("object") as NodePath<t.Node>;
  if (!object.isIdentifier()) {
    return null;
  }

  const reactImport = getReactImport(object);
  if (!reactImport) {
    return null;
  }

  return [callee, reactImport];
};

const insertLocalVariable = (importSite: ReactImport): t.Identifier => {
  const uniqueIdent = importSite.scope.generateUidIdentifier("createElement");

  const variableDeclaration = LOCAL_VARIABLE_TEMPLATE({
    localIdentifier: uniqueIdent,
  }) as t.VariableDeclaration;

  const [node] = importSite.parentPath.insertAfter(variableDeclaration);
  importSite.parentPath.scope.registerDeclaration(node as NodePath<t.Node>);

  return uniqueIdent;
};

const transform = () => ({
  name: "transform-create-element",
  visitor: {
    CallExpression(path, state: { localVariableIdent: t.Identifier }) {
      const data = getCreateElementCallAndReactImport(path);

      if (!data) {
        return;
      }

      const [callee, importSite] = data;

      if (!state.localVariableIdent) {
        state.localVariableIdent = insertLocalVariable(importSite);
      }

      callee.replaceWith(state.localVariableIdent);
    },
  },
});

export default transform;
