import ChargingStation from "../models/ChargingStation.js";

export const createStation =async (req,res)=>{
        try {
             const {name,latitude,longitude,status,powerOutput,connectorType} = req.body;
             if(!name || latitude === undefined || longitude === undefined || !status || !powerOutput || !connectorType){
                return res.status(400).json({
                       message: "Please fill all required fields"
                    })
                }
                    const station =await ChargingStation.create({
                        name,
                        latitude,
                        longitude,
                        status,
                        powerOutput,
                        connectorType
            })
            res.status(201).json({
                success: true,
                message: "Charging Station Created Successfully",
                station
            })
        } catch (error) {
             res.status(500).json({
            success: false,
            message: error.message
        })
}}

export const getstation = async (req, res) => {
    try {
        const { search, status, connector } = req.query;
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (status && status !== 'All') {
            filter.status = status;
        }
        if (connector && connector !== 'All') {
            filter.connectorType = connector;
        }

        const stations = await ChargingStation.find(filter);
        res.status(200).json({
            success: true,
            count: stations.length,
            stations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateStation = async (req, res) => {
    try {
        const stationId = req.params.id;
        const updatedStation = await ChargingStation.findByIdAndUpdate(
            stationId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updatedStation) {
            return res.status(404).json({
                message: "Charging Station Not Found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Charging Station Updated Successfully",
            station: updatedStation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const deleteStation =async (req,res)=>{
    const stationId =req.params.id

    const deleteStation= await ChargingStation.findByIdAndDelete(stationId)
    if(!deleteStation)
    {
        return res.status(404).json({
                message: "Charging Station Not Found"
            });
    }
      res.status(200).json({
            success: true,
            message: "Charging Station deleted Successfully",
            station: deleteStation
        });
}