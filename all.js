

//高雄景點資訊
const card = document.querySelector(".cardContent");
let viewData = [];
axios.get('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json')
    .then(function (response) {
        //console.log('資料已回傳');
        viewData = response.data.result.records;
        console.log(viewData);
        //renderData('全部景點');
        renderZoneSelect();
        //showBtn();
        //監聽是在按鈕被 click 之後才會啟動，所以我們必需在網頁載入時先預設第 1 頁會自動出現
        //changePage(1,pageData);
    });

//景點下拉式選單
const citySelected = document.querySelector('.city-select select');
const tourist = document.querySelector('.cardContent');
//監聽: 當下拉式選單被改變時,觸發selectZone
citySelected.addEventListener('change', selectZone, false);

//function
function renderZoneSelect() {  //下拉式選單賦予值
    const zoneSelect = viewData.map(viewData => {
        return viewData.Zone;
    });
    const zoneList = zoneSelect.filter(function (element, index, array) {
        return array.indexOf(element) === index;
    });
    let str = '';
    str += `<option value='全部景點' class="text-center allviews">  全部景點(${viewData.length})  </option>`;
    //手動加入
    str += `<option class="text-center" value='新興區'>新興區</option>`;
    str += `<option class="text-center" value='鹽埕區'>鹽埕區</option>`;
    for (i = 0; i < zoneList.length; i++) {
        str += `<option class="text-center" value='${zoneList[i]}'>${zoneList[i]}</option>`;
    };
    citySelected.innerHTML = str;
};

//change zone
citySelected.addEventListener('change', selectZone, false);
selectedArea = document.querySelector('.selectedArea');
function selectZone() {
    selectedArea.textContent = citySelected.value;
    renderData(citySelected.value);
};


const topHotView = document.querySelector(' .hotViews ');
topHotView.addEventListener('click', renderHotView, false);
//render 熱門景點
function renderHotView(e) {
    //console.log(e.target.innerText);
    if (e.target.nodeName === 'BUTTON') {
        selectedArea.textContent = e.target.innerText;
        renderData(selectedArea.textContent);
        //景點標題變更時,下拉式選單內容也跟著變
        return citySelected.value = e.target.innerText;
    }
};

selectedArea.addEventListener('change', renderData, false);
const select = selectedArea.textContent;
//render 選取的景點
function renderData(select) {
    let str = '';
    viewData.forEach(function (item, index) {
        if (select == item.Zone) {
            str += `<div class="cardContent  mx-auto card mb-3 ">

                        <div class="card-top p-2" style="background-image:url('${item.Picture1}');max-height:200px;background-size:cover;background-position:center;">
                            <div class="d-flex justify-content-between">
                                <span class="text-white">${item.Name}</span>
                                <span class="text-white p">${item.Zone}</span>
                            </div>
                        </div>
                        <div class="card-body text-start">
                            <p><img src="assets/images/icons_clock.png" alt="clock">${item.Opentime}</p>
                            <p><img src="assets/images/icons_pin.png" alt="clock">${item.Add}</p>
                            <div class="d-flex justify-content-between">
                                <span><img src="assets/images/icons_phone.png" alt="clock">886-7-2363357</span>
                                <span><img src="assets/images/icons_tag.png" alt="clock">${item.Ticketinfo}</span>
                            </div>
                        </div>
                </div>`
        }
        else if (select == '全部景點') {
            str += `<div class="cardContent  mx-auto card mb-3 ">

                      <div class="card-top p-2" style="background-image:url('${item.Picture1}');max-height:200px;background-size:cover;background-position:center;">
                          <div class="d-flex justify-content-between">
                              <span class="text-white">${item.Name}</span>
                              <span class="text-white p">${item.Zone}</span>
                          </div>
                      </div>
                      <div class="card-body text-start">
                          <p><img src="assets/images/icons_clock.png" alt="clock">${item.Opentime}</p>
                          <p><img src="assets/images/icons_pin.png" alt="clock">${item.Add}</p>
                          <div class="d-flex justify-content-between">
                              <span><img src="assets/images/icons_phone.png" alt="clock">886-7-2363357</span>
                              <span><img src="assets/images/icons_tag.png" alt="clock">${item.Ticketinfo}</span>
                          </div>
                      </div>
              </div>`
        }
    })
    card.innerHTML = str;
}


