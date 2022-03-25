module.exports = {
	productionSourceMap: process.env.NODE_ENV != 'production',
	configureWebpack: () => {
		if (process.env.NODE_ENV != 'production') {
			devtool: 'source-map'
		}
	}
};