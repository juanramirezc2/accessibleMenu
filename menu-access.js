/**
* @license JGMM 
* * License: MIT
*/
(function(window, angular, undefined) {'use strict';

  angular.module('ngAccess', ['ng'])
  .controller('MainNavController',mainNavControlFunc)
  .directive('mainAccessMenu',DirectiveMainFunc);

  /*directive that trigger a refresh of the events once is called 
  * this directive might  accept an root element selector or $index ng repeat 
  */

  function  mainNavControlFunc(){

    var vmm = this;
    //take an array of DOM elements and attach an event to them
    vmm.clearAllHover = function(items){
      var i;
      for(i=0;i<items.length;i++){
        items[i].classList.remove("isHover");
      }
    };
    vmm.init = function(RootEl,scope){
      setTimeout(function(){ 
        var CallBack = (scope && scope.callback) ? scope.callback : false;
        var mainConfig={
          MainItem : RootEl[0],
          mainItemSelector:".nav-item",
          SubmenuSelector:".Sub-Menu",
          SubmenuItemSelector:".subnav-item",
          callback : CallBack
        };
        var subMenus = RootEl.find(".Sub-Menu"); //capture all of the submenus
        var sectionSubMenuConfig={
          actualSection:subMenus,
          subNavGroup:".sub-nav-group",
          subNavItem:".subnav-item",
          callback : CallBack
        };
        // attach events to the Main items selectors 
        vmm.attachMainEvents(vmm.eventMainHandler,"onkeydown",mainConfig);
        // attach events to the sub nav items 
        vmm.attachEventsSub(vmm.eventHandlerSub,"onkeydown",sectionSubMenuConfig); 
      }, 5000);
    };

    vmm.clearSubmenu=function(items,index){
      for(var i=0;i<items.length;i++){
        items[i].subMenu.classList.remove("visible"); //hide all of the sub menus
      }
      if(index){ //index given return the focus
        items[i].focus();
      }
    };

    vmm.eventHandlerSub = function eventHandler(i,j,menuMatrix,subElem){
      return function(e){
        if(e.keyCode===39){ 
          //right differents options with the right arrow
          if((menuMatrix.length - 1)===i){
            //the last item in the group go to the focus parent"
          }
          else{
            menuMatrix[i+1].subItems[0].focus(); //move focus right
          }
        }
        //move focus left sending the parent as an argument and this element
        else if(e.keyCode===37){
          // left
          if(i===0){
            //es el ultimo de la fila ve al foco del padre"
          }
          else{
            menuMatrix[i-1].subItems[0].focus(); //move focus right
          }
        }
        //move focus down sending the parent as an argument and this element
        else if(e.keyCode===38){ 
          // up diferent options with the up arrow
          if(i===0 && j===0){
            menuMatrix[i].subItems[j].ParentItemMenu.focus();
          }
          //Move to the previus item group
          else if(j===0){
            //capture the previus group and the length of the sub items
            var previusGroup=menuMatrix[i-1],previusLength=previusGroup.subItems.length;
            //set the focus to the previus element and last sub item
            previusGroup.subItems[previusLength-1].focus();
          }
          //Normal Move to the up item
          else{
            menuMatrix[i].subItems[j-1].focus(); //move focus right
          }
          return false;
        }
        //move focus up sending the parent as an argument and this element
        else if(e.keyCode===40){
          if(((menuMatrix.length - 1)===i) && ((menuMatrix[i].subItems.length - 1)===j)){
            //"ve al siguiente sub menu"
          }
          else if((menuMatrix[i].subItems.length - 1)===j){
            //capture the previus group and the length of the sub items
            var nextGroup=menuMatrix[i+1];
            //set the focus to the previus element and last sub item
            nextGroup.subItems[0].focus();
          }
          else{
            menuMatrix[i].subItems[j+1].focus(); //move focus right
          }
          return false;
        }
        else if(e.keyCode===27){
          // clear all the sub items and send the focus of the target

          subElem.classList.remove("visible");
          var parentItem= menuMatrix[i].subItems[j].ParentItemMenu;
          parentItem.focus();
          parentItem.classList.remove("isHover");
        }
        else if(e.keyCode===13){
          //else if enter is pressed
          menuMatrix[i].subItems[j].click();
          subElem.classList.remove("visible");
        }
        else{
          return true;
        }
      };
    };

    vmm.attachEventsSub=function(callback,event,config){
      config.actualSection.each(loopElems(config,event,callback)); 
    };

    function loopElems(config,event,callback){ // curry to pre config
      return function(index,singleSubmenu){
        var i,j,menuMatrix = [];
        var menuItemParent = singleSubmenu.previousElementSibling;
        var subGroups = singleSubmenu.querySelectorAll(config.subNavGroup);

        //loop throught all the elements

        for(i=0;i<subGroups.length;i++){
          menuMatrix[i]=subGroups[i]; /* save the subGroup element in the matrix */
          var subItem=subGroups[i].querySelectorAll(config.subNavItem);
          menuMatrix[i].subItems=subItem; /*save the subItem in the matrix */
          for(j=0;j<subItem.length;j++){
            //add reference to the next menu and previus submenu
            //reference to the parent item added to the submenu element
            subItem[j].ParentItemMenu=menuItemParent;
            //send the elems as a matrix [i,j] where i is the subGroup position and J is the sub Item position 
            subItem[j][event]=callback.call(this,i,j,menuMatrix,config.actualSection);
          }
        }
      };
    }

    vmm.attachMainEvents=function(callback,event,config){
      var i,menuArray=[];
      var mainItems=config.MainItem.querySelectorAll(config.mainItemSelector);
      //loop throught all the elements
      for(i=0;i<mainItems.length;i++){
        //look for the first link of the sub menu and add it to the DOM element Object
        var SubMenuEl=mainItems[i].parentNode.querySelector(config.SubmenuSelector);
        mainItems[i].firstLink = SubMenuEl.querySelector(config.SubmenuItemSelector); //submenu added as a part of DOM Element
        mainItems[i].subMenu = SubMenuEl; //first menu item added as a part of DOM Element
        menuArray[i] = mainItems[i]; /* save the mainItems element in the array */
        menuArray[i][event] = callback.call(this,i,menuArray,config.mainItem,config.callback);
      }
    };

    vmm.eventMainHandler=function(i,menuArray,elem,callback){
      return function(e){
        if(callback){
          callback();
        }
        if(e.keyCode===39){ 
          vmm.clearAllHover(menuArray);
          //right differents options with the right arrow
          vmm.clearSubmenu(menuArray);
          if((menuArray.length - 1)===i){
            //"the last item in the group go to the focus parent"
          }
          else{
            menuArray[i+1].focus(); //move focus right
          }
          return false;
        }
        else if(e.keyCode===13){
          //enter key
          vmm.clearSubmenu(menuArray);
          var subMenu=menuArray[i].subMenu,firstLink=menuArray[i].firstLink;
          if(subMenu && firstLink){ // if not is a one level menu
            menuArray[i].classList.add("isHover");
            subMenu.classList.add("visible");
            firstLink.focus();
          }
          return false;
        }
        //move focus left sending the parent as an argument and this element
        else if(e.keyCode===37){
          // left
          vmm.clearSubmenu(menuArray);
          vmm.clearAllHover(menuArray);
          if(i===0){
            //"es el ultimo de la fila ve al foco del padre"
          }
          else{
            menuArray[i-1].focus(); //move focus right
          }
          return false;
        }
        //up
        else if(e.keyCode===38 ){
          vmm.clearSubmenu(menuArray);
          menuArray[i].classList.remove("isHover");
          return false;
          // up diferent options with the up arrow
          // no hay eventos en el app del menu principal
        }
        //move focus down sending the parent as an argument and this element
        else if(e.keyCode===40 || e.keyCode=== 32){
          //down arrow
          vmm.clearSubmenu(menuArray);
          var subMenu=menuArray[i].subMenu,firstLink=menuArray[i].firstLink;
          if(subMenu && firstLink){ // if not is a one level menu
            menuArray[i].classList.add("isHover");
            subMenu.classList.add("visible");
            firstLink.focus();
          }
          return false;
        }
        else if(e.keyCode===27){
          // clear all the sub items and send the focus of the target
          vmm.clearSubmenu(menuArray);
          menuArray[i].classList.remove("isHover");
          return false;
        }
        else{
          // debug the key pressed  
        }
      };
    };
  }

  function DirectiveMainFunc($parse){
    var directive = {
      restrict: 'A',
      link: linkFunction,
      controller:'MainNavController',
      scope:{
        callback : '&change'
      },
      controllerAs:'vmm',
    };

    function linkFunction(scope, element, attributes){
      //events for the main menu item
      /* this callback will triggered when something changes sending e.type as the event type */
      scope.vmm.init(element,scope);
    }
    return directive;
  }
})(window, window.angular);
