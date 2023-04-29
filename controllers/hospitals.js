const Hospital = require('../models/Hospital')
const Appointment = require('../models/Appointment')

//@desc     Get all hospitals
//@route    /api/v1/hospitals
//@access   public
exports.getHospitals = async(req, res ,next) => {
        let query;

        //Copy req.query
        // ... คือ operator แตกเป็น array
        const reqQuery = {...req.query};

        //Fields to exclude
        //จัดการการเครื่องหมาย น้อยกว่า มากกว่าก่อน จึงตัด select กับ sort ออกก่อน
        const removeFields = ['select', 'sort', 'page', 'limit'];

        //Loop over remove fields and delete them from reqQuery
        //Loop ใส่ในตัวแปร param และทำการลบ key & value ตัวนั้น
        removeFields.forEach(param => delete reqQuery[param]);
        console.log(reqQuery);

        //Create query string
        let queryStr = JSON.stringify(reqQuery);
        //เขียน pattern ให้ match กับข้อความ Regex
        //ให้ใส่เครื่องหมาย $ หน้าสื่งที่เราเจอ
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

        //Select Fields
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        //Sort
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createAt');
        }

        //Pagination user ต้องการข้อมูล page ไหน แต่ถ้าไม่กำหนดให้ page = 1
        const page = parseInt(req.query.page, 10) || 1;
        //limit = แต่ละ page ให้มีข้อมูลกี่ตัว ถ้าไม่กำหนดให้ set เป็น 25
        const limit = parseInt(req.query.limit, 10) || 25;
        //คำนวณหาตำแหน่งแรกของ page เอาตัวสุดท้ายของ page ก่อนหน้ามา
        const startIndex = (page - 1) * limit;
        //หน้าปัจจุบัน * limit
        const endIndex = page * limit;
        

    try {
        //นับทั้งหมกว่ามีกี่ตัว
        const total = await Hospital.countDocuments();
        //skip ไปที่หน้าที่เราต้องการ
        query = query.skip(startIndex).limit(limit);

        //!Execute query
        const hospitals = await query;
        //Pagination result
        const pagination = {};

        if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({
            success: true,
            count: hospitals.length,
            pagination,
            data: hospitals
        });
    } catch(err) {
        res.status(400).json({success: false, error: err})
    }
};


//@desc     Get single hospital
//@route    /api/v1/hospitals/:id
//@access   public
exports.getHospital = async(req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id).populate('appointments');
        if(!hospital) {
            return res.status(400).json({success: false});
        };

        res.status(200).json({success: true, data: hospital});
    } catch(err) {
        res.status(400).json({success: false, error: err});
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
        // แปลงให้เป็น Type.Object
        var ObjectId = require('mongoose').Types.ObjectId; 
        var id = req.params.id
        id = new ObjectId(id)
        hospital = await Hospital.find({_id: id});

        if(!hospital) {
            res.status(404).json({success: false});
        }
        await Appointment.deleteMany({hospital: id})
        await Hospital.deleteOne({_id: id});
        res.status(200).json({success: true, data: {}});
    } catch(err) {
        res.status(400).json({success: false, error: err});
    }
};