function setTab(name,cursel,n){ 
for(i=1;i<=n;i++){ 
  var menu=document.getElementById(name+i); 
  var con=document.getElementById("con_"+name+"_"+i); 
  if(menu !=null && con !=null ){
  menu.className=i==cursel?"Current":""; 
  con.style.display=i==cursel?"block":"none"; 
  }
  
} 
}