//pagincation
$('.pagination').pagination({
    dataSource: viewData,
    pageSize: 6,
    autoHidePrevious: true,
    autoHideNext: true,
    callback: function(data, pagination) {
        // template method of yourself
        let html = template(data);
        dataContainer.html(html);
    }
})



//製作分頁: logic - 1.每一頁要顯示的資料數量 2.資料總數量 3.總頁數
/*     function showBtn(){
        const pagination=document.querySelector('.pagination');  
        const btnNum=Math.ceil(viewData.length/6);
        //console.log(btnNum);
        //插入頁數按鈕
        var str='';
        for (var i=0;i<btnNum;i++){
            str+=`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`
        };
        pagination.innerHTML=` <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <!--頁數-->
                ${str}
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`;
        //每顆按鈕做監聽，當它有 click 這個動作時，我們會執行 function
        var btn=document.querySelectorAll('.pagination .page-link');
        for (var i=0;i<btn.length;i++){
                //btn[i].addEventListener('click', changePage, false);
                btn[i].addEventListener('click', changePage.bind(this,(i+1),viewData));
            };
    };
    let pageData=[];
    function changePage(page,pageData){
        //alert('hello')
        const items=6; //每頁出現的項目數量
        //陣列索引值卻是 0～9 的資料
        //每頁起始值及結束值的索引值
        const pageIndexStart = (page-1)*items; 
        const pageIndexEnd = page * items; //
        pageData = viewData.map(function(item, index, arr) {
            return index===(page*items)-items;
            
        });
        console.log(pageData);
        //要塞資料用
        let str='';
        pageData.forEach(function (item, index) {
        for (let i=pageIndexStart;i<pageIndexEnd;i++){
        if (i>=pageData.length){break;}
        str+=`<div class="cardContent  mx-auto card mb-3 ">
                <div class="card-top p-2" style="background-image:url('${item.Picture1}');max-height:200px;background-size:cover;background-position:center;">
                    <div class="d-flex justify-content-between">
                        <span class="text-white">${item.Name}</span>
                        <span class="text-white p">${item.Zone}</span>
                    </div>
                </div>
                <div class="card-body text-start">
                    <p><img src="assets/images/icons_clock.png" alt="clock">${item.Opentime}</p>
                    <p><img src="assets/images/icons_pin.png" alt="clock">${item.Add}</p>
                    <div class="d-flex justify-content-between">
                        <span><img src="assets/images/icons_phone.png" alt="clock">886-7-2363357</span>
                        <span><img src="assets/images/icons_tag.png" alt="clock">${item.Ticketinfo}</span>
                    </div>
                </div>
        </div>`
        };
        card.innerHTML = str;
     });
    };

    //監聽是在按鈕被 click 之後才會啟動，所以我們必需在網頁載入時先預設第 1 頁會自動出現
    changePage(1,pageData);

 */








