import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default {
  external: ['ramda', 'karet', 'karet.util', 'partial.lenses'],
  output: {
    globals: {
      'karet': 'React',
      'karet.util': 'U',
      'ramda': 'R',
      'partial.lenses': 'L',
    }
  },
  plugins: [
    resolve(),
    process.env.NODE_ENV &&
      replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.NODE_ENV === 'production' && uglify()
  ].filter(x => x)
};

