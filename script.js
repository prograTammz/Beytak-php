
//route class, usage: new Route(name,htmlname,init).
//name ex:home,aboutus.
//htmlName ex: home.html,aboutus.html
//builder: function that has building functions the will fill
function Route(name,htmlName,builder){
    this.name = name;
    this.htmlName = htmlName;
    this.builder = builder;
}

//Routing Objects
let home = new Route('home','home.html',()=>{
    fillElm(cityCard, ".city-card-inner", 10, true, 155);
    fillElm(newsCardScroll,".news-card-inner",10,true,300);
    fillData(fillAssetDetail,".featured-home-container","houses");
});
//Fills The fav-body with 12 Items instead of Writting it 12 Times.
let favs = new Route('favs','favs.html',()=>{
    fillElm(favCard, ".fav-body", 12);
});
let posts = new Route('posts', 'posts.html',()=>{
    fillElm(postCard, ".posts-body", 12);
});
let housedetail = new Route('housedetail','housedetail.html',()=>{
    fillElm(similarCard,'.house-detail-similar-houses',6);
});
let search = new Route('search','search.html',()=>{
    fillElm(cityCard, ".search-explore-card-inner", 10, true, 155);
    fillElm(favCard, ".search-result-card-inner", 10);
})
let news = new Route('news','news.html',()=>{
    fillElm(newsCard, ".news-page-Container",10);
})
let advices = new Route('advices','advices.html',()=>{

});
let aboutus = new Route('aboutus','aboutus.html',()=>{

});
let newsDetails = new Route('newsdetail','newsdetail.html',()=>{
    fillElm(browseNewsCard, ".more-news-container",4);
});
let houselist = new Route('houselist','houselist.html',()=>{
    fillElm(assetDetailScroll,".house-detail-card-container",10, true,300);
    fillElm(favCard,".houses-container",8);
});
//When a new Route is being added it should be also pleace in the Routes array (missing part)
let Routes = [home,favs,housedetail,search,posts,news,advices,aboutus,newsDetails,houselist];
let Router = [home];

//init function that fills the page with home.html when page is loaded
function init(){
    goToRoute(Router[0].name);
}

function fillElm(elm,selector,count,scroll = false ,width = 0){
    let container = document.querySelector(selector);
    for (let i = 0; i < count; i++) {
        container.innerHTML += elm;
         
     }
     if(scroll){
        container.style.width = count*width +"px";
     }
}
function fillData(fun,selector,data){
    let container = document.querySelector(selector);
    fetch(`./data/${data}.json`).then((res)=>{
        res.json().then((res)=>{
            container.innerHTML = fun(res);
        })
    })
    
}

//toggleDrawer, scrolls the page to the top with 2 approaches one for all
//browser support and one for IOS safari support,
//then it will stop the scrolling in the body object.
//then it will show the naviation drawer and change the menu button to close
//and vice versa
function toggleDrawer(event){
    document.body.scrollTop= 0;
    document.documentElement.scrollTop = 0;
    var scrollToggled = document.body.classList.toggle("no-scroll");
    var drawerToggled = document.getElementById("navigation-drawer").classList.toggle("show-drawer");
    var menuButtonInner = document.querySelector('.navMenu i');
    if(drawerToggled && scrollToggled && event.target.className == "material-icons"){
        menuButtonInner.innerHTML = "close";
    }else{
        menuButtonInner.innerHTML = "menu";
    }
}



//Listens to any change to the hash(ex:google.com/#ahashlink) and routes to it
 window.addEventListener('hashchange',function(e){
     if(window.location.hash != "home"){
        goToRoute(window.location.hash.substr(1));
         
     }else{
        goToRoute('home');
     }
     
 });
//goToRoute, fills the page with the required path by the name
//loops over each bottomNavelement and remove active css class
//if the navigation drawer is open it will toggle it.
function goToRoute(name){
    let route = Routes.find((route)=>route.name == name)
        Router.push(route);
    window.location.hash = name;
    fillContent(name,route);
    
    var elms = document.getElementsByClassName("bottomNavElm");
    for (let i = 0; i < elms.length; i++) {
        elms[i].classList.remove("active");
        
    }
    try {
        document.querySelector("."+route.name).classList.add("active");
    } catch (error) {
        console.log(`%c There is an error about not finding a DOM element: ${error} `, 'background: #333333; color: white; padding: 20px; border-radius: 10px; font-family: Roboto');
    }
    
    if(document.getElementById("navigation-drawer").classList[0] == "show-drawer"){
        toggleDrawer();
    }
    
}
//it take page name then make a fetch request, after it gets the html
//file it will turn it to text, then it will await and place the content
//in the pageContent DOM element
function fillContent(page,route){
    document.getElementById("pageLoading").classList.toggle("show");
    let pageContent = document.getElementById("pageContent");
    
    fetch(`./views/${page}.html`).then(
        function(res){
            res.text().then(
                (content)=>{
                    pageContent.classList.add("pre-animation");
                    document.getElementById("pageLoading").classList.toggle("show");
                    document.getElementById("pageContent").innerHTML = content;
                    setTimeout(function(){
                        pageContent.classList.remove('pre-animation')
                    },300)
                    route.builder();
                    
                }
            );
        }
    );
}

if(!window.Promise){
    window.Promise = Promise;
}

// if('serviceWorker' in navigator){
//     //registering the service worker with global scope "/" the root folder, which is
//     //the default setting remove the object if not needed.
//     navigator.serviceWorker.register("sw.js",{scope: '/'})
//     //remove if you want, just showing it's a JS promise.
//     .then(()=>console.log("Service worker is working !"))
// }

function previousPage(){
    Router.pop();
    let nextRoute = Router.pop();
    goToRoute(nextRoute.name);
}

function showNumber(event){
    console.log(event.target);
    event.target.classList.toggle("hide");
    document.querySelector(".house-detail-seller-detail").classList.toggle("hide");
}

init();

    