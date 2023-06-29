const ProportionMean = {
    2: 0.586273964636776,
    3: 0.29001304829332,
    4: 0.347258964892596,
    5: 0.497011283035404,
    6: 0.937767483800291,
    7: 0.163014538219579,
    8: 0.220799981900798,
    9: 0.909358634610912,
    10: 0.0824873292401249,
    11: 0.883966219534899,
    12: 0.0934226643073281,
    13: 0.92663222630212,
    14: 0.100475860084299,
    15: 0.921673525270797,
    16: 0.0481464262693466,
    17: 0.723415277255634,
    18: 0.750220787151384,
    19: 0.914246219923882    
};

function proport2percent(ProportionData) {
    var ProportionLen = Object.keys(ProportionData).length
    var ArraiveIds = [6, 9, 11, 13, 15]

	var TpPercents = {
		1: 0.0,
		2: 1.0
	}

	var Tp = 1.0
	var Trace = Tp
	for(var cp=0; cp < ProportionLen; cp++) {
		var Pcp = ProportionData[cp+2]

		Tp *= (1 - Pcp) / Pcp
		Trace += Tp

		TpPercents[cp+3] = Trace
    }
    var PercentLen = Object.keys(TpPercents).length

    var CpPercents = []
	for(cp=0; cp < PercentLen; cp++) {
        if( ArraiveIds.indexOf(cp+1) < 0 ) {
            CpPercents.push( TpPercents[cp+1] / Trace )
        }
    }

	return CpPercents
}

const PercentList = proport2percent(ProportionMean)

export {
    PercentList
}
