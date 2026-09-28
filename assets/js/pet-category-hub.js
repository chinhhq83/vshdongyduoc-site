document.addEventListener('DOMContentLoaded', function(){
  var tabs=[].slice.call(document.querySelectorAll('[role="tab"][data-tab]'));
  var panels=[].slice.call(document.querySelectorAll('[role="tabpanel"]'));
  function activate(tab){
    tabs.forEach(function(t){t.setAttribute('aria-selected', t===tab ? 'true':'false');});
    panels.forEach(function(p){p.hidden = p.id !== tab.getAttribute('aria-controls');});
    if(history.replaceState){history.replaceState(null,'','#'+tab.dataset.tab);}
  }
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){activate(tab);});
    tab.addEventListener('keydown', function(e){
      if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return;
      e.preventDefault();
      var i=tabs.indexOf(tab), next=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[next].focus(); activate(tabs[next]);
    });
  });
  var hash=(location.hash||'').replace('#','');
  var initial=tabs.find(function(t){return t.dataset.tab===hash;});
  if(initial) activate(initial);
});