/* //取得顯示出的資料長度
function pagination(viewData,nowPage) {
    const dataTotal = viewData.length;
    //console.log(viewData.length);
    const pageBtn=document.querySelector('.pagination'); 
    // 要顯示在畫面上的資料數量，預設每一頁只顯示6筆資料。
    const perPage = 6;
    const pageTotal = Math.ceil(dataTotal / perPage);
    console.log(`全部資料:${viewData.length}, 每一頁顯示:${perPage}筆資料`);
    //插入頁數按鈕
    let str='';
    for (var i=0;i<pageTotal;i++){
        str+=`<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`
    };
    pageBtn.innerHTML=` <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
        </a>
    </li>
    <!--頁數-->
    ${str}
    <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li>`;
    //每顆按鈕做監聽，當它有 click 這個動作時，我們會執行 function
    var btn=document.querySelectorAll('.pagination .page-link');
    for (var i=0;i<btn.length;i++){
            btn[i].addEventListener('click', changePage, false);
            //btn[i].addEventListener('click', changePage.bind(this,(i+1),ary));
        };
        function changePage(){
            //alert('hello')
                //當前頁數
                let currentPage=nowPage;
                // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
                if (perPage > pageTotal) {
                    perPage = pageTotal;
                };
                //當切換頁數的時候，資料也必須相對應重新吐給我們,而不是一直停留在同一頁。所以假設顯示在畫面上的資料是 5 筆，
                //那麼它就會吐 第 1 筆~第5筆資料，如果我們在第二頁時，那麼資料就會吐第 6 筆 ~ 第 10 筆的資料。所以最小值公式就是這樣。
                const minData = (currentPage * perPage) - perPage + 1;
                //公式的解釋:(目前頁面*每一頁顯示得數量)-每一頁顯示得數量，此時會得到 5 這個數字，但是我們是第 6 筆開始，
                //所以要在 +1。
            
                const maxData = (currentPage * perPage);
            
                const page={
                    pageTotal,
                    currentPage,
                    hasPage: currentPage > 1,
                    hasNext: currentPage < pageTotal,
                };
                //針對資料做相關處理
                //先建立新陣列
                const data = [];
                // 這邊必須使用索引來判斷資料位子，所以要使用 index
                viewData.forEach(function(item, index, array){
                    // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
                    const num=index+1;
        
                    // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
                    if(num >= minData && num <= maxData){
                        data.push(item);
                        //console.log(data);
                    };
                    let str = '';
                    data.forEach(function(item,index){
                        console.log(str);
                        /* str += `<div class="cardContent  mx-auto card mb-3 ">

                                    <div class="card-top p-2" style="background-image:url('${item.Picture1}');max-height:200px;background-size:cover;background-position:center;">
                                        <div class="d-flex justify-content-between">
                                            <span class="text-white">${item.Name}</span>
                                            <span class="text-white p">${item.Zone}</span>
                                        </div>
                                    </div>
                                    <div class="card-body text-start">
                                        <p><img src="assets/images/icons_clock.png" alt="clock">${item.Opentime}</p>
                                        <p><img src="assets/images/icons_pin.png" alt="clock">${item.Add}</p>
                                        <div class="d-flex justify-content-between">
                                            <span><img src="assets/images/icons_phone.png" alt="clock">886-7-2363357</span>
                                            <span><img src="assets/images/icons_tag.png" alt="clock">${item.Ticketinfo}</span>
                                        </div>
                                    </div>
                            </div>`;
                    }); */
                    //document.querySelector('.pageArea').innerHTML=str;
                //});
                
        
                /* const items=perPage; //每頁出現的項目數量=perPage
                //陣列索引值卻是 0～9 的資料
                //每頁起始值及結束值的索引值
                var pageIndexStart = (page-1)*items; 
                var pageIndexEnd = page * items; //
                //要塞資料用
                var str='';
                for (var i=pageIndexStart;i<pageIndexEnd;i++){
                //因為只有 36 筆資料，36之後沒有資料，所以出現錯誤
                if (i>=data.length){break;}
                str+=`<div class="col-3" m-3>
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title">I am Title ${data[i]}</h5>
                        <img src="https://fakeimg.pl/50x50/?text=${data[i]}" class="card-img-top" alt="...">
                        <p class="card-text">Test</p>
                    </div>
                    </div>
                </div>`
                };
                document.querySelector('.content .row').innerHTML=str; */
          //});
        //};
//};

//const everyPages=document.querySelector('.page-previous');


//因為要將分頁相關資訊傳到另一個 function 做處理，所以將 page 相關所需要的東西改用物件傳遞。


/* /做換頁動作
 function switchPage(e){
    e.preventDefault();
    const page = e.target.dataset.page;
}; 
everyPages.addEventListener('click',switchPage,false); 
 */ 
