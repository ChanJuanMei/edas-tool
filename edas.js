const http = require('http');
const content = document.getElementById('content');
const query_btn = document.getElementById('query');
const del_btn = document.getElementById('del');


function query(dataId,group,srcIp,cb){
     const query_url =`http://jmenv.tbsite.net:8080/config-center/admin.do?__preventCache=1586854888793&currentPage=1&dataId=${dataId}&group=${group}&method=listConfig&pageSize=20&srcIp=${srcIp}`;
     console.log(query_url);
     http.get(query_url,function(res,a,b,c){
      let rawData=''
      res.on('data',(chunk)=>{rawData+=chunk;})
      res.on('end',()=>{
          try {
            const result =JSON.parse(rawData);
            const datas =result.data.result;
            let p =""
            datas.forEach(element => {
                p = p + element.dataId+"\n"
            });
            content.textContent = p
          }catch (e){
              console.log(e)
          }
      })
     });  
    }

function del(dataId,group,srcIp,cb){
    const del_url =`http://jmenv.tbsite.net:8080/config-center/admin.do?dataId=${dataId}&group=${group}&method=removeConfig&srcIp=${srcIp}`;
    console.log(del_url);
    http.post(del_url,cb); 
}  

query_btn.addEventListener('click',function(e){
    let dataId =document.getElementById('dataId').value;
    let group =document.getElementById('group').value;
    let srcIp =document.getElementById('srcIp').value;
    
    query(dataId,group,srcIp,function(e,result){
        console.log(result)
        content.textContent = result
    })
});


 del_btn.addEventListener('click',function(e){
    let dataId =document.getElementById('dataId').value;
    let group =document.getElementById('group').value;
    let srcIp =document.getElementById('srcIp').value;

    del(dataId,group,srcIp,function(e,result){
        console.log(result)
        content.textContent = result
    })
});
