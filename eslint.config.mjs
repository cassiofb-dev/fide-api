import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [
	{
		ignores: [
			".next/**",
			".open-next/**",
			".wrangler/**",
			"node_modules/**",
			"cloudflare-env.d.ts",
			"next-env.d.ts",
		],
	},
	...nextConfig,
	{
		rules: {
			"react-hooks/set-state-in-effect": "off",
			"react/jsx-no-comment-textnodes": "off",
			"react/no-unescaped-entities": "off",
		},
	},
];

export default eslintConfig;
