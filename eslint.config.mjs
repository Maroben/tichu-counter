import eslint from '@eslint/js';
import nx from '@nx/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', '.firebase/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@nx': nx, 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints: [
            { sourceTag: 'scope:domain', onlyDependOnLibsWithTags: ['scope:domain'] },
            { sourceTag: 'scope:application', onlyDependOnLibsWithTags: ['scope:domain', 'scope:application'] },
            { sourceTag: 'scope:data', onlyDependOnLibsWithTags: ['scope:domain', 'scope:application', 'scope:data'] },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: ['scope:domain', 'scope:application', 'scope:data', 'scope:ui'],
            },
          ],
        },
      ],
    },
  },
);
