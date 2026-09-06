import { Queue } from "bullmq";


const connection={
    url: process.env.REDIS_URL
}


const emailQueue=new Queue("emails",{connection})

export {connection,emailQueue}