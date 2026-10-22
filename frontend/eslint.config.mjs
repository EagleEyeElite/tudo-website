import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXElement[openingElement.name.name='a']",
          message: "Use <Link> from 'next/link' for internal navigation (the navbar activity Indicator breaks with <a />)",
        },
      ],
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'src/lib/generated/**'],
  },
];

export default eslintConfig;
