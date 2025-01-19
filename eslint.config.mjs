import eslintJs from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
  {
    ignores: [
      '**/*.test.ts',
      '**/*.local.ts',
      '**/*.stage.ts',
      '**/*.unit.ts',
      '**/paas-api-master-key.js',
      '**/build',
      '**/schema-check.js',
      'src/types/generated/*'
    ]
  },
  eslintJs.configs.recommended,
  ...tsEslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',     
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }]
    }
  }
)
