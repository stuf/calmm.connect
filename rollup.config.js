import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import cjs from 'rollup-plugin-commonjs';

const globals = {
  'react': 'React',
  'karet': 'karet',
  'kefir': 'Kefir',
  'prop-types': 'P',
  'karet.util': 'U',
  'ramda': 'R',
  'partial.lenses': 'L',
};

export default {
  external: Object.keys(globals),
  output: { globals },
  plugins: [
    resolve(),
    process.env.NODE_ENV &&
      replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    babel({
      exclude: 'node_modules/**',
    }),
    cjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': [
          'Component',
        ],
      },
    }),
    process.env.NODE_ENV === 'production' && uglify(),
  ].filter(x => x),
};

