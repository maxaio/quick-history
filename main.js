// pop页面 脚本
'use strict';


var tBody = document.getElementById('tBody');
var searchBtn = document.getElementById('searchBtn');
var table = document.getElementById('table');

searchBtn.addEventListener("click",function(){
	search();
});

async function search(){
    var searchKey =document.getElementById("search_text").value;
    var countDom = document.getElementById("countDom");
    tBody.innerHTML = '';
    countDom.innerHTML  = '0';
    var no = 0;
    searching();
	await new Promise((resolve)=>{
        
        chrome.history.search({"text":searchKey,"maxResults":1000000,startTime:new Date('2010-01-01').getTime()},function(r){        
            r.slice(0,100).every(function(item){
                appendRow((++no)+':'+item.id,item.id,item.title,item.url);
                return true;
            });
            countDom.innerHTML = r.length ;
            searchOver();
            resolve();
        });
    });
}


function appendRow(no,id,title,url){
    var html ='<tr><td>{3}</td><td><button link="{4}" LID="{2}">Del</button></td><td>{0}</td><td><a href="{1}">{1}</a></td></tr>'.replace('{0}',title).replace(/\{1}/g,url).replace('{2}',id).replace('{3}',no).replace('{4}',url);
    tBody.innerHTML+=html;

    var buttonList = tBody.getElementsByTagName('button');
    
    for(var btn of buttonList){
        btn.addEventListener('click',function(e){
            var lid = e.target.getAttribute('lid');
            var url = e.target.getAttribute('link');
            if(window.confirm('Are you sure you want to delete this history ? '+ lid)){

                deleteHistory(url);
                console.log('deleted');
                console.log(url);
                search();
            }else{
                console.log('cancald');
            }
        });
    }
}

function deleteHistory(url){
    chrome.history.deleteUrl({
        'url':url
    });
}

function searching(){
	table.style.display='none';
    searchBtn.value = 'searching';
    searchBtn.setAttribute('disabled','disabled');
    console.time();
}

function searchOver(){
	table.style.display='block';
    searchBtn.value = 'Search';
    searchBtn.removeAttribute('disabled');
    console.timeEnd();
}