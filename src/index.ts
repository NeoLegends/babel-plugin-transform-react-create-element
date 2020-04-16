import { Visitor } from '@babel/core';
import template from "@babel/template";
import * as types from "@babel/types";

const LOCAL_VARIABLE_TEMPLATE = template(`
  const %%pragma%% = React.createElement;
`);
const PRAGMA_ELEM_NAME = "createElement";

const transform = () => {
  let hasInsertedJsxLocalVariable = false;
  let createElementIdent: types.Identifier;

  const insertingVisitor: Visitor = {
    ImportDeclaration(path) {
      if (path.node.source.value !== "react" || hasInsertedJsxLocalVariable) {
        return;
      }

      const defaultImportSpec = path.node.specifiers.find(
        (spec) => spec.type === "ImportDefaultSpecifier",
      );

      if (!defaultImportSpec) {
        return;
      }

      const spec = defaultImportSpec as types.ImportDefaultSpecifier;
      if (spec.local.name !== "React") {
        return;
      }

      path.insertAfter(LOCAL_VARIABLE_TEMPLATE({ pragma: createElementIdent }));
      hasInsertedJsxLocalVariable = true;
    },
  };

  const programVisitor: Visitor = {
    Program: {
      enter(path, { file }: any) {
        /*
         * Check if we already have an existing pragma in the source code and if so,
         * leave the file be.
         */
        const alreadyContainsJsxPragma = file.ast.comments.some(
          (c: types.Comment) => c.value.indexOf("@jsx") !== -1,
        );
        if (alreadyContainsJsxPragma) {
          return;
        }

        createElementIdent = path.scope.generateUidIdentifier(PRAGMA_ELEM_NAME);
        path.traverse(insertingVisitor);

        if (!hasInsertedJsxLocalVariable) {
          return;
        }

        const commentText = `* @jsx ${createElementIdent.name} `;
        path.addComment("leading", commentText);

        /*
         * Because babel doesn't reparse the source code, our new comment does not
         * show up in `file.ast.comments`, where @babel/plugin-transform-react-jsx
         * expects it.
         *
         * Hence add it manually.
         */
        const insertedCommentNode = path.node.leadingComments?.find(
          (c) => c.value === commentText,
        )!;
        file.ast.comments.push(insertedCommentNode);
      },
    },
  };

  return {
    name: "transform-react-imports",
    visitor: programVisitor,
  };
};

export default transform;
