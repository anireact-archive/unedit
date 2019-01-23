module.exports = {
    extends: '@anireact/babel-config',
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        loose: true,
                        modules: 'commonjs',
                        shippedProposals: true,
                        useBuiltIns: 'usage',
                    },
                ],
                '@babel/preset-typescript',
            ],
            plugins: ['@babel/plugin-transform-runtime', ['@babel/plugin-proposal-class-properties', { loose: true }]],
        },
    },
};
