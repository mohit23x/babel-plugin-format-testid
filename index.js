const types = require("@babel/types");
const PLUGIN_NAME = "babel-plugin-format-testID";

/**
 *
 * A babel plugin to format testID when building the app
 *
 * INPUT:
 * <Button testID={variable} />
 * <Button testID={"asdf"+2} />
 * <Button testID="asdf" />
 *
 * OUTPUT:
 * <Button testID={"prefix" + variable} />
 * <Button testID={"prefix" + ("asdf" + 2)} />
 * <Button testID={"prefix" + "asdf"} />
 *
 */

/**
 * @param {*} opts: {prefix: string, skip?: boolean,}
 */

module.exports = function prefixTestID(_, opts) {
  if (!opts || !opts.prefix) {
    console.warn(`${PLUGIN_NAME} is missing a prefix value in configuration`);
  }

  const PREFIX = opts.prefix;

  const updatePrefix = (path, testIDValue) => {
    const str = types.stringLiteral(PREFIX);
    const call = types.jsxExpressionContainer(
      types.binaryExpression("+", str, testIDValue),
    );
    path.node.value = call;
  };

  return {
    name: PLUGIN_NAME,
    visitor: {
      JSXAttribute(path) {
        if (path.node.name.name !== "testID" || opts?.skip || !PREFIX) return;

        // console.log('it is :', path.node.value.value);

        let testIDValue;
        if (
          types.isExpression(path.node.value) &&
          path.node.value.type === "StringLiteral"
        ) {
          if (!path.node.value.value.startsWith(PREFIX)) {
            testIDValue = path.node.value;
            updatePrefix(path, testIDValue);
            // console.log('string:', path.node.value);
          }
        } else if (path.node.value.type === "JSXExpressionContainer") {
          testIDValue = path.node.value.expression;
          if (path.node.value.expression.type === "BinaryExpression") {
            if (
              types.isLiteral(path.node.value.expression.left) ||
              types.isStringLiteral(path.node.value.expression.left)
            ) {
              // eslint-disable-next-line max-depth
              if (!path.node.value.expression.left.value.startsWith(PREFIX)) {
                updatePrefix(path, testIDValue);
                // console.log('binary_string:', JSON.stringify(path.node.value.expression));
              }
            }
          } else if (
            ["LogicalExpression", "TemplateLiteral"].includes(
              path.node.value.expression.type,
            )
          ) {
            updatePrefix(path, testIDValue);
            // console.log('logical:', JSON.stringify(path.node.value.expression));
          } else if (
            path.node.value.expression.type === "Identifier" &&
            path.node.value.expression.name === "variable"
          ) {
            updatePrefix(path, testIDValue);
            // console.log('identier:', JSON.stringify(path.node.value.expression));
          }
        }
      },
    },
  };
};
