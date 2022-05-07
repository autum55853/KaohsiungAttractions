

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
        pagination(viewData);
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
                //如果被選擇的景點比數大於6筆,則出現分頁,否則"沒有分頁按鈕"
                if(viewData.length>6){
                    pagination(viewData,nowPage=1);
                } else{
                    document.querySelector('.pagination').classList="d-none";
                };
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

const pageId=document.getElementById('pageid');
//製作分頁: logic - 1.每一頁要顯示的資料數量 2.資料總數量 3.總頁數
function pagination(viewData,nowPage){
    //取得資料長度
    const dataTotal=viewData.length;
    //每頁顯示的資料筆數
    const perpage=6;
    //page按鈕總數量=總資料筆數/每頁的資料筆數
    //因為可能有餘數,所以要Math.ceil無條件進位
    const pageTotal=Math.ceil(dataTotal / perpage);
    //console.log(`全部資料:${dataTotal} 每一頁有${perpage}筆資料 總頁數${pageTotal}`);
    //做出當前頁數(PS.避免當前頁數筆總頁數還多)
    let currentPage=nowPage;
    //當 "當前頁數">"總頁數",則讓 "當前頁數"="總頁數"
    if(currentPage > pageTotal){
        currentPage=pageTotal;
    };
    //切換頁數時,畫面上的資料必須相應的更新
    //當前頁面乘以每一頁顯示的數量,再減去每一頁顯示的數量
    const minData=(currentPage * perpage) - perpage + 1;
    const maxData=currentPage * perpage;

    //建立一個新陣列
    const data=[];
    //總資料跑迴圈
    viewData.forEach((item,index)=>{
        // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
        const num=index + 1;
        // 當 num 比 minData 大且又小於 maxData 就push進去新陣列。
        if ( num >= minData && num <= maxData) {
            data.push(item);
        }
    })
    // 因為要將分頁相關資訊傳到另一個 function 做處理，所以將 page 相關所需要的東西改用物件傳遞
    const page={
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < pageTotal,
    };
    showData(data);
    pageBtn(page);
};

function showData(data){
    let str = '';
    data.forEach((item)=>{
        str +=`<div class="cardContent  mx-auto card mb-3 ">

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
    });
    card.innerHTML=str;
    
};
function pageBtn(page){
    let str='';
    const total=page.pageTotal;
    //向前按鈕
    if(page.hasPage){
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) - 1}">Previous</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
    };
    for (let i =1; i <= total; i++) {
        if(Number(page.currentPage) === i) {
            str +=`<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
          } else {
            str +=`<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
          }
    };
    //向後按鈕
    if(page.hasNext) {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`;
    } else {
        str += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
    };
    pageId.innerHTML=str;
};
function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !=='A') return;
    //console.log(e.target);
    const page=e.target.dataset.page;
    pagination(viewData, page);
};
pageId.addEventListener('click',switchPage);