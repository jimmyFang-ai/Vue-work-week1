
// 使用 ES module 引入 Vue 3 cdn 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

// 引入 api.js 的 login api
import { apiCheckLogin, apiAdminGetProducts, apiAdminRemoveProduct } from './api.js';






// Vue 起手式架構
createApp({
    // 資料(函式)
    data() {
        return {
            // 產品資料格式
            products: [],
            // 儲存單一產品
            tempProduct: {},
        }
    },
    // 資料處理方法(物件)
    methods: {
        // 確認是否登入
        checkLogin() {
            apiCheckLogin()
                .then(res => {
                    console.log(res);
                    // 確認有登入權限後，發送取得全部產品列表 api
                    this.getProdcuts();
                })
                .catch(err => {
                    console.log(err.response);
                    alert(err.response.data.message);
                    window.location = 'login.html';
                })
        },
        // 取得所有產品列表
        getProdcuts() {
            apiAdminGetProducts()
                .then(res => {
                    const { products } = res.data;
                    this.products = products;
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        // 查看單一產品細節
        viewProduct(product) {
            // 避免物件參考特性傳入的 product 要使用拷貝方式賦予到 temp 物件
            this.tempProduct = { ...product };
        },
        // 刪除單一產品
        deleteProduct(product) {
           
           
            // alert(`確定要刪除產品編號 ${product.title} 嗎?`)
         
           

            // // 找出要刪除的產品索引值
            // const deleteId = this.products.findIndex(item => item.id === product.id);
            // // 將索引位置帶入並刪除
            // this.products.splice(deleteId, 1);

            // // 刪除後產品後，把 temp 清空
            // // 避免刪除產品後，單一產品還會顯示資訊
            // this.tempProduct = {};
        },
        // 點擊小圖換大圖
        changeImage(img) {
            this.tempProduct.imageUrl = img;
        }
    },
    // 生命週期(函式)
    // 外部傳入的資料要在 created() 後才能寫入到 data 內
    mounted() {
        // 進入產品頁時，先發送檢查是否登入 API 驗證
        this.checkLogin();
    }
}).mount('#app')

