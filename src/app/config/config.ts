import { environment } from "../../environments/environment";

var env = environment.production ? 'prod' : 'dev';
let _config = {
  baseUrl: '',
  port: ''
}

function getConfig() {
  switch (env) {
    case 'dev':     
      _config.baseUrl = 'http://localhost';
      _config.port = '8000';
      break;
    case 'prod':
      _config.baseUrl = 'https://admin.kebunjimbaran.com';
      _config.port = '';
      break;    
  }
  return _config;
}


export const config = getConfig();
