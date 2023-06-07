module.exports = {
	productionSourceMap: process.env.NODE_ENV != 'production',
	configureWebpack:{
		optimization: {
		  	splitChunks: {
				chunks: 'all',
				minSize: 250000,
				maxSize: 500000,
		  	}
		}
	},
};
