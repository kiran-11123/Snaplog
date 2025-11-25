import cron from 'node-cron'
import Favourites_replication_model from '../../DB/replication_data/data_replication.js'
import Favourites_model from '../../DB/data.js'
import cron_logger from '../cron_logger/cron_logger.js'
cron.schedule("0 * * * * *" , async()=>{

    try{ 

       await  Favourites_replication_model.deleteMany({});

       cron_logger.info("Old data in replica deleted successfully..")




        const data = await Favourites_model.find({})

        cron_logger.info("Data Fetched from the master favourties schema successfully..")


        await Favourites_replication_model.insertMany(data);
        cron_logger.info("Data replicated to replicaiton favourties schema successfully..")



    }
    catch(er){

        cron_logger.info("Error while Replicating the data of user Favourites " , er);

        

    }
     
})