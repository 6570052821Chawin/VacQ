const Hospital = require('../models/Hospital')

//@desc     Get all hospitals
//@route    /api/v1/hospitals
//@access   public
exports.getHospitals = async(req, res ,next) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({success: true, count: this.getHospitals.length, data: hospitals});
    } catch(err) {
        res.status(400).json({success: false})
    }
};


//@desc     Get single hospital
//@route    /api/v1/hospitals/:id
//@access   public
exports.getHospital = async(req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if(!hospital) {
            return res.status(400).json({success: false});
        };

        res.status(200).json({success: true, data: hospital});
    } catch(err) {
        res.status(400).json({success: false});
    };
};


//@desc     Create single hospital
//@route    /api/v1/hospitals/:id
//@access   public
exports.createHospital = async(req, res, next) => {
    console.log(req.body);
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success: true, data: hospital});
};


//@desc     Update hospital
//@route    /api/v1/hospitals/:id
//@access   public
exports.updateHospital = async(req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id , req.body, {
            new: true,
            runValidators:true
        });

        if(!hospital) {
            return res.status(400).json({success: false});
        }

        res.status(200).json({success:true, data: hospital});
    } catch(err) {
        res.status(400).json({success: false, error: err});
    }
};




//@desc     Delete hospital
//@route    /api/v1/hospitals/:id
//@access   public
exports.deleteHospital = async(req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndRemove(req.params.id);

        if(!hospital) {
            res.status(400).json({success: false, error: err});
        }

        res.status(200).json({success: true, data: {}});
    } catch(err) {
        res.status(400).json({success: false});
    }
};