import {defineConfig,loadEnv} from 'vite';
import {invitationHandler} from './server/invitation.mjs';
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'');
 for(const name of ['INVITE_ADMIN_KEY','BLOB_READ_WRITE_TOKEN','BLOB_STORE_ID','RESEND_API_KEY','NOTIFICATION_EMAIL','EMAIL_FROM'])if(env[name]&&!process.env[name])process.env[name]=env[name];
 function install(server){const handle=invitationHandler();server.middlewares.use((req,res,next)=>{if(new URL(req.url,'http://localhost').pathname==='/api/invitation')return handle(req,res);next();});}
 return {plugins:[{name:'aidear-invitation-api',configureServer:install,configurePreviewServer:install}]};
});
