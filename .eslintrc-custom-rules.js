// Custom ESLint rules for detecting unwanted components and patterns
module.exports = {
  rules: {
    'no-unwanted-components': {
      create(context) {
        return {
          // Detect unwanted component names
          ImportDeclaration(node) {
            const source = node.source.value;
            const unwantedPatterns = [
              /test/i,
              /mock/i,
              /dummy/i,
              /temp/i,
              /deprecated/i,
              /legacy/i,
              /old/i,
              /unused/i,
              /debug/i,
              /dev/i
            ];

            // Check if import source contains unwanted patterns
            unwantedPatterns.forEach(pattern => {
              if (pattern.test(source)) {
                context.report({
                  node,
                  message: `Unwanted component detected: "${source}" contains forbidden pattern "${pattern.source}"`
                });
              }
            });
          },

          // Detect unwanted function calls
          CallExpression(node) {
            const unwantedCalls = [
              'console.log',
              'console.warn',
              'console.error',
              'console.info',
              'debugger',
              'alert',
              'confirm',
              'prompt'
            ];

            if (node.callee.type === 'MemberExpression' && 
                node.callee.object.name === 'console') {
              const methodName = node.callee.property.name;
              if (unwantedCalls.includes(`console.${methodName}`)) {
                context.report({
                  node,
                  message: `Unwanted console method detected: console.${methodName}`
                });
              }
            }

            if (node.callee.type === 'Identifier' && 
                unwantedCalls.includes(node.callee.name)) {
              context.report({
                node,
                message: `Unwanted function call detected: ${node.callee.name}`
              });
            }
          },

          // Detect unwanted variable names
          VariableDeclarator(node) {
            if (node.id.type === 'Identifier') {
              const varName = node.id.name;
              const unwantedPatterns = [
                /^test/i,
                /^mock/i,
                /^dummy/i,
                /^temp/i,
                /^deprecated/i,
                /^legacy/i,
                /^old/i,
                /^unused/i,
                /^debug/i,
                /^dev/i
              ];

              unwantedPatterns.forEach(pattern => {
                if (pattern.test(varName)) {
                  context.report({
                    node,
                    message: `Unwanted variable name detected: "${varName}" matches forbidden pattern "${pattern.source}"`
                  });
                }
              });
            }
          },

          // Detect unwanted file patterns in comments
          Program(node) {
            const sourceCode = context.getSourceCode();
            const comments = sourceCode.getAllComments();
            
            const unwantedCommentPatterns = [
              /TODO/i,
              /FIXME/i,
              /HACK/i,
              /XXX/i,
              /BUG/i,
              /TEMP/i,
              /DEBUG/i
            ];

            comments.forEach(comment => {
              unwantedCommentPatterns.forEach(pattern => {
                if (pattern.test(comment.value)) {
                  context.report({
                    node: comment,
                    message: `Unwanted comment pattern detected: "${comment.value.trim()}" contains forbidden pattern "${pattern.source}"`
                  });
                }
              });
            });
          }
        };
      }
    }
  }
};
