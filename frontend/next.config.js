/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "\*"
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET"
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "X-Requested-With, content-type, Authorization"
					}
				]
			}
		]
	}
}

module.exports = nextConfig
