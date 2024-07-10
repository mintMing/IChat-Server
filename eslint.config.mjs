import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: {...globals.commonjs, ...globals.node} }},
  pluginJs.configs.recommended,
  {
    rules: {  
      // 要求每个语句的末尾必须有分号  
      "semi": ["error", "always"],  
      // 要求对象的属性之间有空格  
      "object-curly-spacing": ["error", "always", {  
        arraysInObjects: true,  
        objectsInObjects: true,
      }],  
      // 要求或禁止对象字面量属性末尾使用逗号  
      "comma-dangle": ["error", "always-multiline"],
      // 禁止重复导入相同的模块
      "no-duplicate-imports": "error",
      // 禁止在导入或解构赋值时使用无用的重命名。
      "no-useless-rename": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "space-infix-ops": "error",
      quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
    },
  },
];