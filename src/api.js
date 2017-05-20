import {create} from 'apisauce'

let header = {
  'Cache-Control': 'no-cache',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const api = create({
  baseURL:'http://localhost/ivf/',
  //baseURL:'http://192.168.1.2/ivf/',
  //baseURL:'https://ivf.simpleinformatics.com/',
  headers: header,
  timeout: 10000,
});

api.addResponseTransform((response) => {
  if (response.problem==='TIMEOUT_ERROR') {
    // just mutate the data to what you want.
    response.data = {message: 'Your device is not connected to internet'};
    response.status = 412;
    console.log('changed response to', response);
  }
});

api.addRequestTransform(request => {
  console.debug('[API]-->',request);
})

api.addMonitor((arg) => {
  console.debug(`API[${arg.config.method}]${arg.config.url}`);//::[${arg.status}]-`, arg.data,arg);
  console.debug(`[${arg.status}]-->`, arg.data,arg);
  //if(arg.data && arg.data.message)alert(arg.data.message);
  if (arg.status/1===403 || arg.status/1===401) {
    console.debug('api say you should relogin');
  }
});

export default api;