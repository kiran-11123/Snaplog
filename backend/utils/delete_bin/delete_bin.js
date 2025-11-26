import workspaceModel from '../../models/workspaceModel.js';
import cron_logger from '../cron_logger/cron_logger.js';
import cron from 'node-cron'

async function delete_bin(){
       
    try{

        cron_logger.info("Entered into the function to Permanent delete the data into bin")
        
        const find_alldata = await workspaceModel.find({})
        
        for(let i=0;i<find_alldata.length;i++){

               let recently_deleted_data = find_alldata[i].recentlyDeleted;
               
               if(recently_deleted_data.length > 0){
                     
                   cron_logger.info("No recent deletes in the workspace" ,find_alldata[i].workspace_name)
                   continue;
               }

              let p =  recently_deleted_data.filter((a)=>{
                return a.createdAt > Date.now()-(7 * 24 * 60 * 60 * 1000);

               })
               
            find_alldata[i].recentlyDeleted = p;
            await find_alldata[i].save();

        }
        

        cron_logger.info("Permanently deleted the data which is deleted more than 7 days ago...")



    }
    catch(er){
           
        cron_logger.info("Error occured while deleting the data in bin" , er);

    }
}

cron.schedule("0 2 * * *", async() => {
    try {
        await delete_bin();
    } catch(er) {
        cron_logger.error("Cron job for bin deletion is failed:", er);
    }
})